import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable, Subscription, interval } from 'rxjs';

import { CdsPushProvider } from '../../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { SelectionNameLength } from '../../../../common/models/general-codes-model';
import { PageSizes, PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { ErrorService } from '../../../../common/services/error.service';
import { Log, LogType, LoggerService } from '../../../../common/services/logger.service';
import { PaginationService } from '../../../../common/services/pagination.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { HomeDrawAwayResult } from '../../../matches/foot-ball/home-draw-away/models/home-draw-away-content.model';
import { HomeDrawAwayService } from '../../../matches/foot-ball/home-draw-away/services/home-draw-away.service';

@Component({
    selector: 'gn-dark-theme-home-draw-away',
    templateUrl: './dark-theme-home-draw-away.component.html',
    styleUrl: './dark-theme-home-draw-away.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeHomeDrawAwayComponent implements OnInit, OnDestroy {
    nameLength = SelectionNameLength.Seventeen;
    homeDrawAwayResult: HomeDrawAwayResult = new HomeDrawAwayResult();
    fixtureId: string[] = [];
    marketIds: string[] = [];
    eventMarketPairs: string;
    tradingPartitionID: string;
    errorMessage$ = this.darkThemeHomeDrawAwayService.errorMessage$;
    homeDrawAwayResult$: Observable<HomeDrawAwayResult>;
    pageTimerSubscription: Subscription;
    paginatedResult: HomeDrawAwayResult;
    pageRefreshTime = 20000;
    pageDetails: PaginationContent = new PaginationContent();
    isPageIntialised = false;

    constructor(
        routeDataService: RouteDataService,
        private cdsPushProvider: CdsPushProvider,
        private paginationService: PaginationService,
        private loggerService: LoggerService,
        private errorService: ErrorService,
        private darkThemeHomeDrawAwayService: HomeDrawAwayService,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.eventMarketPairs = queryParams['eventMarketPairs'];
        this.tradingPartitionID = queryParams['tradingPartition'];
        this.darkThemeHomeDrawAwayService.getFixtureIds(this.eventMarketPairs, this.fixtureId, this.marketIds, this.tradingPartitionID);
        this.pageDetails.pageSize = PageSizes.Eight;
    }

    ngOnInit(): void {
        this.darkThemeHomeDrawAwayService.GetHomeDrawAwayContent(this.fixtureId, this.marketIds, '');
        this.homeDrawAwayResult$ = this.darkThemeHomeDrawAwayService?.homeDrawAwayResult$;
        this.homeDrawAwayResult$.subscribe((result) => {
            this.paginatedResult = result;
            // Pagination logic
            if (!this.isPageIntialised || this.pageDetails?.totalPages == 0) {
                this.isPageIntialised = true;
                this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
                this.clearPageTimer();
                this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                    this.paginationSetup(this.paginatedResult);
                });
            }
            this.paginationService?.calculateTotalPages(this.pageDetails, this.paginatedResult?.homeDrawAwayEvent?.length);

            this.homeDrawAwayResult = result;

            if (this.homeDrawAwayResult?.homeDrawAwayEvent?.length == 0) {
                this.logError(this.cdsClientService?.fixturesUrl, 'Foot-Ball content not found', 'ContentNotFound');
                this.errorService.logError(this.cdsClientService?.fixturesUrl);
            }
            const topics = this.cdsClientService?.getSubscriptionRequestForFixtures(this.darkThemeHomeDrawAwayService?.fixtureData);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });
        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.homeDrawAwayResult = this.darkThemeHomeDrawAwayService.GetUpdatedHomeDrawAwayContent(result);
        });
    }

    logError(url: string, message: string, status: string, fatal: boolean = false) {
        const errorLog: Log = {
            level: LogType.Error,
            message: 'Could not find data for Url: ' + url + ' because ' + message,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(errorLog);
    }
    paginationSetup(resultContent: HomeDrawAwayResult) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent?.homeDrawAwayEvent?.length);
    }

    ngOnDestroy(): void {
        this.clearPageTimer();
    }

    clearPageTimer() {
        if (this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
    }
}
