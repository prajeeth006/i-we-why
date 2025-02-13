import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, EMPTY, interval, map, Subscription, tap } from 'rxjs';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { PageSizes, PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { ErrorService } from 'src/app/common/services/error.service';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { NonRunnersList, NonRunnersResult } from '../../models/data-feed/non-runners.model';
import { HorseRacingContent } from '../../models/horseracing-content.model';
import { NonRunnersPageResult } from '../../models/non-runners-page.model';
import { NonRunnersService } from '../../services/data-feed/non-runners.service';
import { HorseRacingContentService } from '../../services/horseracing-content.service';

@Component({
  selector: 'gn-non-runners',
  templateUrl: './non-runners.component.html',
  styleUrls: ['./non-runners.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class NonRunnersComponent implements OnDestroy {
  errorMessage$ = this.errorService.errorMessage$;
  pageRefreshTime = 20000;
  pageDetails: PaginationContent = new PaginationContent();
  isPageIntialised = false;
  pageTimerSubscription: Subscription;
  paginatedResult: NonRunnersPageResult;
  isUkTemplate: boolean = true;

  nonRunnersPageResult$ = this.nonRunnersService.data$
    .pipe(
      map((result: NonRunnersResult) => {
        return this.prepareNonRunnersPageResult(result);
      }),
      tap((result: NonRunnersPageResult) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  horseRacingContent$ = this.horseRacingContent.data$
    .pipe(
      tap((horseRacingContent: HorseRacingContent) => { }),
      catchError(err => {
        return EMPTY;
      })
    );

  vm$ = combineLatest(
    [
      this.nonRunnersPageResult$,
      this.horseRacingContent$
    ]
  ).pipe(
    map(([nonRunnersPageResult, horseRacingContent]) => {
      nonRunnersPageResult.horseRacingContent = horseRacingContent;
      this.prepareResult(nonRunnersPageResult);

      // Pagination logic
      this.paginatedResult = nonRunnersPageResult;
      if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
        this.isPageIntialised = true;
        this.paginationSetup(this.paginatedResult, false); //show first page immediately as we get data
        this.clearPageTimer();
        this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe((x => {
          this.paginationSetup(this.paginatedResult);
        }));
      }
      this.paginationService.calculateTotalPages(this.pageDetails, nonRunnersPageResult.nonRunnersEvents.length);

      return nonRunnersPageResult;
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  prepareNonRunnersPageResult(result: NonRunnersResult) {
    let nonRunnersPageResult = new NonRunnersPageResult();
    nonRunnersPageResult.nonRunnersEvents = []
    result?.todaysNonRunners?.forEach(nonRunners => {
      nonRunners?.nonRunners?.forEach(nonRunner => {
        nonRunnersPageResult?.nonRunnersEvents?.push({
          category: nonRunners.category,
          eventId: nonRunners.eventId,
          meetingName: nonRunners.meetingName,
          flags: nonRunners.flags,
          typeFlagCode: nonRunners.typeFlagCode,
          nonRunnerName: StringHelper.removeFirstAndLastLetterAndUpperCase(nonRunner.name),
          nonRunnerNumber: nonRunner.number,
          eventDateTime: nonRunners.eventDateTime
        });
      })
    })

    return nonRunnersPageResult;
  }

  private prepareResult(nonRunnersPageResult: NonRunnersPageResult) {
    var nonRunners = nonRunnersPageResult.nonRunnersEvents;
    for (let i = nonRunners?.length - 1; i >= 0; i -= 1) {

      if (nonRunners[i]) {
        if (this.isUkTemplate) {
          if (!(nonRunners[i]?.typeFlagCode?.includes("UK") || nonRunners[i]?.typeFlagCode?.includes("IE"))) {
            nonRunners?.splice(i, 1);
          } else {
            nonRunners[i].sortFlag = nonRunners[i]?.typeFlagCode?.includes("IE") ? 2 : 1;
          }
        } else {
          if (nonRunners[i]?.typeFlagCode?.includes("UK") || nonRunners[i]?.typeFlagCode?.includes("IE")) {
            nonRunners?.splice(i, 1);
          } else {
            nonRunners[i].sortFlag = nonRunners[i]?.typeFlagCode?.includes("IE") ? 2 : 1;
          }
        }
      }

    }

    nonRunnersPageResult.nonRunnersEvents = this.sortArray(nonRunners, [{ key: 'sortFlag' }, { key: 'meetingName' }, { key: 'eventDateTime' }, { key: 'nonRunnerNumber' }])
    return nonRunnersPageResult;
  }

  paginationSetup(nonRunnersPageResult: NonRunnersPageResult, haveToMoveNextPage: boolean = true) {
    this.paginationService.paginationSetup(this.pageDetails, nonRunnersPageResult.nonRunnersEvents.length, haveToMoveNextPage);
  }

  constructor(
    private nonRunnersService: NonRunnersService,
    private horseRacingContent: HorseRacingContentService,
    private route: ActivatedRoute,
    private errorService: ErrorService,
    private paginationService: PaginationService) {
    this.pageDetails.pageSize = PageSizes.eleven;
    this.isUkTemplate = this.route.snapshot.params['isUk'] && this.route.snapshot.params['isUk'].toUpperCase() == "UK";
  }

  ngOnDestroy() {
    this.clearPageTimer();
  }

  clearPageTimer() {
    if (!!this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
  }

  private sortArray(array: NonRunnersList[], options: any) {
    if (!Array.isArray(options)) {
      options = [{ key: options, order: 'asc' }];
    }

    options.forEach((item: any) => {
      item.multiplier = item.order != 'desc' ? -1 : 1;
    });

    return array.sort((firstItem: NonRunnersList, secondItem: NonRunnersList) => {
      for (let item of options) {
        const { key, multiplier } = item;

        const firstValue = firstItem[key];
        const secondValue = secondItem[key];

        if (firstValue != secondValue) {
          return multiplier * (firstValue < secondValue ? 1 : -1);
        }
      }
      return 0;
    });
  }

}
