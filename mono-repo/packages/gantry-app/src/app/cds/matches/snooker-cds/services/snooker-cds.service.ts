import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Fixtures, Game } from '../../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { Markets, Sports } from '../../../../common/models/gantrymarkets.model';
import { SelectionNameLength } from '../../../../common/models/general-codes-model';
import { ContentItemPaths } from '../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { Log, LogType, LoggerService } from '../../../../common/services/logger.service';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { SelectionsStatus, SnookerMarket } from '../models/snooker-cds-template.constant';
import { BetDetails, CorrectScorer, SnookerCdsTemplateResult, SnookerContentParams } from '../models/snooker-cds-template.model';

@Injectable({
    providedIn: 'root',
})
export class SnookerCdsService extends SportCdsTemplateService {
    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        gantryMarketsService: GantryMarketsService,
        private sportContentService: SportContentService,
    ) {
        super(gantryMarketsService);
    }

    snookerCdsResult: SnookerCdsTemplateResult = new SnookerCdsTemplateResult();
    fixtures$: Observable<Fixtures>;
    snookerContentFromSitecore$: Observable<SnookerContentParams>;
    snookerCdsContent$: Observable<SnookerCdsTemplateResult>;
    fixture: Fixture;
    fixtures: Fixtures;
    correctScorer: CorrectScorer = new CorrectScorer();
    errorMessage$ = this.errorService.errorMessage$;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;
    drawTitle: string;
    isMatchBetting: boolean = false;

    public GetSnookerContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.snookerContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.snookerCds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();

        this.snookerCdsContent$ = combineLatest([this.fixtures$, this.snookerContentFromSitecore$, this.gantryMarkets$]).pipe(
            map(([fixtures, contentFromSitecore, gantryMarkets]) => {
                if (!!fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.gantryMarkets = gantryMarkets;
                    this.snookerCdsResult = this.getSnookerCdsResult(this.fixture, this.gantryMarkets);
                    this.snookerCdsResult.drawTitle = this.drawTitle;
                    this.snookerCdsResult.content = contentFromSitecore;
                } else {
                    throw 'Could not find snooker data for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.snookerCdsResult;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getSnookerCdsResult(fixture: Fixture, gantryMarkets: Array<Markets>): SnookerCdsTemplateResult {
        if (!!fixture && fixture?.games?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            this.snookerCdsResult.sportName = fixture?.sport?.name?.value?.toUpperCase();
            this.snookerCdsResult.title = StringHelper.getCdsFixtureTitle(fixture?.name?.value);
            this.snookerCdsResult.eventStartDate = fixture?.startDate;
            this.snookerCdsResult.competitionName = fixture?.competition?.name?.value;
            this.snookerCdsResult.context = fixture?.context;
            fixture?.games?.forEach((game) => {
                if (this.gantryMarketsService.hasMarket(Sports.CdsSnooker, SnookerMarket.MATCHBETTING, game?.templateId?.toString(), gantryMarkets)) {
                    game.isMatchBetting = true;
                    this.isMatchBetting = true;
                } else if (
                    this.gantryMarketsService.hasMarket(Sports.CdsSnooker, SnookerMarket.FRAMEBETTING, game?.templateId?.toString(), gantryMarkets)
                ) {
                    game.isFrameBetting = true;
                } else if (
                    this.gantryMarketsService.hasMarket(Sports.CdsSnooker, SnookerMarket.TOTALFRAMES, game?.templateId?.toString(), gantryMarkets)
                ) {
                    game.isTotalFrames = true;
                } else if (
                    this.gantryMarketsService.hasMarket(Sports.CdsSnooker, SnookerMarket.HANDICAPBETTING, game?.templateId?.toString(), gantryMarkets)
                ) {
                    game.isMatchHandicap = true;
                }
            });
            this.snookerCdsResult.games = [];
            const gamesArray = fixture?.games;
            gamesArray?.forEach((game) => {
                if (game.isMatchBetting) {
                    this.prepareMatchBetting(this.snookerCdsResult, game);
                } else if (game.isFrameBetting && this.isMatchBetting) {
                    this.prepareFramesBetting(this.snookerCdsResult, game);
                } else if (game.isTotalFrames) {
                    this.prepareTotalFramesBetting(this.snookerCdsResult, game);
                } else if (game.isMatchHandicap) {
                    this.prepareHandicapBetting(this.snookerCdsResult, game);
                }
            });
            //Prepareing Player to Score 100 Market
            this.snookerCdsResult.frameBetting = new CorrectScorer();
            this.snookerCdsResult.frameBetting.homeTeamScorerList = new Array<BetDetails>();
            this.snookerCdsResult.frameBetting.awayTeamScorerList = new Array<BetDetails>();
            if (this.snookerCdsResult?.games?.length > 0) {
                const frameBetting = this.snookerCdsResult.games.filter((a) => a.isFrameBetting == true);
                if (frameBetting?.length > 0) {
                    frameBetting?.forEach((selection) => {
                        this.snookerCdsResult.frameBetting.homeTeamScorerList = selection.correctScore?.homeTeamScorerList;
                        this.snookerCdsResult.frameBetting.awayTeamScorerList = selection.correctScore?.awayTeamScorerList;
                    });
                }
            } else {
                const errorMessage = 'Could not find snooker data for Url - ' + this.cdsClientService.fixturesUrl;
                this.errorService.setError(errorMessage);
            }
            return this.snookerCdsResult;
        } else {
            const errorMessage = 'Could not find snooker data for Url - ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return new SnookerCdsTemplateResult();
    }

    prepareMatchBetting(snookerCdsResult: SnookerCdsTemplateResult, game: Game) {
        snookerCdsResult.homeName = game.results[0] ? game.results[0]?.name?.value : '';
        snookerCdsResult.awayName = game?.results[1]
            ? this.getSelectionName(game.results[1]?.name.value, game.results[2] ? game.results[2]?.name?.value : '')
            : '';
        this.setDrawTitle(game);
        snookerCdsResult?.games?.push({
            id: game.id,
            gameName: game.name?.value?.toUpperCase(),
            isMatchBetting: true,
            matchBetting: {
                homePrice: SportBookMarketHelper.getCdsPriceStr(
                    game?.results[0]?.visibility,
                    game?.results[0]?.numerator,
                    game?.results[0]?.denominator,
                ),
                homePlayer: game.results[0] ? game.results[0]?.name?.value : '',
                awayPrice: game?.results[1]
                    ? this.getSelectionPrice(
                          game.results[1]?.name.value,
                          game?.results[1]?.visibility,
                          game?.results[1]?.numerator,
                          game?.results[1]?.denominator,
                          game?.results[2]?.visibility,
                          game?.results[2]?.numerator,
                          game?.results[2]?.denominator,
                      )
                    : '',
                awayPlayer: game?.results[1]
                    ? this.getSelectionName(game.results[1]?.name.value, game.results[2] ? game.results[2].name.value : '')
                    : '',
                drawPrice:
                    game?.results?.length > 2
                        ? SportBookMarketHelper.getCdsPriceStr(
                              game?.results[1]?.visibility,
                              game?.results[1]?.numerator,
                              game?.results[1]?.denominator,
                          )
                        : '',
                drawSuspended: game?.results?.length > 2 && game?.results[1]?.visibility == SelectionsStatus.Suspended ? true : false,
            },
        });
    }

    prepareFramesBetting(snookerCdsResult: SnookerCdsTemplateResult, game: Game) {
        this.correctScorer.homeTeamScorerList = new Array<BetDetails>();
        this.correctScorer.awayTeamScorerList = new Array<BetDetails>();
        game.results?.forEach((homeSelection) => {
            if (homeSelection?.name?.value?.toLowerCase().includes(snookerCdsResult?.homeName?.toLowerCase())) {
                let betDetails = new BetDetails();
                betDetails.betName = homeSelection.name.value?.toUpperCase();
                betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(
                    homeSelection?.visibility,
                    homeSelection?.numerator,
                    homeSelection?.denominator,
                );
                betDetails = this.updateSelectionDetails(betDetails);
                this.correctScorer.homeTeamScorerList?.push(betDetails);
            } else if (homeSelection?.name?.value?.toLowerCase().includes(snookerCdsResult.awayName?.toLowerCase())) {
                let betDetails = new BetDetails();
                betDetails.betName = homeSelection.name.value?.toUpperCase();
                betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(
                    homeSelection?.visibility,
                    homeSelection?.numerator,
                    homeSelection?.denominator,
                );
                betDetails = this.updateSelectionDetails(betDetails);
                this.correctScorer.awayTeamScorerList?.push(betDetails);
            } else if (homeSelection?.name?.value?.toLowerCase()?.includes('draw')) {
                let betDetails = new BetDetails();
                betDetails.betName = homeSelection.name.value?.toUpperCase();
                betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(
                    homeSelection?.visibility,
                    homeSelection?.numerator,
                    homeSelection?.denominator,
                );
                betDetails = this.updateSelectionDetails(betDetails);
                this.correctScorer?.homeTeamScorerList!.push(betDetails);
                this.correctScorer?.awayTeamScorerList!.push(betDetails);
            }
        });
        snookerCdsResult?.games?.push({
            id: game.id,
            gameName: game.name?.value?.toUpperCase(),
            isFrameBetting: true,
            correctScore: {
                homeTeamScorerList: this.correctScorer.homeTeamScorerList,
                awayTeamScorerList: this.correctScorer.awayTeamScorerList,
            },
        });
    }

    prepareTotalFramesBetting(snookerCdsResult: SnookerCdsTemplateResult, game: Game) {
        snookerCdsResult?.games?.push({
            id: game.id,
            gameName: game.name?.value?.toUpperCase(),
            isTotalFrames: true,
            totalFrames: {
                homePrice: SportBookMarketHelper.getCdsPriceStr(
                    game?.results[0]?.visibility,
                    game?.results[0]?.numerator,
                    game?.results[0]?.denominator,
                ),
                homePlayer: game.results[0] ? game.results[0]?.name?.value?.replace(',', '.') : '',
                awayPrice: SportBookMarketHelper.getCdsPriceStr(
                    game?.results[1]?.visibility,
                    game?.results[1]?.numerator,
                    game?.results[1]?.denominator,
                ),
                awayPlayer: game?.results[1] ? game?.results[1]?.name?.value?.replace(',', '.') : '',
            },
        });
    }

    prepareHandicapBetting(snookerCdsResult: SnookerCdsTemplateResult, game: Game) {
        snookerCdsResult?.games?.push({
            id: game.id,
            gameName: game.name?.value?.toUpperCase(),
            isMatchHandicap: true,
            matchHanicap: {
                homePrice: SportBookMarketHelper.getCdsPriceStr(
                    game?.results[0]?.visibility,
                    game?.results[0]?.numerator,
                    game?.results[0]?.denominator,
                ),
                homePlayer: game?.results[1] ? this.getPlayerName(game.results[0]?.name.value) : '',
                awayPrice: SportBookMarketHelper.getCdsPriceStr(
                    game?.results[1]?.visibility,
                    game?.results[1]?.numerator,
                    game?.results[1]?.denominator,
                ),
                awayPlayer: game?.results[1] ? this.getPlayerName(game.results[1]?.name.value) : '',
            },
        });
    }

    public GetUpdatedSnookerCdsContent(messageEnvelope: MessageEnvelope): SnookerCdsTemplateResult {
        let gameIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
                if (messageEnvelope?.payload?.game?.id) {
                    gameIndex = this.fixture?.games?.findIndex((game) => game.id == messageEnvelope?.payload?.game?.id);
                    if (gameIndex != -1) {
                        this.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
                    } else {
                        this.fixture?.games?.push(messageEnvelope?.payload?.game);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
                gameIndex = this.fixture?.games?.findIndex((game) => game.id == messageEnvelope?.payload?.gameId);
                const getMatchBetting = this.fixture?.games?.find((a) => a.isMatchBetting == true);
                if (!!getMatchBetting && getMatchBetting?.isMatchBetting == true) {
                    this.isMatchBetting = false;
                }
                this.fixture?.games.splice(gameIndex, 1);
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getSnookerCdsResult(this.fixture, this.gantryMarkets);
        }
        return new SnookerCdsTemplateResult();
    }

    updateSelectionDetails(teamDetail: BetDetails): BetDetails {
        const teamSelectionItems = teamDetail?.betName?.replace(/\s/g, ''); //Remove all spaces from SelectonName
        //Egame: "selectionName":"Neil Robertson 10-2"
        //Res: "NeilRobertson10-2"
        const selectScoreNumber = teamSelectionItems
            ?.trim()
            ?.substr(teamSelectionItems.length - 5)
            ?.replace(':', '-'); //We take last 5 characters from teamSelectionItems
        //Egame: "NeilRobertson10-2"
        //Res:10-2
        const scoreNumber = selectScoreNumber?.trim()?.replace(/[^-+\d]/g, ''); //Remove alphabets from selectScoreNumber
        //Egame: "ON10-2"
        //Res:10-2
        teamDetail.betName = scoreNumber;
        //Final Response :10-2
        return teamDetail;
    }

    getPlayerName(playerName: string): string {
        let selectionName = '';
        if (playerName) {
            let splitSelectionName = StringHelper.removeCountryfromSelection(playerName);
            //Egame: "selectionName":"Neil Robertson (ENG) 10,2"
            //Res: "Neil Robertson 10,2"
            const scoreNumber = StringHelper.getScoreNumberfromPlayer(splitSelectionName);
            //Egame: "Neil Robertson (ENG) 10,2"
            //Final Response :10.2
            if (splitSelectionName?.includes('-')) {
                splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                    splitSelectionName?.split('-')[0]?.trim(),
                    SelectionNameLength.Fifteen,
                );
            } else if (splitSelectionName?.includes('+')) {
                splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                    splitSelectionName?.split('+')[0]?.trim(),
                    SelectionNameLength.Fifteen,
                );
            } else {
                splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(splitSelectionName?.trim(), SelectionNameLength.Fifteen);
            }
            selectionName = splitSelectionName + ' ' + (scoreNumber ?? '');
        }

        return selectionName;
    }

    getSelectionName(playerName1: string, playerName2: string): string {
        let selectionName = '';
        if (playerName1) {
            selectionName = playerName1?.toLowerCase() == 'tie' ? playerName2 : playerName1;
        }
        return selectionName;
    }

    getSelectionPrice(
        playerName1: string,
        visibility1: string,
        numerator1: number,
        denominator1: number,
        visibility2: string,
        numerator2: number,
        denominator2: number,
    ): string {
        let selectionPrice = '';
        if (playerName1) {
            selectionPrice =
                playerName1?.toLowerCase() == 'tie'
                    ? SportBookMarketHelper.getCdsPriceStr(visibility2, numerator2, denominator2)
                    : SportBookMarketHelper.getCdsPriceStr(visibility1, numerator1, denominator1);
        }
        return selectionPrice;
    }

    private setDrawTitle(game: Game) {
        if (!!game.results && !!game.results[1]) {
            this.drawTitle = StringHelper.setDrawValue(
                game.results[1]?.name.value,
                this.snookerCdsResult?.content?.contentParameters ? this.snookerCdsResult?.content?.contentParameters?.Draw : '',
            );
        }
    }

    logError(message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: message,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }
}
