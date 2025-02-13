import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, interval } from 'rxjs';

import { CdsPushProvider } from '../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../common/cds-client/cds-client-service.service';
import { SelectionNameLength } from '../../../common/models/general-codes-model';
import { PageSizes, PaginationContent } from '../../../common/models/pagination/pagination.models';
import { PaginationService } from '../../../common/services/pagination.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { GolfCdsTemplateResult } from '../../matches/golf-cds/models/golf-cds-template.model';
import { GolfCdsService } from '../../matches/golf-cds/services/golf-cds.service';

@Component({
    selector: 'gn-dark-theme-golf-cds',
    templateUrl: './dark-theme-golf-cds.component.html',
    styleUrl: './dark-theme-golf-cds.component.scss',
})
export class DarkThemeGolfCdsComponent implements OnInit, OnDestroy {
    nameLength = SelectionNameLength.Seventeen;
    errorMessage$ = this.golfCdsService.errorMessage$;
    eventMarketPairs: any;
    golfCDSContent: GolfCdsTemplateResult = new GolfCdsTemplateResult();
    paginatedResult: any;
    pageDetails: PaginationContent = new PaginationContent();
    pageTimerSubscription: Subscription;
    pageRefreshTime = 20000;
    isPageIntialised = false;
    isPageTimerInProgress = false;
    elapsedTime: number = 0;
    trackInterval: any;

    constructor(
        routeDataService: RouteDataService,
        private cdsPushProvider: CdsPushProvider,
        private cdsClientService: CdsClientService,
        private golfCdsService: GolfCdsService,
        private paginationService: PaginationService,
    ) {
        const queryParams = routeDataService.getQueryParams();
        this.eventMarketPairs = queryParams['eventMarketPairs'];
        this.pageDetails.pageSize = PageSizes.Four;
    }

    getFixtureAndGameIds() {
        const fixtureIds: string[] = [];
        const gameIds: string[] = [];
        const splitPairs = this.eventMarketPairs?.split(',');

        splitPairs?.forEach((marketPair: any) => {
            const marketPairList = marketPair.split(':');
            fixtureIds.push(marketPairList[0]);
            gameIds.push(marketPairList[1]);
        });

        return [fixtureIds.join(','), gameIds.join(',')];
    }

    initializeTracker() {
        this.elapsedTime = 0;
        !!this.trackInterval && this.trackInterval.unsubscribe();
        this.isPageTimerInProgress = false;
        this.trackInterval = interval(1000).subscribe(() => {
            this.trackerCallback();
        });
    }

    trackerCallback() {
        this.elapsedTime = this.elapsedTime + 1;
        const intervalTime = this.pageRefreshTime / 1000;
        if (this.elapsedTime % intervalTime != 0) {
            this.isPageTimerInProgress = true;
        }
    }

    ngOnInit(): void {
        const [fixtureIds, gameIds] = this.getFixtureAndGameIds(); // array destructuring
        this.golfCdsService.GetGolfCdsContent(fixtureIds, null, gameIds);
        this.golfCdsService.golfCdsContent$.subscribe((result) => {
            this.golfCDSContent = result;
            this.paginatedResult = result;
            // Pagination logic
            if (!this.isPageIntialised || this.pageDetails?.totalPages == 0) {
                this.isPageIntialised = true;
                this.paginationSetup(this.paginatedResult, false); //show first page immediately as we get data
                this.clearPageTimer();
                this.initializeTracker();
                this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                    this.paginationSetup(this.paginatedResult);
                    this.initializeTracker();
                });
            }
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.golfCdsService.fixtureData);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });

        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            if (!!result && result.messageType !== 'ConnectionAck') {
                this.golfCDSContent = { ...this.golfCdsService.GetUpdateGolfDataContent(result) };
                if (this.isPageTimerInProgress) {
                    this.resetPaginationSetup(this.pageDetails, this.golfCDSContent);
                }
            }
        });
    }

    paginationSetup(resultContent: any, haveToMoveNextPage: boolean = true) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent?.golfData?.gameDetails?.length, haveToMoveNextPage);
    }

    resetPaginationSetup(paginationContent: PaginationContent, golfCDSContent: GolfCdsTemplateResult) {
        if (golfCDSContent?.golfData?.gameDetails?.length) {
            const totalPages = Math.ceil(golfCDSContent?.golfData?.gameDetails?.length / paginationContent.pageSize);
            if (paginationContent.currentPageNumber > totalPages) {
                paginationContent.currentPageNumber = 0;
                this.paginationSetup(this.paginatedResult);
                this.clearPageTimer();
                this.initializeTracker();
                this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                    this.paginationSetup(this.paginatedResult);
                    this.initializeTracker();
                });
            } else {
                this.paginationSetup(this.golfCDSContent, false);
            }
        }
    }

    ngOnDestroy(): void {
        this.clearPageTimer();
    }

    clearPageTimer() {
        if (this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
    }
}
