import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { GantryMarketsService } from 'packages/gantry-app/src/app/common/services/gantry-markets.service';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../common/cds-client/models/cds-push-updates.constant';
import { Fixture, Fixtures } from '../../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { Markets, Sports } from '../../../../common/models/gantrymarkets.model';
import { ContentItemPaths } from '../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../common/services/error.service';
import { Log, LogType, LoggerService } from '../../../../common/services/logger.service';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { TennisCdsContent, TennisContentParams } from '../models/tennis-cds-content.model';
import { TennisCdsTemplate } from '../models/tennis-cds-template.constant';

@Injectable({
    providedIn: 'root',
})
export class TennisCdsService extends SportCdsTemplateService {
    errorMessage$ = this.errorService.errorMessage$;
    tennisCdsContent: TennisCdsContent = new TennisCdsContent();
    fixtures$: Observable<Fixtures>;
    tennisContentFromSitecore$: Observable<TennisContentParams>;
    tennisContentFromSitecore: TennisContentParams;
    tennisCdsContent$: Observable<TennisCdsContent>;
    fixture: Fixture;
    fixtures: Fixtures;
    gantryMarkets$: Observable<Array<Markets>>;
    gantryMarkets: Array<Markets>;

    constructor(
        private cdsClientService: CdsClientService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        private sportContentService: SportContentService,
        gantryMarketsService: GantryMarketsService,
    ) {
        super(gantryMarketsService);
    }

    public GetTennisCdsContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtures$ = this.cdsClientService.getFixtures(fixtureId, marketId, gameIds);
        this.tennisContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.tennisCds);
        this.gantryMarkets$ = super.getGantryMarketDataContent();
        this.tennisCdsContent$ = combineLatest([this.fixtures$, this.tennisContentFromSitecore$, this.gantryMarkets$]).pipe(
            map(([fixtures, contentFromSitecore, gantryMarkets]) => {
                if (!!fixtures && fixtures?.fixtures?.length) {
                    this.fixtures = fixtures;
                    this.fixture = fixtures?.fixtures[0];
                    this.gantryMarkets = gantryMarkets;
                    this.tennisContentFromSitecore = contentFromSitecore;
                    this.tennisCdsContent.content = contentFromSitecore;
                    this.tennisCdsContent = this.getTennisCdsContent(this.fixture, this.gantryMarkets, contentFromSitecore);
                } else {
                    throw 'Could not find Tennis data for Url - ' + this.cdsClientService.fixturesUrl;
                }
                return this.tennisCdsContent;
            }),
            catchError((err) => {
                this.errorService.logError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getTennisCdsContent(fixture: Fixture, gantryMarkets: Array<Markets>, tennisContentFromSitecore: TennisContentParams): TennisCdsContent {
        if (!!fixture && fixture?.games?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }

            this.tennisCdsContent.sportName = fixture?.sport?.name?.value?.toUpperCase();
            this.tennisCdsContent.title = StringHelper.getCdsFixtureTitle(fixture?.name?.value);
            this.tennisCdsContent.eventStartDate = fixture?.startDate;
            this.tennisCdsContent.competitionName = fixture?.competition?.name?.value;
            this.tennisCdsContent.context = fixture?.context;
            const matchBettingTemplate = gantryMarkets
                ?.find((x) => x.sport == Sports.CdsTennis)
                ?.markets?.find((y) => y.matches?.includes(TennisCdsTemplate.matchBetting));
            const setBettingTemplate = gantryMarkets
                ?.find((x) => x.sport == Sports.CdsTennis)
                ?.markets?.find((y) => y.matches?.includes(TennisCdsTemplate.setBetting));
            fixture?.games?.forEach((x) => {
                if (!!matchBettingTemplate && matchBettingTemplate?.matches?.includes(x?.templateId?.toString())) {
                    x.isMatchBetting = true;
                    x.matchSetBettingId = 1;
                } else if (!!setBettingTemplate && setBettingTemplate?.matches?.includes(x?.templateId?.toString())) {
                    x.isSetBetting = true;
                    x.matchSetBettingId = 2;
                }
            });
            this.tennisCdsContent.games = [];
            const gamesArray = fixture?.games;
            if (!!gamesArray && gamesArray?.length > 0) {
                gamesArray?.sort((a, b) => Number(a.matchSetBettingId) - Number(b.matchSetBettingId));
            }
            gamesArray?.forEach((x, index) => {
                if (x.isSetBetting) {
                    for (let i = 0; i < x.results.length; i++) {
                        let reverseIndex = -1;
                        const isSetBetting = this.tennisCdsContent?.games[index]?.setBetting?.some((y) => {
                            return y.scorePoint == x.results[i]?.name?.value?.replace(':', '-');
                        });
                        const reversedValue = x.results[i]?.name?.value?.replace(':', '-').split('').reverse().join('');
                        const isReverseSetBetting = this.tennisCdsContent?.games[index]?.setBetting?.some((y, rIndex) => {
                            reverseIndex = rIndex;
                            return y.scorePoint == reversedValue;
                        });

                        if (!isSetBetting && !isReverseSetBetting) {
                            if (this.tennisCdsContent?.games[index]) {
                                this.tennisCdsContent?.games[index]?.setBetting!.push({
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
                            } else {
                                this.tennisCdsContent?.games.push({
                                    id: x.id,
                                    gameName: tennisContentFromSitecore?.contentParameters?.['SetBetting'] ?? '',
                                    isSetBetting: true,
                                    setBetting: [
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
                            this.tennisCdsContent.games[index].setBetting![reverseIndex].isMatchedPair = true;
                            this.tennisCdsContent.games[index].setBetting![reverseIndex].awayBettingPrice = SportBookMarketHelper.getCdsPriceStr(
                                x?.results[i]?.visibility,
                                x?.results[i]?.numerator,
                                x?.results[i]?.denominator,
                            );
                        }
                    }
                    this.tennisCdsContent.games[index].setBetting!.forEach((x) => {
                        const gameScore = x.scorePoint?.split('-');
                        if (!x.isMatchedPair) {
                            (x.homeBettingPrice = gameScore![0] > gameScore![1] ? x.homeBettingPrice : ''),
                                (x.awayBettingPrice = gameScore![0] > gameScore![1] ? '' : x.awayBettingPrice);
                        }
                    });
                } else if (x.isMatchBetting) {
                    this.tennisCdsContent.games.push({
                        id: x.id,
                        gameName: tennisContentFromSitecore?.contentParameters?.['MatchBetting'] ?? '',
                        isMatchBetting: true,
                        matchBetting: {
                            homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                                x?.results[0]?.visibility,
                                x?.results[0]?.numerator,
                                x?.results[0]?.denominator,
                            ),
                            homePlayer: x.results[0]?.name?.value,
                            awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(
                                x?.results[1]?.visibility,
                                x?.results[1]?.numerator,
                                x?.results[1]?.denominator,
                            ),
                            awayPlayer: x.results[1]?.name?.value,
                            scorePoint: '',
                        },
                        setBetting: [],
                    });
                }
            });
            return this.tennisCdsContent;
        } else {
            const errorMessage = 'Could not find Tennis Content for Url - ' + this.cdsClientService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return new TennisCdsContent();
    }

    public GetUpdatedTennisCdsContent(messageEnvelope: MessageEnvelope): TennisCdsContent {
        let gameIndex = 0;
        if (!!this.fixture && !!messageEnvelope.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
                if (messageEnvelope?.payload?.game?.id) {
                    gameIndex = this.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.game?.id);
                    if (gameIndex != -1) {
                        this.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
                    } else {
                        if (messageEnvelope?.payload?.game?.templateId == TennisCdsTemplate.matchBetting) {
                            this.fixture?.games?.splice(0, 0, messageEnvelope?.payload?.game);
                        } else {
                            this.fixture?.games?.push(messageEnvelope?.payload?.game);
                        }
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
                gameIndex = this.fixture?.games?.findIndex((x) => x.id == messageEnvelope?.payload?.gameId);
                this.fixture?.games.splice(gameIndex, 1);
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                this.fixture.startDate = messageEnvelope?.payload?.startDate;
            }
            return this.getTennisCdsContent(this.fixture, this.gantryMarkets, this.tennisContentFromSitecore);
        }
        return new TennisCdsContent();
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
