import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EMPTY, Subscription, catchError, combineLatest, interval, map, startWith, tap } from 'rxjs';

import { StringHelper } from '../../../../common/helpers/string.helper';
import { SelectionNameLength } from '../../../../common/models/general-codes-model';
import { PageSizes, PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { ErrorService } from '../../../../common/services/error.service';
import { PaginationService } from '../../../../common/services/pagination.service';
import { NonRunnersList, NonRunnersResult } from '../../../models/data-feed/non-runners.model';
import { HorseRacingContent } from '../../../models/horseracing-content.model';
import { NonRunnersPageResult } from '../../../models/non-runners-page.model';
import { NonRunnersService } from '../../../services/data-feed/non-runners.service';
import { HorseRacingContentService } from '../../../services/horseracing-content.service';

@Component({
    selector: 'gn-dark-theme-non-runners',
    templateUrl: './dark-theme-non-runners.component.html',
    styleUrls: ['./dark-theme-non-runners.component.scss'],
})
export class DarkThemeNonRunnersComponent implements OnDestroy {
    errorMessage$ = this.errorService.errorMessage$;
    pageRefreshTime = 20000;
    pageDetails: PaginationContent = new PaginationContent();
    isPageIntialised = false;
    pageTimerSubscription: Subscription;
    paginatedResult: NonRunnersPageResult;
    isUkTemplate: boolean = true;

    nonRunnersPageResult$ = this.nonRunnersService.data$.pipe(
        map((result: NonRunnersResult) => {
            return this.prepareNonRunnersPageResult(result);
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

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        startWith({} as HorseRacingContent), // Initial value
    );

    vm$ = combineLatest([this.nonRunnersPageResult$, this.horseRacingContent$]).pipe(
        map(([nonRunnersPageResult, horseRacingContent]) => {
            nonRunnersPageResult.horseRacingContent = horseRacingContent;
            this.prepareResult(nonRunnersPageResult);

            // Pagination logic
            this.paginatedResult = nonRunnersPageResult;
            if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
                this.isPageIntialised = true;
                this.paginationSetup(this.paginatedResult, false); //show first page immediately as we get data
                this.clearPageTimer();
                this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                    this.paginationSetup(this.paginatedResult);
                });
            }
            this.paginationService.darkThemeCalculateTotalPages(this.pageDetails, nonRunnersPageResult.nonRunnersEvents.length);

            return nonRunnersPageResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    prepareNonRunnersPageResult(result: NonRunnersResult) {
        const nonRunnersPageResult = new NonRunnersPageResult();
        nonRunnersPageResult.nonRunnersEvents = [];
        result?.todaysNonRunners?.forEach((nonRunners) => {
            nonRunners?.nonRunners?.forEach((nonRunner) => {
                nonRunnersPageResult?.nonRunnersEvents?.push({
                    category: nonRunners.category,
                    eventId: nonRunners.eventId,
                    meetingName: StringHelper.selectionNameLengthAndTrimEnd(nonRunners.meetingName, SelectionNameLength.Sixteen),
                    flags: nonRunners.flags,
                    typeFlagCode: nonRunners.typeFlagCode,
                    nonRunnerName: StringHelper.selectionNameLengthAndTrimEnd(
                        StringHelper.removeFirstAndLastLetterAndUpperCase(nonRunner.name),
                        SelectionNameLength.Eighteen,
                    ),
                    nonRunnerNumber: nonRunner.number,
                    eventDateTime: nonRunners.eventDateTime,
                });
            });
        });

        return nonRunnersPageResult;
    }

    private prepareResult(nonRunnersPageResult: NonRunnersPageResult) {
        const nonRunners = nonRunnersPageResult.nonRunnersEvents;
        for (let i = nonRunners?.length - 1; i >= 0; i -= 1) {
            if (nonRunners[i]) {
                if (this.isUkTemplate) {
                    if (!(nonRunners[i]?.typeFlagCode?.includes('UK') || nonRunners[i]?.typeFlagCode?.includes('IE'))) {
                        nonRunners?.splice(i, 1);
                    } else {
                        nonRunners[i].sortFlag = nonRunners[i]?.typeFlagCode?.includes('IE') ? 2 : 1;
                    }
                } else {
                    if (nonRunners[i]?.typeFlagCode?.includes('UK') || nonRunners[i]?.typeFlagCode?.includes('IE')) {
                        nonRunners?.splice(i, 1);
                    } else {
                        nonRunners[i].sortFlag = nonRunners[i]?.typeFlagCode?.includes('IE') ? 2 : 1;
                    }
                }
            }
        }
        nonRunnersPageResult.nonRunnersEvents = this.sortArray(nonRunners, [
            { key: 'sortFlag' },
            { key: 'meetingName' },
            { key: 'eventDateTime' },
            { key: 'nonRunnerNumber' },
        ]);
        nonRunnersPageResult.nonRunnersEvents?.sort(); // Sort alphabetically case-sensitive
        nonRunnersPageResult.nonRunnersEvents?.sort((a, b) => a.meetingName?.toLowerCase()?.localeCompare(b.meetingName?.toLowerCase()));
        return nonRunnersPageResult;
    }

    paginationSetup(nonRunnersPageResult: NonRunnersPageResult, haveToMoveNextPage: boolean = true) {
        this.paginationService.darkThemePaginationSetup(this.pageDetails, nonRunnersPageResult.nonRunnersEvents.length, haveToMoveNextPage);
    }

    constructor(
        private nonRunnersService: NonRunnersService,
        private horseRacingContent: HorseRacingContentService,
        private route: ActivatedRoute,
        private errorService: ErrorService,
        private paginationService: PaginationService,
    ) {
        this.pageDetails.pageSize = PageSizes.Nine;
        this.isUkTemplate = this.route.snapshot.params['isUk'] && this.route.snapshot.params['isUk'].toUpperCase() == 'UK';
    }

    ngOnDestroy() {
        this.clearPageTimer();
    }

    clearPageTimer() {
        if (this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
    }

    private sortArray(array: NonRunnersList[], options: any) {
        if (!Array.isArray(options)) {
            options = [{ key: options, order: 'asc' }];
        }

        options.forEach((item: any) => {
            item.multiplier = item.order != 'desc' ? -1 : 1;
        });

        return array.sort((firstItem: NonRunnersList, secondItem: NonRunnersList) => {
            for (const item of options) {
                const { key, multiplier } = item;

                const firstValue = firstItem[key as keyof NonRunnersList]!;
                const secondValue = secondItem[key as keyof NonRunnersList]!;

                if (firstValue != secondValue) {
                    return multiplier * (firstValue < secondValue ? 1 : -1);
                }
            }
            return 0;
        });
    }
}
