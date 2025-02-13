import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, catchError, combineLatest, map, shareReplay, startWith, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { CdsClientService } from '../../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Fixtures } from '../../../../../common/cds-client/models/fixture.model';
import { JsonStringifyHelper } from '../../../../../common/helpers/json-stringify.helper';
import { SportBookMarketHelper } from '../../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../../common/helpers/string.helper';
import { Markets, Sports } from '../../../../../common/models/gantrymarkets.model';
import { Draw, EventStatus, sourceName } from '../../../../../common/models/general-codes-model';
import { MarketParameters } from '../../../../../common/models/market-parameters.model';
import { ContentItemPaths } from '../../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../../common/services/error.service';
import { GantryMarketsService } from '../../../../../common/services/gantry-markets.service';
import { Log, LogType, LoggerService } from '../../../../../common/services/logger.service';
import { SportContentService } from '../../../../../common/services/sport-content/sport-content.service';
import { FootballContentService } from '../../../../../foot-ball/services/football-content.service';
import { SportCdsTemplateService } from '../../../../common/services/sport-cds-template.service';
import { footBallCds, footBallCdsTemplate, goalValueArray, selectionLength } from '../models/foot-ball-cds-constants-model';
import { FootBallDataContent, Participants, SelectionName, SelectionsStatus } from '../models/foot-ball-model';
import { FootballCDSConstants } from '../models/football-cds-constants';
import {
    BothTeamToScore,
    CorrectScore,
    FinalResult,
    FirstGoalScorer,
    FootBallCdsTemplateResult,
    FootBallContentParams,
    HomeDrawAwaySelection,
    MarketResultModel,
    MatchResultBothTeamToScore,
    MatchSelection,
    Option,
    OptionalMarket,
    Participant,
    PlayerInfo,
} from './../models/foot-ball-cds-template.model';

@Injectable({
    providedIn: 'root',
})
export class FootBallCdsTemplateService extends SportCdsTemplateService {
    fixtures$: Observable<Fixtures>;
    footBallCdsContent: FootBallCdsTemplateResult = new FootBallCdsTemplateResult();
    footBallCdsContent$: Observable<FootBallCdsTemplateResult>;
    footBallContentFromSitecore$: Observable<FootBallContentParams>;
    fixture: Fixture;
    fixtures: Fixtures;
    errorMessage$ = this.errorService.errorMessage$;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;
    footballContent: FootBallDataContent;
    validSelections: string[] = ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1'];
    validDrawSelections: string[] = ['0:0', '1:1', '2:2', '3:3'];
    drawTitle: string;

    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        gantryMarketsService: GantryMarketsService,
        private footballContentService: FootballContentService,
        private sportContentService: SportContentService,
    ) {
        super(gantryMarketsService);
    }

    footballContent$ = this.footballContentService.data$.pipe(
        tap((footballRacingContent: FootBallDataContent) => {
            JSON.stringify(footballRacingContent, JsonStringifyHelper.replacer);
        }),
        startWith({} as FootBallDataContent), // Initial Value
    );

    public prepareFootBallCdsContent(fixtureId: string, marketId: string, gameIds: string) {
        gameIds = '';
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();
        this.footBallContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.footBallCds);
        this.footBallCdsContent$ = combineLatest([
            this.fixtures$,
            this.footballContent$,
            this.gantryMarkets$,
            this.footBallContentFromSitecore$,
        ]).pipe(
            map(([fixtures, footballContent, gantryMarkets, contentFromSitecore]) => {
                if (fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.footballContent = footballContent;
                    this.footBallCdsContent.footBallContent = footballContent;
                    this.gantryMarkets = gantryMarkets;
                    this.footBallCdsContent.content = contentFromSitecore;
                    this.footBallCdsContent = this.getFootBallCdsContent(this.fixture, this.gantryMarkets);
                    this.footBallCdsContent.drawTitle = this.drawTitle;
                } else {
                    throw 'Could not find Football CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
                }
                return this.footBallCdsContent;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    getMatchResult(optionalMarket: OptionalMarket): FinalResult {
        const finalResult: FinalResult = new FinalResult();
        const selections: MatchSelection[] = this.SuspendSelections(optionalMarket?.options);
        finalResult.selections = selections;
        return finalResult;
    }

    getTotalGoals = (optionalMarket: OptionalMarket): any => {
        const allowedGoals = goalValueArray;
        const homePrice = SportBookMarketHelper.getCdsPriceStr(
            optionalMarket?.options?.[0]?.status,
            optionalMarket?.options?.[0]?.price?.numerator,
            optionalMarket?.options?.[0]?.price?.denominator,
        );
        const name = optionalMarket?.options?.[0]?.name?.value?.split(' ')[1]?.replace(',', '.');
        const awayPrice = SportBookMarketHelper.getCdsPriceStr(
            optionalMarket?.options?.[1]?.status,
            optionalMarket?.options?.[1]?.price?.numerator,
            optionalMarket?.options?.[1]?.price?.denominator,
        );

        if (!!homePrice || !!awayPrice) {
            if (allowedGoals.includes(name)) {
                return {
                    homePrice,
                    name,
                    awayPrice,
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    };

    getBothTeamToScoreData = (optionalMarket: OptionalMarket): BothTeamToScore => {
        const selection = {
            homePrice: '',
            homeSelectionTitle: '',
            awayPrice: '',
            awaySelectionTitle: '',
        };

        const initialTitle = optionalMarket?.options?.[0]?.name?.value?.trim().toUpperCase();
        if (initialTitle !== SelectionName.NO) {
            selection.homePrice = SportBookMarketHelper.getCdsPriceStr(
                optionalMarket?.options?.[0]?.status,
                optionalMarket?.options?.[0]?.price?.numerator,
                optionalMarket?.options?.[0]?.price?.denominator,
            );

            // Only set homeSelectionTitle if homePrice is not empty
            if (selection.homePrice) {
                selection.homeSelectionTitle = StringHelper.getCdsFixtureTitle(optionalMarket?.options?.[0]?.name?.value?.trim());
            }

            selection.awayPrice = SportBookMarketHelper.getCdsPriceStr(
                optionalMarket?.options?.[1]?.status,
                optionalMarket?.options?.[1]?.price?.numerator,
                optionalMarket?.options?.[1]?.price?.denominator,
            );

            // Only set awaySelectionTitle if awayPrice is not empty
            if (selection.awayPrice) {
                selection.awaySelectionTitle = StringHelper.getCdsFixtureTitle(optionalMarket?.options?.[1]?.name?.value?.trim());
            }
        } else {
            selection.awayPrice = SportBookMarketHelper.getCdsPriceStr(
                optionalMarket?.options?.[0]?.status,
                optionalMarket?.options?.[0]?.price?.numerator,
                optionalMarket?.options?.[0]?.price?.denominator,
            );
            selection.awaySelectionTitle = StringHelper.getCdsFixtureTitle(optionalMarket?.options?.[0]?.name?.value?.trim());
        }

        return {
            gameName: optionalMarket?.name?.value?.toUpperCase(),
            selections: !!selection.homePrice || !!selection.awayPrice ? [selection] : [],
        };
    };

    getMatchResultAndBothTeamToScoreData = (optionalMarket: OptionalMarket): MatchResultBothTeamToScore => {
        const selection = {
            homePrice: '',
            homeSelectionTitle: '',
            awayPrice: '',
            awaySelectionTitle: '',
        };

        optionalMarket?.options?.map((option: any) => {
            if (option?.name?.value?.includes(Participants.BothTeamtoScore)) {
                const selectionId = option?.parameters?.fixtureParticipant;

                const opponent = optionalMarket?.participants?.filter((participant: Participant) => participant?.id === selectionId)?.[0];
                if (opponent?.properties?.type === Participants.AwayTeam) {
                    selection.homePrice = SportBookMarketHelper.getCdsPriceStr(option?.status, option?.price?.numerator, option?.price?.denominator);

                    // Only set homeSelectionTitle if homePrice is not empty
                    if (selection.homePrice) {
                        selection.homeSelectionTitle = option?.name?.value?.replace(',', '.')?.split(FootballCDSConstants.Ltest_TO_WIN)[0]?.trim();
                    }
                } else {
                    selection.awayPrice = SportBookMarketHelper.getCdsPriceStr(option?.status, option?.price?.numerator, option?.price?.denominator);

                    // Only set awaySelectionTitle if awayPrice is not empty
                    if (selection.awayPrice) {
                        selection.awaySelectionTitle = option?.name?.value?.replace(',', '.')?.split(FootballCDSConstants.Ltest_TO_WIN)[0]?.trim();
                    }
                }
            }
        });

        return {
            gameName: optionalMarket?.name?.value?.toUpperCase(),
            selections: !!selection.homePrice || !!selection.awayPrice ? [selection] : [],
        };
    };

    getCorrectScore(optionalMarket: OptionalMarket, maxLimit: number): CorrectScore {
        const home: any = [];
        const away: any = [];
        const draw: any = [];

        optionalMarket?.options?.forEach((optionalMarket: Option) => {
            const nameValue = optionalMarket?.name?.value;
            const [x, y] = nameValue ? nameValue.split(':') : '';

            if (x && y) {
                const cdsPriceStr = SportBookMarketHelper.getCdsPriceStr(
                    optionalMarket?.status,
                    optionalMarket?.price?.numerator,
                    optionalMarket?.price?.denominator,
                );
                if (this.validSelections?.includes(nameValue)) {
                    home?.push({
                        homeName: this.validSelections[this.validSelections?.indexOf(nameValue)]?.replace(':', '-'),
                        homePrice: cdsPriceStr,
                    });
                } else if (this.validDrawSelections?.includes(nameValue)) {
                    draw?.push({
                        drawName: nameValue?.replace(':', '-'),
                        drawPrice: cdsPriceStr,
                    });
                } else if (this.validSelections?.includes(nameValue?.split('')?.reverse()?.join(''))) {
                    away?.push({
                        awayName: nameValue?.replace(':', '-')?.split('')?.reverse()?.join(''),
                        awayPrice: cdsPriceStr,
                    });
                }
            }
        });

        // Sort away selections by name
        home?.sort((a: any, b: any) => a?.homeName?.localeCompare(b?.homeName));
        away?.sort((a: any, b: any) => a?.awayName?.localeCompare(b?.awayName));

        // Ensure arrays do not exceed MAX_LIMIT
        home.length = Math?.min(home?.length, maxLimit);
        away.length = Math?.min(away?.length, maxLimit);
        draw.length = Math?.min(draw?.length, maxLimit);

        const correctScore = new CorrectScore();
        const selections = [];

        for (let i = 0; i < maxLimit; i++) {
            const selection = new HomeDrawAwaySelection();
            selection.homePrice = home[i]?.homePrice;
            selection.homeSelectionTitle = home[i]?.homeName;
            selection.drawPrice = draw[i]?.drawPrice;
            selection.drawSelectionTitle = draw[i]?.drawName;
            selection.awayPrice = away[i]?.awayPrice;
            selection.awaySelectionTitle = away[i]?.awayName;
            selections.push(selection);
        }

        correctScore.selections = selections;
        return correctScore;
    }

    getFirstGoalScorer = (optionalMarket: OptionalMarket, maxSelections: number): FirstGoalScorer => {
        const noGoalscorer = 'No Goalscorer';
        const homePlayers: PlayerInfo[] = [];
        const awayPlayers: PlayerInfo[] = [];
        const participants = optionalMarket?.participants;
        const selections: any[] = [];

        const optionalMarketOptions = optionalMarket?.options?.filter((option: Option) => {
            return (
                option?.name?.value?.trim()?.toUpperCase() !== noGoalscorer?.toUpperCase() &&
                option.status?.toLowerCase() !== SelectionsStatus.Suspended?.toLowerCase()
            );
        });

        optionalMarketOptions?.forEach((option: Option) => {
            const playerInfo = participants?.find((participant: Participant) => participant?.id === option?.parameters?.fixtureParticipant);

            const teamInfo = participants?.find((p: Participant) => {
                return p?.participantId == playerInfo?.properties?.team;
            });

            if (teamInfo?.properties?.type === Participants.HomeTeam) {
                homePlayers.push({
                    price: SportBookMarketHelper.getCdsGoalScorerPriceStr(option?.status, option?.price?.numerator, option?.price?.denominator),
                    title: option?.name?.value,
                });
            } else if (teamInfo?.properties?.type === Participants.AwayTeam) {
                awayPlayers.push({
                    price: SportBookMarketHelper.getCdsGoalScorerPriceStr(option?.status, option?.price?.numerator, option?.price?.denominator),
                    title: option?.name?.value,
                });
            }
        });

        if (homePlayers?.length || awayPlayers?.length) {
            const maxPlayers = Math.max(homePlayers.length, awayPlayers.length);
            const maxSelectionsCount = maxPlayers < maxSelections ? maxPlayers : maxSelections;
            Array.from({ length: maxSelectionsCount }).map((x, i) => {
                // Check for null, empty, and undefined values before pushing to selections
                if (!!homePlayers[i]?.price || !!homePlayers[i]?.title || !!awayPlayers[i]?.price || !!awayPlayers[i]?.title) {
                    selections.push({
                        homePrice: homePlayers[i]?.price,
                        homeSelectionTitle: homePlayers[i]?.title,
                        awayPrice: awayPlayers[i]?.price,
                        awaySelectionTitle: awayPlayers[i]?.title,
                    });
                }
            });

            selections.sort((a: any, b: any) => a?.homePrice - b?.homePrice);
        }

        return { selections };
    };

    setRowsByMarketData(gamesArray: any[]) {
        const MAX_CORRECT_SCORE_RECORDS = 3;
        const MAX_FIRST_GOAL_SCORER_RECORDS = 4;

        if (gamesArray?.filter((item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.MATCHBETTING?.toLocaleLowerCase())?.length > 0) {
            const marketData = gamesArray?.filter(
                (item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.MATCHBETTING?.toLocaleLowerCase(),
            )[0];
            this.footBallCdsContent.finalResult = this.getMatchResult(marketData);
        }
        if (gamesArray?.filter((item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.CORRECTSCORE?.toLocaleLowerCase())?.length > 0) {
            const marketData = gamesArray?.filter(
                (item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.CORRECTSCORE?.toLocaleLowerCase(),
            )[0];
            this.footBallCdsContent.correctScore = this.getCorrectScore(marketData, MAX_CORRECT_SCORE_RECORDS);
        }
        if (gamesArray?.filter((item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.FIRSTGOALSCORER?.toLocaleLowerCase())?.length > 0) {
            const GoalScore = gamesArray?.filter(
                (item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.FIRSTGOALSCORER?.toLocaleLowerCase(),
            )[0];
            this.footBallCdsContent.firstGoalScorer = this.getFirstGoalScorer(GoalScore, MAX_FIRST_GOAL_SCORER_RECORDS);
        }
    }

    public GetUpdatedFootBallCdsContent(messageEnvelope: MessageEnvelope): FootBallCdsTemplateResult {
        let marketIndex = 0;
        if (messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.optionMarketUpdate) {
                if (messageEnvelope?.payload?.optionMarket?.id && this.fixture?.optionMarkets) {
                    marketIndex = this.fixture?.optionMarkets?.findIndex((x) => x.id == messageEnvelope?.payload?.optionMarket?.id);
                    if (marketIndex != -1) {
                        this.fixture.optionMarkets[marketIndex] = messageEnvelope?.payload?.optionMarket;
                    } else {
                        this.fixture?.optionMarkets?.push(messageEnvelope?.payload?.optionMarket);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.optionMarketDelete) {
                if (messageEnvelope?.payload?.marketId && this.fixture?.optionMarkets) {
                    marketIndex = this.fixture?.optionMarkets?.findIndex((x) => x.id == messageEnvelope?.payload?.marketId);
                    if (marketIndex != -1) {
                        this.fixture?.optionMarkets?.splice(marketIndex, 1);
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getFootBallCdsContent(this.fixture, this.gantryMarkets);
        }
        return new FootBallCdsTemplateResult();
    }

    public getFootBallCdsContent(fixture: Fixture, gantryMarkets: Array<Markets>): FootBallCdsTemplateResult {
        if (fixture && fixture?.optionMarkets?.length) {
            const isAnyMarketsPresent = fixture?.optionMarkets.some((optionMarket) => optionMarket.status == EventStatus.Visible);
            if (isAnyMarketsPresent && fixture?.optionMarkets) {
                fixture.optionMarkets = super.setParticipantsToMarkets(fixture?.optionMarkets, fixture?.participants);
                for (const optionMarket of fixture.optionMarkets) {
                    if (optionMarket.status == EventStatus.Visible) {
                        const options = optionMarket?.options;
                        const isAnyOptionPresent =
                            options?.length && options.some((option: { status: string }) => option.status == EventStatus.Visible);
                        if (isAnyOptionPresent) {
                            if (this.errorService.isStaleDataAvailable) {
                                this.errorService.unSetError();
                            }
                            this.footBallCdsContent.marketResult = new MarketResultModel();
                            this.footBallCdsContent.finalResult = { selections: [] };
                            this.footBallCdsContent.totalGoals = { selections: [] };
                            this.footBallCdsContent.bothTeamScore = { gameName: '', selections: [] };
                            this.footBallCdsContent.matchResultBothTeamScore = { gameName: '', selections: [] };
                            this.footBallCdsContent.firstGoalScorer = { selections: [] };
                            this.footBallCdsContent.correctScore = { selections: [] };
                            const gamesArray = fixture?.optionMarkets;
                            this.footBallCdsContent.marketResult.eventName = StringHelper.getCdsFixtureTitle(fixture?.name?.value);
                            this.footBallCdsContent.marketResult.eventStartDate = fixture?.startDate;
                            this.footBallCdsContent.marketResult.competition = fixture?.competition?.name?.value;

                            if (
                                gamesArray?.filter((item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.MATCHBETTING?.toLocaleLowerCase())
                                    ?.length > 0 &&
                                gamesArray?.filter((item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.CORRECTSCORE?.toLocaleLowerCase())
                                    ?.length > 0 &&
                                gamesArray?.filter(
                                    (item) => item?.name?.value?.toLocaleLowerCase() === footBallCds.FIRSTGOALSCORER?.toLocaleLowerCase(),
                                )?.length > 0
                            ) {
                                this.setRowsByMarketData(gamesArray);
                            } else {
                                gamesArray.map((optionMarkets) => {
                                    const market = this.getMarketName(optionMarkets);
                                    if (
                                        this.gantryMarketsService.hasMarket(
                                            Sports.CdsFootBall,
                                            footBallCdsTemplate.FIGHTBETTING,
                                            market,
                                            gantryMarkets,
                                        )
                                    ) {
                                        this.footBallCdsContent.finalResult = this.getMatchResult(optionMarkets);
                                    } else if (
                                        this.gantryMarketsService.hasMarket(
                                            Sports.CdsFootBall,
                                            footBallCdsTemplate.TOTALGOALSFINISH,
                                            market,
                                            gantryMarkets,
                                        )
                                    ) {
                                        const totalGoalData = this.getTotalGoals(optionMarkets);
                                        totalGoalData && this.footBallCdsContent?.totalGoals?.selections?.push(totalGoalData);
                                    } else if (
                                        this.gantryMarketsService.hasMarket(
                                            Sports.CdsFootBall,
                                            footBallCdsTemplate.BOTHTEAMTOSCORE,
                                            market,
                                            gantryMarkets,
                                        )
                                    ) {
                                        this.footBallCdsContent.bothTeamScore = this.getBothTeamToScoreData(optionMarkets);
                                    } else if (
                                        this.gantryMarketsService.hasMarket(
                                            Sports.CdsFootBall,
                                            footBallCdsTemplate.MATCHRESULTBOTHTEAMTOSCORE,
                                            market,
                                            gantryMarkets,
                                        )
                                    ) {
                                        this.footBallCdsContent.matchResultBothTeamScore = this.getMatchResultAndBothTeamToScoreData(optionMarkets);
                                    } else if (
                                        this.gantryMarketsService.hasMarket(
                                            Sports.CdsFootBall,
                                            footBallCdsTemplate.FIRSTGOALSCORER,
                                            market,
                                            gantryMarkets,
                                        )
                                    ) {
                                        this.footBallCdsContent.firstGoalScorer = this.getFirstGoalScorer(
                                            optionMarkets,
                                            selectionLength.FIRSTGOALSCORERRECORDS,
                                        );
                                    } else if (
                                        this.gantryMarketsService.hasMarket(
                                            Sports.CdsFootBall,
                                            footBallCdsTemplate.CORRECTSCORE,
                                            market,
                                            gantryMarkets,
                                        )
                                    ) {
                                        this.footBallCdsContent.correctScore = this.getCorrectScore(
                                            optionMarkets,
                                            selectionLength.CORRECTSCORERECORDS,
                                        );
                                    }
                                });
                            }

                            this.footBallCdsContent.hasCorrectScoreAndfirstGoalScorer =
                                this.footBallCdsContent?.correctScore?.selections?.length > 0 &&
                                this.footBallCdsContent?.firstGoalScorer?.selections?.length > 0
                                    ? true
                                    : false;
                            return this.footBallCdsContent;
                        } else {
                            optionMarket.status = EventStatus.Suspended;
                            const errorMessage = 'Could not find Football CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
                            this.errorService.setError(errorMessage);
                        }
                    } else {
                        optionMarket.status = EventStatus.Suspended;
                        const errorMessage = 'Could not find Football CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
                        this.errorService.setError(errorMessage);
                    }
                }
            } else {
                const errorMessage = 'Could not find Football CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
                this.errorService.setError(errorMessage);
            }
        } else {
            const errorMessage = 'Could not find Football CDS Content for Url - ' + this.cdsClientService?.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return this.footBallCdsContent;
    }

    getMarketName(optionalMarket: OptionalMarket) {
        let marketName = '';
        const marketParameters: MarketParameters = new MarketParameters();
        const marketDetails = this.footBallCdsContent?.content?.contentParameters?.Football ?? '';
        if (marketDetails) {
            const footballMarketDetails = JSON.parse(marketDetails)[0];
            optionalMarket?.parameters?.forEach((parameter) => {
                marketParameters[parameter.key] = parameter?.value;
            });

            for (const market in footballMarketDetails) {
                const marketData = footballMarketDetails[market];
                if (!!marketData?.MarketType && marketParameters?.MarketType === marketData?.MarketType) {
                    if (!!marketData?.Happening && marketParameters?.Happening === marketData?.Happening) {
                        if (!!marketData?.Period && marketParameters?.Period === marketData?.Period) {
                            if (
                                !!marketData?.DecimalValue &&
                                !!marketParameters?.DecimalValue &&
                                marketData?.DecimalValue?.indexOf(marketParameters?.DecimalValue) !== -1
                            ) {
                                marketName = market;
                                break;
                            } else {
                                marketName = market;
                                break;
                            }
                        }
                    }
                }
            }
        }
        return marketName;
    }

    SuspendSelections(optionsArray: Option[]): MatchSelection[] {
        const selections = {
            draw: { name: '', price: '' },
            home: { name: '', price: '' },
            away: { name: '', price: '' },
        };

        for (const option of optionsArray) {
            const name = StringHelper.getCdsFixtureTitle(option?.name?.value);
            const price = SportBookMarketHelper.getCdsPriceStr(option?.status, option?.price?.numerator, option?.price?.denominator);
            const isSuspended = option?.status?.toUpperCase() === EventStatus.Suspended;
            const selectedOption = option?.name?.value?.toUpperCase();
            const selectedSourceName = option?.sourceName?.value;
            if (selectedOption === Draw.drawNameValue?.toUpperCase() || selectedOption === Draw.drawName?.toUpperCase()) {
                this.drawTitle = StringHelper.setDrawValue(
                    selectedOption,
                    this.footBallCdsContent.content?.contentParameters?.Draw ? this.footBallCdsContent.content?.contentParameters?.Draw : '',
                );
                selections.draw.price = isSuspended ? '' : price;
                selections.draw.name = selections.draw.price ? name : '';
            } else if (selectedSourceName === sourceName.home) {
                selections.home.price = isSuspended ? '' : price;
                selections.home.name = selections.home.price ? name : '';
            } else if (selectedSourceName === sourceName.away) {
                selections.away.price = isSuspended ? '' : price;
                selections.away.name = selections.away.price ? name : '';
            }
        }

        if (!!selections?.home?.price || !!selections?.away?.price || !!selections?.draw?.price) {
            return [
                {
                    homePrice: selections?.home?.price,
                    homeSelectionTitle: selections?.home?.name,
                    awayPrice: selections?.away?.price,
                    awaySelectionTitle: selections?.away?.name,
                    drawPrice: selections?.draw?.price,
                    drawSelectionTitle: selections?.draw?.name,
                },
            ];
        } else {
            return [];
        }
    }

    logError(message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: message,
            status: status,
            fatal: fatal,
        };
        this.loggerService?.log(errorLog);
    }
}
