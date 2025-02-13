import { Component, OnDestroy } from '@angular/core';

import { EMPTY, Subscription, catchError, interval, map, tap } from 'rxjs';

import { JsonStringifyHelper } from '../../../../common/helpers/json-stringify.helper';
import { PageSizes, PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { FavouriteTags } from '../../../../common/models/racing-tags.model';
import { PaginationService } from '../../../../common/services/pagination.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { GreyhoundMeetingResults, GreyhoundMeetingResultsTemplate } from '../../../models/greyhound-racing-meeting-results.model';
import { DarkThemeGreyhoundMeetingResultsService } from './services/dark-theme-greyhound-meeting-results.service';

@Component({
    selector: 'gn-dark-theme-greyhounds-meeting-results',
    templateUrl: './dark-theme-greyhounds-meeting-results.component.html',
    styleUrls: ['./dark-theme-greyhounds-meeting-results.component.scss'],
})
export class DarkThemeGreyhoundsMeetingResultsComponent implements OnDestroy {
    pageRefreshTime = 30000;
    pageDetails: PaginationContent = new PaginationContent();
    isPageIntialised: boolean = false;
    pageTimerSubscription: Subscription;
    paginatedResult: GreyhoundMeetingResultsTemplate;
    favouriteTags = FavouriteTags;

    fillerPageMessage$ = this.darkThemeGreyhoundMeetingResultsService.fillerPageMessage$;
    errorMessage$ = this.darkThemeGreyhoundMeetingResultsService.errorMessage$;

    vm$ = this.darkThemeGreyhoundMeetingResultsService.data$.pipe(
        map((greyhoundMeetingResultsTemplate) => {
            this.paginatedResult = greyhoundMeetingResultsTemplate;
            this.deadHeatPagination(this.paginatedResult); //Prepare deadheat pagination data
            if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
                this.isPageIntialised = true;
                this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
                this.clearPageTimer();
                this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                    this.paginationSetup(this.paginatedResult);
                });
            }
            this.paginationService.darkThemeCalculateTotalPages(this.pageDetails, this.paginatedResult?.greyhoundMeetingResultsTable?.length);

            return greyhoundMeetingResultsTemplate;
        }),
        tap((greyhoundMeetingResultsTemplate: GreyhoundMeetingResultsTemplate) => {
            JSON.stringify(greyhoundMeetingResultsTemplate, JsonStringifyHelper.replacer);
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private darkThemeGreyhoundMeetingResultsService: DarkThemeGreyhoundMeetingResultsService,
        private routeDataService: RouteDataService,
        private paginationService: PaginationService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const typeId = queryParams['typeid'];
        this.darkThemeGreyhoundMeetingResultsService.setTypeId(typeId);
        this.pageDetails.pageSize = PageSizes.Eight;
    }

    paginationSetup(resultContent: GreyhoundMeetingResultsTemplate) {
        this.paginationService.darkThemePaginationSetup(this.pageDetails, resultContent?.greyhoundMeetingResultsTable?.length);
    }

    deadHeatPagination(resultContent: GreyhoundMeetingResultsTemplate) {
        for (let i = 1; i < resultContent?.greyhoundMeetingResultsTable?.length; i++) {
            const index = this.pageDetails.pageSize * i; //creating index for each page
            if (resultContent.greyhoundMeetingResultsTable.length - 1 >= index) {
                // checking for the last element(row) in the page
                const deadHeat = resultContent?.greyhoundMeetingResultsTable[index]?.isDeadHeat;
                const runnerDeadHeat = resultContent?.greyhoundMeetingResultsTable[index]?.runnerList?.find((x) => x.isDeadHeat);
                if (deadHeat && runnerDeadHeat) {
                    const greyhoundMeetingResults: GreyhoundMeetingResults = new GreyhoundMeetingResults();
                    resultContent?.greyhoundMeetingResultsTable.splice(index - 1, 0, greyhoundMeetingResults); // creating empty row when deadHeat is found at the last element
                }
            } else {
                break;
            }
        }
    }

    ngOnDestroy() {
        this.clearPageTimer();
    }

    clearPageTimer() {
        if (this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
    }
}
