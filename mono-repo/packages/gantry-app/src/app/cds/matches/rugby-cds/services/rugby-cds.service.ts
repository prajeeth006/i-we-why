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
import { RugbyCdsTemplate, SelectionsStatus } from '../models/rugby-cds-template.constant';
import { BetDetails, HalfFullBetting, RugbyCdsTemplateResult, RugbyContentParams } from '../models/rugby-cds-template.model';

@Injectable({
    providedIn: 'root',
})
export class RugbyCdsService extends SportCdsTemplateService {
    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        gantryMarketsService: GantryMarketsService,
        private sportContentService: SportContentService,
    ) {
        super(gantryMarketsService);
    }

    rugbyCdsResult: RugbyCdsTemplateResult = new RugbyCdsTemplateResult();
    fixtures$: Observable<Fixtures>;
    rugbyContentFromSitecore$: Observable<RugbyContentParams>;
    rugbyCdsContent$: Observable<RugbyCdsTemplateResult>;
    fixture: Fixture;
    fixtures: Fixtures;
    halfFullBettingList: HalfFullBetting = new HalfFullBetting();
    errorMessage$ = this.errorService.errorMessage$;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;
    homePlayerName: string;
    awayPlayerName: string;
    drawTitle: string;
    isMatchBetting: boolean = false;

    public GetRugbyContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.rugbyContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.rugbyCds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();

        this.rugbyCdsContent$ = combineLatest([this.fixtures$, this.rugbyContentFromSitecore$, this.gantryMarkets$]).pipe(
            map(([fixtures, contentFromSitecore, gantryMarkets]) => {
                if (fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.gantryMarkets = gantryMarkets;
                    this.rugbyCdsResult.content = contentFromSitecore;
                    this.rugbyCdsResult = this.getRugbyCdsResult(this.fixture, this.gantryMarkets);
                    this.rugbyCdsResult.drawTitle = this.drawTitle;
                } else {
                    throw 'Could not find rugby data for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.rugbyCdsResult;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getRugbyCdsResult(fixture: Fixture, gantryMarkets: Array<Markets>): RugbyCdsTemplateResult {
        if (fixture && fixture?.games?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            this.rugbyCdsResult.sportName = fixture?.sport?.name?.value?.toUpperCase();
            this.rugbyCdsResult.title = StringHelper.getCdsFixtureTitle(fixture?.name?.value);
            this.rugbyCdsResult.eventStartDate = fixture?.startDate;
            this.rugbyCdsResult.competitionName = fixture?.competition?.name?.value;
            this.rugbyCdsResult.context = fixture?.context;
            fixture?.games?.forEach((x) => {
                if (this.gantryMarketsService.hasMarket(Sports.CdsRugby, RugbyCdsTemplate.MATCHBETTING, x?.templateId?.toString(), gantryMarkets)) {
                    x.isMatchBetting = true;
                    this.isMatchBetting = true;
                } else if (
                    this.gantryMarketsService.hasMarket(Sports.CdsRugby, RugbyCdsTemplate.HANDICAPBETTING, x?.templateId?.toString(), gantryMarkets)
                ) {
                    x.isMatchHandicap = true;
                } else if (
                    this.gantryMarketsService.hasMarket(Sports.CdsRugby, RugbyCdsTemplate.TOTALMATCHPOINTS, x?.templateId?.toString(), gantryMarkets)
                ) {
                    x.isTotalFrames = true;
                } else if (
                    this.gantryMarketsService.hasMarket(
                        Sports.CdsRugby,
                        RugbyCdsTemplate.FIRSTHANDICAPBETTING,
                        x?.templateId?.toString(),
                        gantryMarkets,
                    )
                ) {
                    x.isFirstMatchHandicap = true;
                } else if (
                    this.gantryMarketsService.hasMarket(Sports.CdsRugby, RugbyCdsTemplate.HALFTIMEFULLTIME, x?.templateId?.toString(), gantryMarkets)
                ) {
                    x.isHalfFullBetting = true;
                }
            });
            this.rugbyCdsResult.games = [];
            const gamesArray = fixture?.games;
            gamesArray?.forEach((x) => {
                if (x.isMatchBetting) {
                    this.prepareMatchBetting(this.rugbyCdsResult, x);
                } else if (x.isMatchHandicap) {
                    this.prepareHandicapBetting(this.rugbyCdsResult, x);
                } else if (x.isTotalFrames) {
                    this.prepareTotalPointsBetting(this.rugbyCdsResult, x);
                } else if (x.isFirstMatchHandicap) {
                    this.prepareFirstMatchHandicapBetting(this.rugbyCdsResult, x);
                } else if (x.isHalfFullBetting && this.isMatchBetting) {
                    this.prepareHalfFullBetting(this.rugbyCdsResult, x);
                }
            });
            //Prepareing Half and Full Market
            const homeBetting: BetDetails[] = [];
            const awayBetting: BetDetails[] = [];
            if (this.rugbyCdsResult?.games?.length > 0) {
                if (this.halfFullBettingList?.allScorerList && this.halfFullBettingList?.allScorerList?.length > 0) {
                    this.halfFullBettingList?.allScorerList?.forEach((selection) => {
                        const betDetails = new BetDetails();
                        const selectionSplit = selection?.betName?.split('/');
                        if (this.homePlayerName?.includes(selectionSplit[0]?.trim()) && this.homePlayerName.includes(selectionSplit[1]?.trim())) {
                            betDetails.betName = selectionSplit[0]?.trim();
                            betDetails.betOdds = selection.betOdds;
                            homeBetting.push(betDetails);
                        } else if (
                            this.awayPlayerName?.includes(selectionSplit[0]?.trim()) &&
                            this.awayPlayerName.includes(selectionSplit[1]?.trim())
                        ) {
                            betDetails.betName = selectionSplit[0]?.trim();
                            betDetails.betOdds = selection.betOdds;
                            awayBetting.push(betDetails);
                        }
                    });
                }
                this.rugbyCdsResult.rightBetList = awayBetting;
                this.rugbyCdsResult.leftBetList = homeBetting;
            } else {
                const errorMessage = 'Could not find rugby Content for Url - ' + this.cdsClientService.fixturesUrl;
                this.errorService.setError(errorMessage);
            }
            return this.rugbyCdsResult;
        } else {
            const errorMessage = 'Could not find rugby Content for Url - ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return new RugbyCdsTemplateResult();
    }

    prepareMatchBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
        this.homePlayerName = x.results[0] ? x.results[0]?.name?.value : '';
        this.awayPlayerName = x?.results[2] ? x?.results[2]?.name?.value : '';
        this.setDrawTitle(x);
        rugbyCdsResult?.games?.push({
            id: x.id,
            gameName: x.name?.value?.toUpperCase(),
            isMatchBetting: true,
            matchBetting: {
                homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
                homePlayer: x.results[0] ? x.results[0]?.name?.value : '',
                drawPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
                drawPlayer: x?.results[1] ? x?.results[1]?.name?.value?.toUpperCase() : '',
                awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[2]?.visibility, x?.results[2]?.numerator, x?.results[2]?.denominator),
                awayPlayer: x?.results[2] ? x?.results[2]?.name?.value : '',
                drawSuspended: x?.results[1]?.visibility == SelectionsStatus.Suspended ? true : false,
            },
        });
    }

    prepareHandicapBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
        rugbyCdsResult?.games?.push({
            id: x.id,
            gameName: x.name?.value?.toUpperCase(),
            isHandicapBetting: true,
            handicapBetting: {
                homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
                homePlayer: x?.results[1] ? this.getPlayerName(x.results[0]?.name.value) : '',
                awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
                awayPlayer: x?.results[1] ? this.getPlayerName(x.results[1]?.name.value) : '',
            },
        });
    }

    prepareTotalPointsBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
        rugbyCdsResult?.games?.push({
            id: x.id,
            gameName: x.name?.value?.toUpperCase(),
            isTotalPointsBetting: true,
            totalPointsBetting: {
                homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
                homePlayer: x.results[0] ? x.results[0]?.name?.value?.replace(',', '.') : '',
                awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
                awayPlayer: x?.results[1] ? x?.results[1]?.name?.value?.replace(',', '.') : '',
            },
        });
    }

    prepareFirstMatchHandicapBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
        rugbyCdsResult?.games?.push({
            id: x.id,
            gameName: x.name?.value?.toUpperCase(),
            isFirstHanicapBetting: true,
            firstHanicapBetting: {
                homePrice: SportBookMarketHelper.getCdsPriceStr(x?.results[0]?.visibility, x?.results[0]?.numerator, x?.results[0]?.denominator),
                homePlayer: x?.results[1] ? this.getPlayerName(x.results[0]?.name.value) : '',
                awayPrice: SportBookMarketHelper.getCdsPriceStr(x?.results[1]?.visibility, x?.results[1]?.numerator, x?.results[1]?.denominator),
                awayPlayer: x?.results[1] ? this.getPlayerName(x.results[1]?.name.value) : '',
            },
        });
    }

    prepareHalfFullBetting(rugbyCdsResult: RugbyCdsTemplateResult, x: Game) {
        this.halfFullBettingList.allScorerList = new Array<BetDetails>();
        if (this.gantryMarketsService.hasMarket(Sports.CdsRugby, RugbyCdsTemplate.HALFTIMEFULLTIME, x?.templateId?.toString(), this.gantryMarkets)) {
            x.results?.forEach((Selection) => {
                const betDetails = new BetDetails();
                betDetails.betName = Selection.name.value;
                betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(Selection?.visibility, Selection?.numerator, Selection?.denominator);
                this.halfFullBettingList.allScorerList!.push(betDetails);
            });

            rugbyCdsResult?.games?.push({
                id: x.id,
                gameName: x.name?.value?.toUpperCase(),
                isHalfFullBetting: true,
                halfFullBetting: this.halfFullBettingList.allScorerList,
            });
        }
    }

    getPlayerName(playerName: string): string {
        let selectionName = '';
        if (playerName) {
            const teamSelectionItems = playerName?.replace(/\s/g, ''); //Remove all spaces from SelectonName
            //Ex: "selectionName":"Neil Robertson 10-2"
            //Res: "NeilRobertson10-2"
            const selectScoreNumber = teamSelectionItems
                ?.trim()
                ?.substr(teamSelectionItems.length - 5)
                ?.replace(',', '.'); //We take last 5 characters from teamSelectionItems
            //Ex: "NeilRobertson10-2"
            //Res:10-2
            const scoreNumber = selectScoreNumber?.split(')')[1]?.trim()
                ? selectScoreNumber?.split(')')[1]?.trim()
                : selectScoreNumber?.replace(/[^\d.+-]/g, ''); //Remove alphabets from selectScoreNumber
            //Ex: "ON10-2"
            //Res:10-2
            //Final Response :10-2
            let splitSelectionName = playerName?.replace(/\(.*?\)/g, '');
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
            selectionName = splitSelectionName + ' ' + scoreNumber;
        }

        return selectionName;
    }

    getSelectionName(playerName1: string, playerName2: string): string {
        let selectionName = '';
        if (playerName1) {
            selectionName = playerName1?.toLowerCase() == 'tie' ? playerName2 : playerName1;
        }
        return selectionName?.toUpperCase();
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

    public GetUpdatedRugbyCdsContent(messageEnvelope: MessageEnvelope): RugbyCdsTemplateResult {
        let gameIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
                if (messageEnvelope?.payload?.game?.id) {
                    gameIndex = this.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.game?.id);
                    if (gameIndex != -1) {
                        this.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
                    } else {
                        this.fixture?.games?.push(messageEnvelope?.payload?.game);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
                gameIndex = this.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.gameId);
                const getMatchBetting = this.fixture?.games?.find((a) => a.isMatchBetting == true);
                if (!!getMatchBetting && getMatchBetting?.isMatchBetting == true) {
                    this.isMatchBetting = false;
                }
                this.fixture?.games.splice(gameIndex, 1);
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getRugbyCdsResult(this.fixture, this.gantryMarkets);
        }
        return new RugbyCdsTemplateResult();
    }

    private setDrawTitle(game: Game) {
        if (game.results && game.results[1]) {
            this.drawTitle = StringHelper.setDrawValue(
                game.results[1]?.name.value,
                this.rugbyCdsResult.content?.contentParameters ? this.rugbyCdsResult.content?.contentParameters?.Draw : '',
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
