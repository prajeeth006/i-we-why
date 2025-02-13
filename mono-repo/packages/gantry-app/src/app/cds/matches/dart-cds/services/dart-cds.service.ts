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
import { DartCdsTemplate, SelectionsStatus } from '../models/dart-cds-template.constant';
import { BetDetails, CorrectScorer, DartCdsTemplateResult, DartContentParams } from '../models/dart-cds-template.model';

@Injectable({
    providedIn: 'root',
})
export class DartCdsService extends SportCdsTemplateService {
    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        gantryMarketsService: GantryMarketsService,
        private sportContentService: SportContentService,
    ) {
        super(gantryMarketsService);
    }

    dartCdsResult: DartCdsTemplateResult = new DartCdsTemplateResult();
    fixtures$: Observable<Fixtures>;
    dartContentFromSitecore$: Observable<DartContentParams>;
    dartCdsContent$: Observable<DartCdsTemplateResult>;
    fixture: Fixture;
    fixtures: Fixtures;
    correctScorer: CorrectScorer = new CorrectScorer();
    errorMessage$ = this.errorService.errorMessage$;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;
    drawTitle: string;

    public GetDartContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.dartContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.dartCds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();

        this.dartCdsContent$ = combineLatest([this.fixtures$, this.dartContentFromSitecore$, this.gantryMarkets$]).pipe(
            map(([fixtures, contentFromSitecore, gantryMarkets]) => {
                if (!!fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.gantryMarkets = gantryMarkets;
                    this.dartCdsResult.content = contentFromSitecore;
                    this.dartCdsResult = this.getDartCdsResult(this.fixture, this.gantryMarkets);
                    this.dartCdsResult.drawTitle = this.drawTitle;
                } else {
                    throw 'Could not find dart data for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.dartCdsResult;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getDartCdsResult(fixture: Fixture, gantryMarkets: Array<Markets>): DartCdsTemplateResult {
        if (!!fixture && fixture?.games?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            this.dartCdsResult.sportName = fixture?.sport?.name?.value?.toUpperCase();
            this.dartCdsResult.title = StringHelper.getCdsFixtureTitle(fixture?.name?.value);
            this.dartCdsResult.eventStartDate = fixture?.startDate;
            this.dartCdsResult.competitionName = fixture?.competition?.name?.value;
            this.dartCdsResult.context = fixture?.context;
            fixture?.games?.forEach((gameRecord) => {
                if (
                    this.gantryMarketsService.hasMarket(
                        Sports.CdsDarts,
                        DartCdsTemplate.MATCHBETTING,
                        gameRecord?.templateId?.toString(),
                        gantryMarkets,
                    )
                ) {
                    gameRecord.isMatchBetting = true;
                } else if (
                    this.gantryMarketsService.hasMarket(
                        Sports.CdsDarts,
                        DartCdsTemplate.SELECTEDCORRECTSCORES,
                        gameRecord?.templateId?.toString(),
                        gantryMarkets,
                    )
                ) {
                    gameRecord.isFrameBetting = true;
                } else if (
                    this.gantryMarketsService.hasMarket(Sports.CdsDarts, DartCdsTemplate.MOST180S, gameRecord?.templateId?.toString(), gantryMarkets)
                ) {
                    gameRecord.isTotalFrames = true;
                } else if (
                    this.gantryMarketsService.hasMarket(
                        Sports.CdsDarts,
                        DartCdsTemplate.MATCHHANDICAP,
                        gameRecord?.templateId?.toString(),
                        gantryMarkets,
                    )
                ) {
                    gameRecord.isMatchHandicap = true;
                }
            });
            this.dartCdsResult.games = [];
            const gamesArray = fixture?.games;
            gamesArray?.forEach((game) => {
                if (game.isMatchBetting) {
                    this.prepareMatchBetting(this.dartCdsResult, game);
                } else if (game.isFrameBetting) {
                    this.prepareFramesBetting(this.dartCdsResult, fixture);
                } else if (game.isTotalFrames) {
                    this.prepareTotalFramesBetting(this.dartCdsResult, game);
                } else if (game.isMatchHandicap) {
                    this.prepareHandicapBetting(this.dartCdsResult, game);
                }
            });
            return this.dartCdsResult;
        } else {
            const errorMessage = 'Could not find dart data for Url - ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return new DartCdsTemplateResult();
    }

    prepareMatchBetting(dartCdsResult: DartCdsTemplateResult, game: Game) {
        dartCdsResult.homeName = game.results[0] ? StringHelper.removeCountryfromSelection(game.results[0]?.name?.value) : '';
        dartCdsResult.awayName = game?.results[1]
            ? StringHelper.removeCountryfromSelection(
                  this.getSelectionName(game.results[1]?.name.value, game.results[2] ? game.results[2]?.name?.value : ''),
              )
            : '';
        this.setDrawTitle(game);
        dartCdsResult?.games?.push({
            id: game.id,
            gameName: game.name?.value?.toUpperCase(),
            isMatchBetting: true,
            matchBetting: {
                homePrice: SportBookMarketHelper.getCdsPriceStr(
                    game?.results[0]?.visibility,
                    game?.results[0]?.numerator,
                    game?.results[0]?.denominator,
                ),
                homePlayer: game.results[0] ? StringHelper.removeCountryfromSelection(game.results[0]?.name?.value) : '',
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
                    ? StringHelper.removeCountryfromSelection(
                          this.getSelectionName(game.results[1]?.name.value, game.results[2] ? game.results[2].name.value : ''),
                      )
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

    prepareFramesBetting(dartCdsResult: DartCdsTemplateResult, fixture: Fixture) {
        const gamesArray = fixture?.games;
        gamesArray?.forEach((x, index) => {
            if (x?.isFrameBetting) {
                for (let i = 0; i < x?.results?.length; i++) {
                    let reverseIndex = -1;
                    const game = dartCdsResult && dartCdsResult?.games && dartCdsResult?.games[index];
                    const isFrameBetting =
                        game &&
                        game?.frameBetting &&
                        game?.frameBetting?.some((y) => {
                            return y.scorePoint == x.results[i]?.name?.value?.replace(':', '-');
                        });
                    const reversedValue = x.results[i]?.name?.value?.replace(':', '-')?.split('')?.reverse()?.join('');
                    let currentGame;
                    if (dartCdsResult && dartCdsResult?.games && dartCdsResult?.games[index]) {
                        currentGame = dartCdsResult?.games[index];
                    }
                    const isReverseSetBetting =
                        currentGame &&
                        currentGame?.frameBetting &&
                        currentGame?.frameBetting?.some((y, rIndex) => {
                            reverseIndex = rIndex;
                            return y.scorePoint == reversedValue;
                        });
                    if (!isFrameBetting && !isReverseSetBetting) {
                        if (dartCdsResult && dartCdsResult?.games && dartCdsResult?.games[index]) {
                            const currentGame = dartCdsResult?.games[index];
                            currentGame.frameBetting = currentGame?.frameBetting ?? [];
                            currentGame?.frameBetting?.push({
                                homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                                    x?.results[i]?.visibility,
                                    x?.results[i]?.numerator,
                                    x?.results[i]?.denominator,
                                ),
                                awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                                    x?.results[i]?.visibility,
                                    x?.results[i]?.numerator,
                                    x?.results[i]?.denominator,
                                ),
                                scorePoint: x.results[i]?.name?.value?.replace(':', '-'),
                                isMatchedPair: false,
                            });
                        } else if (dartCdsResult && dartCdsResult?.games) {
                            dartCdsResult?.games.push({
                                id: x.id,
                                isFrameBetting: true,
                                frameBetting: [
                                    {
                                        homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                                            x?.results[i]?.visibility,
                                            x?.results[i]?.numerator,
                                            x?.results[i]?.denominator,
                                        ),
                                        awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                                            x?.results[i]?.visibility,
                                            x?.results[i]?.numerator,
                                            x?.results[i]?.denominator,
                                        ),
                                        scorePoint: x.results[i]?.name?.value?.replace(':', '-'),
                                        isMatchedPair: false,
                                    },
                                ],
                            });
                        }
                    }

                    if (isReverseSetBetting && reverseIndex > -1) {
                        const game = dartCdsResult?.games?.[index];
                        const frameBetting = game?.frameBetting?.[reverseIndex];

                        if (frameBetting) {
                            frameBetting.isMatchedPair = true;
                            frameBetting.awayBettingPrice = SportBookMarketHelper.getCdsPriceStr(
                                x?.results[i]?.visibility ?? '',
                                x?.results[i]?.numerator ?? 0,
                                x?.results[i]?.denominator ?? 0,
                            );
                        }
                    }
                }
                const games = dartCdsResult.games?.[index];
                if (games) {
                    const frameBetting = games?.frameBetting;
                    if (frameBetting) {
                        frameBetting.forEach((x: any) => {
                            const gameScore = x.scorePoint?.split('-');
                            if (gameScore && gameScore?.length > 0 && Number(gameScore[0]) - Number(gameScore[1]) > 0) {
                                x.difference = Number(gameScore[0]) - Number(gameScore[1]);
                            }
                            if (gameScore && !x.isMatchedPair) {
                                const reverseObj = frameBetting?.filter((frame) => frame.scorePoint == gameScore[1] + '-' + gameScore[0])[0];
                                x.homeBettingPrice = Number(gameScore[0]) > Number(gameScore[1]) ? x?.homeBettingPrice : reverseObj?.homeBettingPrice;
                                x.awayBettingPrice = Number(gameScore[0]) > Number(gameScore[1]) ? reverseObj?.awayBettingPrice : x?.awayBettingPrice;
                            }
                        });

                        // Sort frameBetting array based on difference property
                        frameBetting.sort((a: any, b: any) => {
                            return a.difference - b.difference;
                        });
                    }
                }
            }
        });
    }

    prepareTotalFramesBetting(dartCdsResult: DartCdsTemplateResult, game: Game) {
        dartCdsResult?.games?.push({
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

    prepareHandicapBetting(dartCdsResult: DartCdsTemplateResult, game: Game) {
        dartCdsResult?.games?.push({
            id: game.id,
            gameName: game.name?.value?.toUpperCase(),
            isMatchHandicap: true,
            matchHandicap: {
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

    public GetUpdatedDartCdsContent(messageEnvelope: MessageEnvelope): DartCdsTemplateResult {
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
                this.fixture?.games.splice(gameIndex, 1);
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getDartCdsResult(this.fixture, this.gantryMarkets);
        }
        return new DartCdsTemplateResult();
    }

    updateSelectionDetails(teamDetail: BetDetails): BetDetails {
        const teamSelectionItems = teamDetail?.betName?.replace(/\s/g, ''); //Remove all spaces from SelectonName
        //Ex: "selectionName":"10:2"
        //Res: "10-2"
        const selectScoreNumber = teamSelectionItems?.indexOf(':') != -1 ? teamSelectionItems?.trim()?.replace(':', '-') : teamSelectionItems?.trim();
        //Ex: "10:2"
        //Res:10-2
        const scoreNumber = selectScoreNumber?.trim()?.replace(/[^-+\d]/g, ''); //Remove alphabets from selectScoreNumber
        //Ex: "ON10-2"
        //Res:10-2
        teamDetail.betName = scoreNumber;
        //Final Response :10-2
        return teamDetail;
    }

    getPlayerName(playerName: string): string {
        let selectionName = '';
        if (playerName) {
            let splitSelectionName = StringHelper.removeCountryfromSelection(playerName);
            //Ex: "selectionName":"Neil Robertson (ENG) 10,2"
            //Res: "Neil Robertson 10,2"
            const scoreNumber = StringHelper.getScoreNumberfromPlayer(splitSelectionName);
            //Ex: "Neil Robertson (ENG) 10,2"
            //Final Response :10.2
            if (splitSelectionName?.includes('-')) {
                splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                    StringHelper.getPlayerNameExcludingScore(splitSelectionName),
                    SelectionNameLength.Fifteen,
                );
            } else if (splitSelectionName?.includes('+')) {
                splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(
                    StringHelper.getPlayerNameExcludingScore(splitSelectionName),
                    SelectionNameLength.Fifteen,
                );
            } else {
                splitSelectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(splitSelectionName?.trim(), SelectionNameLength.Fifteen);
            }
            selectionName = splitSelectionName?.trim() + ' ' + (scoreNumber ?? '');
        }

        return selectionName;
    }

    getSelectionName(playerName1: string, playerName2: string): string {
        let selectionName = '';
        if (playerName1) {
            selectionName = playerName1?.toLowerCase() == 'draw' ? playerName2 : playerName1;
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
                playerName1?.toLowerCase() == 'draw'
                    ? SportBookMarketHelper.getCdsPriceStr(visibility2, numerator2, denominator2)
                    : SportBookMarketHelper.getCdsPriceStr(visibility1, numerator1, denominator1);
        }
        return selectionPrice;
    }

    private setDrawTitle(game: Game) {
        if (game.results && game.results[1]) {
            this.drawTitle = StringHelper.setDrawValue(
                game.results[1]?.name?.value,
                this.dartCdsResult?.content?.contentParameters?.Draw ? this.dartCdsResult?.content?.contentParameters?.Draw : '',
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
