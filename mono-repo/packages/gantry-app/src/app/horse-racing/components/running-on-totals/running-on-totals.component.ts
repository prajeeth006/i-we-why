import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';

import { EMPTY, Subscription, catchError, interval, map, tap } from 'rxjs';

import { JsonStringifyHelper } from '../../../common/helpers/json-stringify.helper';
import { PageSizes, PaginationContent } from '../../../common/models/pagination/pagination.models';
import { ErrorService } from '../../../common/services/error.service';
import { PaginationService } from '../../../common/services/pagination.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { RunningOnTotalsContent } from './models/running-on-totals.model';
import { RunningOnTotalsService } from './services/running-on-totals.service';

@Component({
    selector: 'gn-running-on-totals',
    templateUrl: './running-on-totals.component.html',
    styleUrls: ['./running-on-totals.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class RunningOnTotalsComponent implements OnDestroy {
    pageRefreshTime = 20000;
    pageDetails: PaginationContent = new PaginationContent();
    errorMessage$ = this.runningOnTotalsService.errorMessage$;
    isPageIntialised = false;
    pageTimerSubscription: Subscription;
    paginatedResult: RunningOnTotalsContent;

    vm$ = this.runningOnTotalsService.data$.pipe(
        map((runningOnTotalsContent) => {
            this.paginatedResult = runningOnTotalsContent;
            if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
                this.isPageIntialised = true;
                this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
                this.clearPageTimer();
                this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                    this.paginationSetup(this.paginatedResult);
                });
            }
            this.paginationService.calculateTotalPages(this.pageDetails, this.paginatedResult?.typeDetails?.length);
            return runningOnTotalsContent;
        }),
        tap((runningOnTotalsContent: RunningOnTotalsContent) => {
            JSON.stringify(runningOnTotalsContent, JsonStringifyHelper.replacer);

            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    constructor(
        private runningOnTotalsService: RunningOnTotalsService,
        private routeDataService: RouteDataService,
        private paginationService: PaginationService,
        private errorService: ErrorService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const typeId = queryParams['typeIds'];
        this.runningOnTotalsService.setTypeId(typeId);
        this.pageDetails.pageSize = PageSizes.Four;
    }

    paginationSetup(resultContent: RunningOnTotalsContent) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent?.typeDetails?.length);
    }

    ngOnDestroy() {
        this.clearPageTimer();
    }

    clearPageTimer() {
        if (this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
    }
}
