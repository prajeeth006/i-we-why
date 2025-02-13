import { Component, OnDestroy } from '@angular/core';

import { EMPTY, Subscription, catchError, combineLatest, interval, map, startWith, tap } from 'rxjs';

import { PageSizes, PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { SportBookService } from '../../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../../common/services/error.service';
import { PaginationService } from '../../../../common/services/pagination.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { GreyhoundRacingContentService } from '../../../components/greyhound-racing-template/services/greyhound-racing-content.service';
import { GreyhoundStaticContent } from '../../../models/greyhound-racing-template.model';
import { TrapChallengeResult } from '../../../models/trap-challenge.model';
import { DarkThemeTrapChallengeTemplateService } from './services/dark-theme-trap-challenge-template.service';

@Component({
    selector: 'gn-dark-theme-trap-challenge',
    templateUrl: './dark-theme-trap-challenge.component.html',
    styleUrls: ['./dark-theme-trap-challenge.component.scss'],
})
export class DarkThemeTrapChallengeComponent implements OnDestroy {
    private eventMarketPairs: string;
    pageRefreshTime = 30000;
    errorMessage$ = this.errorService.errorMessage$;
    pageDetails: PaginationContent = new PaginationContent();
    pageTimerSubscription: Subscription;
    isPageIntialised: boolean = false;
    paginatedResult: TrapChallengeResult;
    displayPagination: number = 4;

    constructor(
        private greyhoundRacingContentService: GreyhoundRacingContentService,
        private errorService: ErrorService,
        private routeDataService: RouteDataService,
        private sportBookService: SportBookService,
        private paginationService: PaginationService,
        private trapChallengeService: DarkThemeTrapChallengeTemplateService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        this.eventMarketPairs = queryParams['eventMarketPairs'];
        sportBookService.setEventMarketPairs(this.eventMarketPairs);
        sportBookService.setRemoveSuspendedSelections(false);
        this.pageDetails.pageSize = PageSizes.Three;
    }

    greyHoundData$ = this.greyhoundRacingContentService.data$.pipe(
        tap((greyHoundData: GreyhoundStaticContent) => {
            console.log(greyHoundData);
        }),
        startWith({} as GreyhoundStaticContent), // Initial Value
    );

    vm$ = combineLatest([this.sportBookService.data$, this.greyHoundData$]).pipe(
        map(([sportBookResult, greyHoundData]) => {
            const result = this.trapChallengeService.prepareResult(sportBookResult, greyHoundData);
            this.paginatedResult = result;
            if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
                this.isPageIntialised = true;
                this.paginationSetup(this.paginatedResult);
                this.clearPageTimer();
                this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                    this.paginationSetup(this.paginatedResult);
                });
            }
            this.paginationService.calculateTotalPages(this.pageDetails, result?.events?.length);
            return result;
        }),
        tap(() => {
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    paginationSetup(resultContent: TrapChallengeResult) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent.events?.length);
    }

    ngOnDestroy() {
        this.clearPageTimer();
    }

    clearPageTimer() {
        if (this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
    }
}
