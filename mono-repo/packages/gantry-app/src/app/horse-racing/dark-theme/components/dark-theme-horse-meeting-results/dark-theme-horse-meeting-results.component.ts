import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

import { EMPTY, catchError, map, tap, timer } from 'rxjs';

import { JsonStringifyHelper } from '../../../../common/helpers/json-stringify.helper';
import { ToteDividend } from '../../../../common/models/general-codes-model';
import { PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { FavouriteTags, ToteTags } from '../../../../common/models/racing-tags.model';
import { ScreenWidth } from '../../../../common/models/screen-size.model';
import { PaginationService } from '../../../../common/services/pagination.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { CommonTimers } from '../../../models/common.model';
import { HorseRacingMeetingResultsTemplate, RaceStage } from '../../../models/horse-racing-meeting-results.model';
import { DarkThemeHorseMeetingResultsService } from './services/dark-theme-horse-meeting-results.service';

@Component({
    selector: 'gn-dark-theme-horse-meeting-results',
    templateUrl: './dark-theme-horse-meeting-results.component.html',
    styleUrls: ['./dark-theme-horse-meeting-results.component.scss'],
})
export class DarkThemeHorseMeetingResultsComponent implements AfterViewInit {
    pageRefreshTime = CommonTimers.PageRefreshTime;
    timer$ = timer(0, this.pageRefreshTime);
    isTimerFirstTime: boolean = true;
    pageDetails: PaginationContent = new PaginationContent();
    RaceStage = RaceStage;
    DividendValue = ToteDividend.DividendValue;
    favouriteReplaceChar = FavouriteTags.favourite;
    forecastTags = ToteTags;

    meetingTableResult = new HorseRacingMeetingResultsTemplate();
    @ViewChild('meetingResultBlock') meetingResultBlock: ElementRef;

    errorMessage$ = this.darkThemeHorseMeetingResultsService.errorMessage$;
    fillerPageMessage$ = this.darkThemeHorseMeetingResultsService.fillerPageMessage$;

    resultContentHeight = 0;
    eventMargin = 4;
    eventHeaderHeigth = 114 + 20;
    runnerHeight = 60;
    tricastHeight = 94 + 26 + 40;
    minBlockHeight = 366;
    headerBottomheight: number;

    vm$ = this.darkThemeHorseMeetingResultsService.data$.pipe(
        map((horseRacingMeetingResultsTemplate) => {
            this.meetingTableResult = horseRacingMeetingResultsTemplate;
            this.calculateHeights();
            return horseRacingMeetingResultsTemplate;
        }),
        tap((horseRacingMeetingResultsTemplate: HorseRacingMeetingResultsTemplate) => {
            JSON.stringify(horseRacingMeetingResultsTemplate, JsonStringifyHelper.replacer);
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    constructor(
        private darkThemeHorseMeetingResultsService: DarkThemeHorseMeetingResultsService,
        private routeDataService: RouteDataService,
        private _cdr: ChangeDetectorRef,
        private paginationService: PaginationService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const typeId = queryParams['typeid'];
        this.darkThemeHorseMeetingResultsService.setTypeId(typeId);
        this.pageDetails.currentPageNumber = 1;
    }

    ngAfterViewInit() {
        this.timer$.subscribe(() => {
            if (this.meetingTableResult && this.pageDetails.totalPages != 0) {
                if (this.pageDetails.currentPageNumber == 1) {
                    this.isTimerFirstTime = false;
                }
                if (this.pageDetails.currentPageNumber == this.pageDetails.totalPages || this.isTimerFirstTime) {
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

    private calculateHeights() {
        try {
            const isMultiDesktop = window.innerWidth <= ScreenWidth.multidesktop;
            if (this.resultContentHeight == 0) {
                this.headerBottomheight = isMultiDesktop ? 10 : 20;
                const parentHeight = this.meetingResultBlock.nativeElement.parentNode.clientHeight;
                if (parentHeight) this.resultContentHeight = parentHeight - this.headerBottomheight;
            }

            if (this.resultContentHeight != 0) {
                this.pageDetails.totalPages = 1; // Will increment on max height fills
                let heightConsumed = 0;
                this.meetingTableResult.horseRacingMeetingResultsTable.forEach((event) => {
                    let heightOfAllRunners = 0;
                    let heightOfForecastTricast = 0;
                    let heightOfExactaTrifecta = 0;

                    heightOfAllRunners = event.runnerList.length * this.runnerHeight + this.eventHeaderHeigth;

                    if (event.triCast) heightOfForecastTricast += this.tricastHeight + (isMultiDesktop ? 2 : 0);
                    if (event.foreCast) heightOfForecastTricast += this.tricastHeight + (isMultiDesktop ? 2 : 0);

                    if (event.totes.exacta) heightOfExactaTrifecta += this.tricastHeight + (isMultiDesktop ? 2 : 0);
                    if (event.totes.trifecta) heightOfExactaTrifecta += this.tricastHeight + (isMultiDesktop ? 2 : 0);

                    let maxEventHeight = Math.max.apply(Math, [
                        heightOfForecastTricast,
                        heightOfExactaTrifecta,
                        heightOfAllRunners,
                        this.minBlockHeight,
                    ]);
                    maxEventHeight = isMultiDesktop ? maxEventHeight / 2 : maxEventHeight;
                    maxEventHeight += this.eventMargin;
                    if (heightConsumed + maxEventHeight > this.resultContentHeight) {
                        heightConsumed = maxEventHeight;
                        this.pageDetails.totalPages++;
                    } else {
                        heightConsumed += maxEventHeight;
                    }
                    event.page = this.pageDetails.totalPages;
                });
            }

            this.pageDetails.pageNumber = this.pageDetails.currentPageNumber;
            this.pageDetails.paginationText = this.paginationService.getNewDesignFooterText(this.pageDetails.pageNumber, this.pageDetails.totalPages);
            this._cdr.detectChanges();
        } catch (e) {
            console.log('Waiting for render first element.');
            setTimeout(() => {
                this.calculateHeights();
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
