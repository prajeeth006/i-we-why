import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { EMPTY, catchError, map, timer } from 'rxjs';

import { ToteDividend } from '../../../../common/models/general-codes-model';
import { PaginationContent } from '../../../../common/models/pagination/pagination.models';
// import { ScreenWidth } from '../../../../common/models/screen-size.model';
import { ErrorService } from '../../../../common/services/error.service';
import { PaginationService } from '../../../../common/services/pagination.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { PageRefreshTime, ResultCount } from '../../../models/common.model';
import { LatestResultsTemplate } from '../../../models/latest-results.model';
import { DarkThemeLatestFourResultsService } from '../../services/dark-theme-latest-four-results.service';

@Component({
    selector: 'gn-dark-theme-latest-four-results-template',
    templateUrl: './dark-theme-latest-four-results-template.component.html',
    styleUrls: ['./dark-theme-latest-four-results-template.component.scss'],
})
export class DarkThemeLatestFourResultsTemplateComponent implements AfterViewInit, OnDestroy {
    pageRefreshTime = PageRefreshTime.pageRefreshTime;
    timer$ = timer(0, this.pageRefreshTime);
    isTimerFirstTime: boolean = true;
    pageDetails: PaginationContent = new PaginationContent();
    DividendValue = ToteDividend.DividendValue;
    interval: NodeJS.Timeout | string | number | undefined;
    isLatestFourResultTemplate: boolean;
    latestFourResultCount: number;
    latestTwoResultCount: number;
    latestTableResult = new LatestResultsTemplate();
    @ViewChild('latestResultBlock') latestResultBlock: ElementRef;

    errorMessage$ = this.errorService.errorMessage$;
    fillerPageMessage$ = this.latestResultsService.fillerPageMessage$;

    maxTableSelections: number = 4;
    maxtablesPerPage: number = 2;

    vm$ = this.latestResultsService.data$.pipe(
        map((latestResultsTemplate: LatestResultsTemplate) => {
            this.latestTableResult = latestResultsTemplate;
            this.pageAdjustment();
            return latestResultsTemplate;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private routeDataService: RouteDataService,
        private latestResultsService: DarkThemeLatestFourResultsService,
        private errorService: ErrorService,
        private paginationService: PaginationService,
        private _cdr: ChangeDetectorRef,
    ) {
        this.pageDetails.currentPageNumber = 1;
        this.latestFourResultCount = ResultCount.latestFour;
        this.latestTwoResultCount = ResultCount.latestTwo;
        this.isLatestFourResultTemplate = this.routeDataService.isLatestSixResultUrl();
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    ngAfterViewInit() {
        this.timer$.subscribe(() => {
            if (this.latestTableResult && this.pageDetails.totalPages != 0) {
                if (this.pageDetails.currentPageNumber == 1) {
                    this.isTimerFirstTime = false;
                }
                if (this.pageDetails.currentPageNumber >= this.pageDetails.totalPages || this.isTimerFirstTime) {
                    this.isTimerFirstTime = false;
                    this.pageDetails.currentPageNumber = 1;
                } else {
                    this.pageDetails.currentPageNumber++;
                }
                this.pageDetails.pageNumber = this.pageDetails.currentPageNumber;

                this.pageDetails.paginationText = this.paginationService.getNewDesignFooterText(
                    this.pageDetails.pageNumber,
                    this.pageDetails.totalPages,
                );
                this._cdr.detectChanges();
            }
        });
    }

    private pageAdjustment() {
        try {
            this.pageDetails.totalPages = 1;
            let cnt = 0;
            let tablesPerPage = 0;
            this.latestTableResult.latestResultsTable.forEach((event, index) => {
                if ((this.isLatestFourResultTemplate == true && cnt < 4) || (this.isLatestFourResultTemplate == false && cnt < 2)) {
                    cnt++;
                    tablesPerPage++;
                    if ((event.runnerList.length > this.maxTableSelections || tablesPerPage > this.maxtablesPerPage) && index > 0) {
                        tablesPerPage = 0;
                        this.pageDetails.totalPages++;
                    }
                    event.page = this.pageDetails.totalPages;
                }
            });
            this.pageDetails.pageNumber = this.pageDetails.currentPageNumber;
            this.pageDetails.paginationText = this.paginationService.getNewDesignFooterText(this.pageDetails.pageNumber, this.pageDetails.totalPages);
            this._cdr.detectChanges();
        } catch (e) {
            setTimeout(() => {
                this.pageAdjustment();
            }, 1000);
        }
    }

    slashSeperator(value: string) {
        let dataArray: string[] = [];
        if (value?.includes('/')) {
            dataArray = value?.split('/');
            return dataArray;
        } else {
            dataArray.push(value);
            return dataArray;
        }
    }
}
