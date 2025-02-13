import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable, Subscription, interval } from 'rxjs';

import { CdsPushProvider } from '../../../../common/cds-client/cds-client-push.provider';
import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { SelectionNameLength } from '../../../../common/models/general-codes-model';
import { PageSizes, PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { PaginationService } from '../../../../common/services/pagination.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { MultiMatchCouponService } from '../../../matches/tennis/components/multi-match-coupon/services/multi-match-coupon.service';
import { HomeAwayData } from '../../../matches/tennis/models/multi-match-model';

@Component({
    selector: 'gn-dark-theme-multi-match-coupon',
    templateUrl: './dark-theme-multi-match-coupon.component.html',
    styleUrl: './dark-theme-multi-match-coupon.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeMultiMatchCouponComponent implements OnInit, OnDestroy {
    nameLength = SelectionNameLength.Seventeen;
    eventMarketPairs: any;
    homeAndAwayResult: HomeAwayData = new HomeAwayData();
    paginatedResult: any;
    pageDetails: PaginationContent = new PaginationContent();
    pageTimerSubscription: Subscription;
    pageRefreshTime = 20000;
    errorMessage$ = this.multiMatchCouponService.errorMessage$;
    multiMatchCouponCdsContent$: Observable<HomeAwayData>;
    isPageIntialised = false;

    constructor(
        routeDataService: RouteDataService,
        private multiMatchCouponService: MultiMatchCouponService,
        private cdsPushProvider: CdsPushProvider,
        private paginationService: PaginationService,
        private cdsClientService: CdsClientService,
    ) {
        const queryParams = routeDataService?.getQueryParams();
        this.eventMarketPairs = queryParams['eventMarketPairs'];
        this.pageDetails.pageSize = PageSizes.Eight;
    }

    getFixtureAndGameIds() {
        const fixtureIds: string[] = [];
        const gameIds: string[] = [];
        const splitPairs = this.eventMarketPairs?.split(',');

        splitPairs?.forEach((marketPair: any) => {
            const marketPairList = marketPair?.split(':');
            fixtureIds?.push(marketPairList[0]);
            gameIds?.push(marketPairList[1]);
        });
        return [fixtureIds.join(','), gameIds.join(',')];
    }

    ngOnInit(): void {
        const [fixtureIds, gameIds] = this.getFixtureAndGameIds(); // array destructuring
        this.multiMatchCouponService.getCdsContent(fixtureIds, null, gameIds);
        this.multiMatchCouponCdsContent$ = this.multiMatchCouponService.multiMatchCouponCdsContent$;
        this.multiMatchCouponCdsContent$.subscribe((result) => {
            this.homeAndAwayResult = result;
            this.pageDetails.pageSize = result?.contentParameters?.MaxSelectionsperPage
                ? result.contentParameters.MaxSelectionsperPage
                : PageSizes.Eight;
            this.paginatedResult = result.result;
            // Pagination logic
            if (!this.isPageIntialised || this.pageDetails?.totalPages == 0) {
                this.isPageIntialised = true;
                this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
                this.clearPageTimer();
                this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                    this.paginationSetup(this.paginatedResult);
                });
            }
            this.paginationService.calculateTotalPages(this.pageDetails, this.paginatedResult?.homeAwayEvent?.length);
            const topics = this.cdsClientService.getSubscriptionRequestForFixtures(this.multiMatchCouponService?.fixtureData);
            this.cdsPushProvider.onConnectionEstablished.subscribe((isConnection) => {
                if (isConnection) {
                    this.cdsPushProvider.subscribe(topics);
                }
            });
        });
        this.cdsPushProvider.messageReceived$.subscribe((result) => {
            this.homeAndAwayResult = { ...this.multiMatchCouponService.GetUpdatedHomeDrawAwayContent(result) };
        });
    }

    paginationSetup(resultContent: any) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent?.homeAwayEvent?.length);
    }

    ngOnDestroy(): void {
        this.clearPageTimer();
    }

    clearPageTimer() {
        if (this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
    }
}
