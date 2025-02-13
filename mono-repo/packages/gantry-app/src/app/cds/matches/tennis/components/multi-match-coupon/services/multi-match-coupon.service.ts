import { Injectable } from '@angular/core';

import { MessageEnvelope } from '@cds/push';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';

import { SelectionsStatus } from '../../../../../../cds/matches/foot-ball/foot-ball-cds-template/models/foot-ball-model';
import { CdsClientService } from '../../../../../../common/cds-client/cds-client-service.service';
import { CdsPushConstants } from '../../../../../../common/cds-client/models/cds-push-updates.constant';
import { EventDateTime, Fixtures, Result } from '../../../../../../common/cds-client/models/fixture.model';
import { SportBookMarketHelper } from '../../../../../../common/helpers/sport-book-market.helper';
import { StringHelper } from '../../../../../../common/helpers/string.helper';
import { GantryCommonContent } from '../../../../../../common/models/gantry-commom-content.model';
import { ContentItemPaths } from '../../../../../../common/models/sport-content/sport-content-parameters.constants';
import { ErrorService } from '../../../../../../common/services/error.service';
import { GantryCommonContentService } from '../../../../../../common/services/gantry-common-content.service';
import { Log, LogType } from '../../../../../../common/services/logger.service';
import { SportContentService } from '../../../../../../common/services/sport-content/sport-content.service';
import { HomeAway, HomeAwayData, HomeAwayResult, HomeAwaySelection, TennisContentParams } from '../../../models/multi-match-model';

@Injectable({
    providedIn: 'root',
})
export class MultiMatchCouponService {
    errorMessage$ = this.errorService.errorMessage$;
    homeAndAwayResult: HomeAwayData = new HomeAwayData();
    fixtureData$: Observable<Fixtures>;
    gantryCommonContent$: Observable<GantryCommonContent>;
    multiMatchCouponCdsContent$: Observable<HomeAwayData>;
    tennisContent$: Observable<TennisContentParams>;
    loggerService: any;
    fixtureData: Fixtures;
    gantryCommonContent: GantryCommonContent;

    constructor(
        private cdsPushService: CdsClientService,
        private gantryCommonContentService: GantryCommonContentService,
        private errorService: ErrorService,
        private sportContentService: SportContentService,
    ) {}

    public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
        return this.cdsPushService.getFixtures(fixtureId, marketId, gameIds);
    }

    prepareSelection(selection: Result): HomeAwaySelection {
        const selectionObj = new HomeAwaySelection();

        // Check if visibility is 'Suspended' and handle accordingly
        if (selection?.visibility?.toLowerCase() === SelectionsStatus.Suspended?.toLowerCase()) {
            // Handle the case when visibility is 'Suspended'
            selectionObj.price = ''; // or any default value you want to set
            selectionObj.selectionName = ''; // or any default value you want to set
        } else {
            // Handle the case when visibility is not 'Suspended'
            selectionObj.price = SportBookMarketHelper.getCdsPriceStr(selection?.visibility, selection?.numerator, selection?.denominator);
            selectionObj.selectionName = selection?.name?.value ?? '';
        }
        return selectionObj;
    }

    getHomeAwayEvent = (fixtureData: Fixtures, homeAndAwayResult: HomeAwayData) => {
        const homeAwayEvent: HomeAway[] = [];
        if (fixtureData) {
            fixtureData?.fixtures?.map((fixture: any) => {
                if (fixture?.sport) {
                    homeAndAwayResult.sportName = fixture?.sport?.name?.value?.toUpperCase();
                    homeAndAwayResult.competitionName = fixture?.competition?.name?.value?.toUpperCase();
                }
                fixture?.games?.map((game: any) => {
                    // prepare home & away selections
                    homeAwayEvent.push({
                        eventDateTime: new Date(fixture?.startDate),
                        homeSelection: this.prepareSelection(game?.results?.[0]),
                        awaySelection: this.prepareSelection(game?.results?.[1]),
                    });
                });
            });
            return homeAwayEvent;
        }
        return homeAwayEvent;
    };

    public getCdsContent(fixtureId: any, marketId: any, gameIds: any) {
        this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
        this.gantryCommonContent$ = this.gantryCommonContentService?.data$;
        this.tennisContent$ = this.sportContentService.getContent(ContentItemPaths.tennisCds);
        this.multiMatchCouponCdsContent$ = combineLatest([this.fixtureData$, this.gantryCommonContent$, this.tennisContent$]).pipe(
            map(([fixtureData, gantryCommonContent, tennisContent]) => {
                if (!!fixtureData && fixtureData?.fixtures?.length) {
                    this.fixtureData = fixtureData;
                    this.gantryCommonContent = gantryCommonContent;
                    this.homeAndAwayResult = tennisContent;
                    this.homeAndAwayResult = this.getHomeAndAwayResult(fixtureData, gantryCommonContent);
                    this.errorService.isStaleDataAvailable = true;
                    this.errorService.unSetError();
                } else {
                    throw 'Could not find TennisMultiMatchCoupon Content for Url - ' + this.cdsPushService?.fixturesUrl;
                }
                return this.homeAndAwayResult;
            }),
            catchError((err) => {
                this.errorService.setError(err);
                this.logError(err, 'Error');
                return EMPTY;
            }),
            shareReplay(),
        );
    }

    public getHomeAndAwayResult(fixtureData: Fixtures, gantryCommonContent: GantryCommonContent) {
        if (!!fixtureData && fixtureData?.fixtures?.length) {
            if (this.errorService?.isSnapshotDataAvailable) {
                this.errorService.unSetError();
            }
            const result = new HomeAwayResult();
            result.gantryCommonContent = gantryCommonContent;
            let homeAwayEvent: HomeAway[] = [];

            homeAwayEvent = this.getHomeAwayEvent(fixtureData, this.homeAndAwayResult)!;
            result.homeAwayEvent = homeAwayEvent;

            // get EventDateTime for the given selections
            if (result?.homeAwayEvent?.length) {
                if (this.errorService.isStaleDataAvailable) {
                    this.errorService.unSetError();
                }
                result.homeAwayEvent = StringHelper.getTennisMultiMatchActiveSelections(result?.homeAwayEvent);
                StringHelper.sortTennisMultiMatchHomeAwayEvent(result?.homeAwayEvent);
                if (result?.gantryCommonContent) {
                    const eventDateTimes: EventDateTime[] = result?.homeAwayEvent;
                    this.homeAndAwayResult.eventDateTimeInputValue = StringHelper.getDarkThemeEventTimeDateFromPipe(
                        eventDateTimes,
                        result?.gantryCommonContent,
                    );
                }

                this.homeAndAwayResult.result = result;
            } else {
                const errorMessage = 'Could not find TennisMultiMatchCoupon Content for Url - ' + this.cdsPushService?.fixturesUrl;
                this.errorService.setError(errorMessage);
            }
        } else {
            const errorMessage = 'Could not find TennisMultiMatchCoupon Content for Url - ' + this.cdsPushService?.fixturesUrl;
            this.errorService.setError(errorMessage);
        }
        return this.homeAndAwayResult;
    }

    public GetUpdatedHomeDrawAwayContent(messageEnvelope: MessageEnvelope): HomeAwayData {
        let marketIndex = 0;
        let gameIndex = 0;
        if (messageEnvelope?.messageType) {
            if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
                if (messageEnvelope?.payload?.game?.id) {
                    marketIndex = this.fixtureData?.fixtures?.findIndex((x) => x.id == messageEnvelope?.payload?.fixtureId);
                    if (marketIndex != -1) {
                        gameIndex = this.fixtureData.fixtures[marketIndex].games?.findIndex((y) => y.id == messageEnvelope?.payload?.game?.id);
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
            return this.getHomeAndAwayResult(this.fixtureData, this.gantryCommonContent);
        }
        return new HomeAwayData();
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
