import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../common/cds-client/models/cds-push-updates.constant';
import { Fixtures } from '../../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { Draw } from '../../../../common/models/general-codes-model';
import { ContentItemPaths } from '../../../../common/models/sport-content/sport-content-parameters.constants';
import { EventDatetimePipe } from '../../../../common/pipes/event-datetime.pipe';
import { ErrorService } from '../../../../common/services/error.service';
import { GantryMarketsService } from '../../../../common/services/gantry-markets.service';
import { Log, LogType, LoggerService } from '../../../../common/services/logger.service';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { BetDetails, GameDetails, GolfCdsTemplateResult, GolfContentParams, GolfData } from '../models/golf-cds-template.model';

@Injectable({
    providedIn: 'root',
})
export class GolfCdsService extends SportCdsTemplateService {
    golfCdsResult: GolfCdsTemplateResult = new GolfCdsTemplateResult();
    fixtureData$: Observable<Fixtures>;
    golfContentFromSitecore$: Observable<GolfContentParams>;
    golfCdsContent$: Observable<GolfCdsTemplateResult>;
    fixtureData: Fixtures;
    errorMessage$ = this.errorService.errorMessage$;

    constructor(
        private cdsPushService: CdsClientService,
        private sportContentService: SportContentService,
        private errorService: ErrorService,
        private loggerService: LoggerService,
        gantryMarketsService: GantryMarketsService,
        private eventDatetimePipe: EventDatetimePipe,
    ) {
        super(gantryMarketsService);
    }

    public GetGolfCdsContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
        this.golfContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.commonContent);

        this.golfCdsContent$ = combineLatest([this.fixtureData$, this.golfContentFromSitecore$]).pipe(
            map(([fixtureData, contentFromSitecore]) => {
                if (fixtureData && fixtureData?.fixtures?.length) {
                    this.fixtureData = fixtureData;
                    this.golfCdsResult.content = contentFromSitecore;
                    this.golfCdsResult = this.getGolfCdsContent(fixtureData);
                } else {
                    throw 'Could not find golf data for Url - ' + this.cdsPushService.fixturesUrl;
                }
                return this.golfCdsResult;
            }),
            catchError((err) => {
                this.errorService.setError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
        return this.cdsPushService.getFixtures(fixtureId, marketId, gameIds);
    }

    public getGolfCdsContent(fixtureData: Fixtures): GolfCdsTemplateResult {
        if (fixtureData && fixtureData?.fixtures?.length > 0) {
            if (this.errorService.isStaleDataAvailable) {
                this.errorService.unSetError();
            }
            const golfResult = new GolfData();
            let golfRunnerDetails: GameDetails[] = [];

            golfRunnerDetails = this.getGolfRunnersDetails(fixtureData, this.golfCdsResult);
            if (golfRunnerDetails && golfRunnerDetails?.length) {
                if (this.errorService.isStaleDataAvailable) {
                    this.errorService.unSetError();
                }
                golfResult.gameDetails = golfRunnerDetails;
                this.golfCdsResult.golfData = golfResult;
            } else {
                const errorMessage = 'Could not find golf Content for Url - ' + this.cdsPushService.fixturesUrl;
                this.errorService.setError(errorMessage);
            }

            this.golfCdsResult.eventDateTimeInputValue = this?.getGolfEventTimeDateFromPipe(
                golfResult.gameDetails ? golfResult.gameDetails : [],
                this.golfCdsResult?.content?.contentParameters ? this.golfCdsResult?.content?.contentParameters?.EventTimeInfo : '',
                this.golfCdsResult?.content ? this.golfCdsResult?.content : new GolfContentParams(),
            );
            if (this.golfCdsResult.eventDateTimeInputValue) {
                this.golfCdsResult.eventDateTimeInputValue = this.golfCdsResult?.eventDateTimeInputValue?.split(' ')[0]?.trim();
            }
        } else {
            const errorMessage = 'Could not find golf Content for Url - ' + this.cdsPushService.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return this.golfCdsResult;
    }

    getGolfRunnersDetails = (fixtureData: Fixtures, golfCdsTemplateResult: GolfCdsTemplateResult) => {
        const golfDetails: GameDetails[] = [];
        if (fixtureData) {
            fixtureData?.fixtures?.map((fixture: any) => {
                if (fixture?.sport) {
                    golfCdsTemplateResult.sportName = fixture?.sport?.name?.value?.toUpperCase();
                }
                if (fixture) {
                    golfCdsTemplateResult.eventStartDate = fixture?.startDate;
                }
                if (fixture?.competition) {
                    golfCdsTemplateResult.competitionName = fixture?.competition?.name?.value?.toUpperCase();
                }
                const RunsList = new Array<BetDetails>();
                fixture?.games?.map((game: any) => {
                    golfCdsTemplateResult.title = game?.name?.value;
                    game.results?.forEach((runners: any) => {
                        const betDetails = new BetDetails();
                        betDetails.betName = StringHelper.RemoveCountryCodeInSelectionName(runners.name.value);
                        betDetails.betName =
                            betDetails.betName?.toLowerCase()?.trim() === Draw.drawName?.toLowerCase()?.trim() ||
                            betDetails.betName?.toLowerCase()?.trim() === Draw.drawNameValue?.toLowerCase()?.trim()
                                ? Draw.drawName
                                : betDetails.betName;
                        betDetails.betOdds = SportBookMarketHelper.getCdsPriceStr(runners?.visibility, runners?.numerator, runners?.denominator);
                        RunsList?.push(betDetails);
                    });
                    super.sortRunScorerList(RunsList);
                    // prepare golf selections
                    golfDetails.push({
                        gameStartTime: new Date(fixture?.startDate),
                        runnerDetails: RunsList,
                    });
                });
            });

            this.sortingByGolfEvent(golfDetails);
            return golfDetails;
        }
        return golfDetails;
    };

    public GetUpdateGolfDataContent(messageEnvelope: MessageEnvelope): GolfCdsTemplateResult {
        let marketIndex = 0;
        let gameIndex = 0;
        if (messageEnvelope?.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
                if (messageEnvelope?.payload?.game?.id) {
                    marketIndex = this.fixtureData?.fixtures?.findIndex((x) => x.id == messageEnvelope?.payload?.fixtureId);
                    if (marketIndex != -1) {
                        gameIndex = this.fixtureData?.fixtures[marketIndex]?.games?.findIndex((y) => y.id == messageEnvelope?.payload?.game?.id);
                        if (gameIndex != -1) {
                            this.fixtureData.fixtures[marketIndex].games[gameIndex] = messageEnvelope?.payload?.game;
                        } else {
                            this.fixtureData.fixtures[marketIndex].games?.push(messageEnvelope?.payload?.game);
                        }
                    }
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
                marketIndex = this.fixtureData?.fixtures?.findIndex((x) => x.id == messageEnvelope?.payload?.fixtureId);
                if (marketIndex != -1) {
                    this.fixtureData.fixtures[marketIndex].startDate = messageEnvelope?.payload?.startDate;
                }
            } else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
                if (messageEnvelope?.payload?.gameId) {
                    marketIndex = this.fixtureData?.fixtures?.findIndex((x) => x.id == messageEnvelope?.payload?.fixtureId);
                    if (marketIndex != -1) {
                        gameIndex = this.fixtureData?.fixtures[marketIndex]?.games?.findIndex((y) => y.id == messageEnvelope?.payload?.gameId);
                        if (gameIndex != -1) {
                            this.fixtureData.fixtures[marketIndex].games.splice(gameIndex, 1);
                        }
                    } else {
                        this.fixtureData?.fixtures?.splice(marketIndex, 1);
                    }
                }
            }
            return this.getGolfCdsContent(this.fixtureData);
        }
        return new GolfCdsTemplateResult();
    }

    sortingByGolfEvent(golfEventData: GameDetails[]) {
        golfEventData?.sort((b, a) => {
            return new Date(b?.gameStartTime)?.getTime() - new Date(a?.gameStartTime)?.getTime();
        });
    }

    getGolfEventTimeDateFromPipe(golfEvent: GameDetails[], eventTimeInfo: string, gantryCommonContent: GolfContentParams): string {
        const timeFormat: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            timeStyle: 'short',
        };
        if (golfEvent && golfEvent?.length > 1) {
            if (
                new Date(golfEvent[0]?.gameStartTime).getDate() != new Date(golfEvent[golfEvent?.length - 1].gameStartTime).getDate() ||
                new Date(golfEvent[0]?.gameStartTime).getMonth() != new Date(golfEvent[golfEvent?.length - 1].gameStartTime).getMonth() ||
                new Date(golfEvent[0]?.gameStartTime).getFullYear() != new Date(golfEvent[golfEvent?.length - 1].gameStartTime).getFullYear()
            ) {
                return `${this.eventDatetimePipe.transform(
                    eventTimeInfo,
                    golfEvent[0]?.gameStartTime,
                    gantryCommonContent,
                    timeFormat,
                    true,
                )} - ${this.eventDatetimePipe.transform(
                    eventTimeInfo,
                    golfEvent.slice(-1)[0]?.gameStartTime,
                    gantryCommonContent,
                    timeFormat,
                    true,
                )}`;
            } else {
                if (golfEvent[0]) {
                    return `${this.eventDatetimePipe.transform(eventTimeInfo, golfEvent[0]?.gameStartTime, gantryCommonContent, timeFormat, true)}`;
                }
            }
        } else {
            if (golfEvent) {
                if (golfEvent[0]) {
                    return `${this.eventDatetimePipe.transform(eventTimeInfo, golfEvent[0]?.gameStartTime, gantryCommonContent, timeFormat, true)}`;
                }
            }
        }
        return '';
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
