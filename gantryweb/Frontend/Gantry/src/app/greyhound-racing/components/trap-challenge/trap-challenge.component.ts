import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, interval, map, Subscription, tap } from 'rxjs';
import { PageSizes, PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { GreyhoundStaticContent } from '../../models/greyhound-racing-template.model';
import { TrapChallengeResult } from '../../models/trap-challenge.model';
import { GreyhoundRacingContentService } from '../greyhound-racing-template/services/greyhound-racing-content.service';
import { TrapChallengeTemplateService } from './services/trap-challenge-template.service';

@Component({
  selector: 'gn-trap-challenge',
  templateUrl: './trap-challenge.component.html',
  styleUrls: ['./trap-challenge.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class TrapChallengeComponent implements OnDestroy {
  private eventMarketPairs: string;
  pageRefreshTime = 20000;
  errorMessage$ = this.errorService.errorMessage$;
  pageDetails: PaginationContent = new PaginationContent();
  pageTimerSubscription: Subscription;
  isPageIntialised: boolean = false;
  paginatedResult: TrapChallengeResult;

  constructor(
    private greyhoundRacingContentService: GreyhoundRacingContentService,
    private errorService: ErrorService,
    private routeDataService: RouteDataService,
    private sportBookService: SportBookService,
    private paginationService: PaginationService,
    private trapChallengeService: TrapChallengeTemplateService) {

    let queryParams = this.routeDataService.getQueryParams();
    this.eventMarketPairs = queryParams['eventMarketPairs'];
    sportBookService.setEventMarketPairs(this.eventMarketPairs);
    sportBookService.setRemoveSuspendedSelections(false);
    this.greyhoundRacingContentService.setImageType(true);
    this.pageDetails.pageSize = PageSizes.Three;
  }

  greyHoundData$ = this.greyhoundRacingContentService.data$
    .pipe(
      tap((greyHoundData: GreyhoundStaticContent) => {}),
      catchError(err => {
        return EMPTY;
      })
    );

  vm$ = combineLatest([
    this.sportBookService.data$,
    this.greyHoundData$
  ])
    .pipe(
      map(([sportBookResult, greyHoundData]) => {

        let result = this.trapChallengeService.prepareResult(sportBookResult, greyHoundData);

        this.paginatedResult = result;
        if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
          this.isPageIntialised = true;
          this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
          this.clearPageTimer();
          this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe((x => {
            this.paginationSetup(this.paginatedResult);
          }));
        }
        this.paginationService.calculateTotalPages(this.pageDetails, result?.events?.length);

        return result;
      }),
      tap((result: TrapChallengeResult) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      }
      ));


  paginationSetup(resultContent: TrapChallengeResult) {
    this.paginationService.paginationSetup(this.pageDetails, resultContent.events?.length);
  }

  ngOnDestroy() {
    this.clearPageTimer();
  }

  clearPageTimer() {
    if (!!this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
  }

}
