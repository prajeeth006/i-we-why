import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { catchError, EMPTY, interval, map, Subscription, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { PageSizes, PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { GreyhoundMeetingResults, GreyhoundMeetingResultsTemplate } from '../../models/greyhound-racing-meeting-results.model';
import { GreyhoundMeetingResultsService } from './services/greyhound-meeting-results.service';

@Component({
  selector: 'gn-greyhound-meeting-results',
  templateUrl: './greyhound-meeting-results.component.html',
  styleUrls: ['./greyhound-meeting-results.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class GreyhoundMeetingResultsComponent implements OnDestroy {
  pageRefreshTime = 20000;
  pageDetails: PaginationContent = new PaginationContent();
  isPageIntialised: boolean = false;
  pageTimerSubscription: Subscription;
  paginatedResult: GreyhoundMeetingResultsTemplate;

  fillerPageMessage$ = this.greyhoundMeetingResultsService.fillerPageMessage$;
  errorMessage$ = this.greyhoundMeetingResultsService.errorMessage$;

  vm$ = this.greyhoundMeetingResultsService.data$
    .pipe(
      map((greyhoundMeetingResultsTemplate) => {
        this.paginatedResult = greyhoundMeetingResultsTemplate;
        this.deadHeatPagination(this.paginatedResult);  //Prepare deadhet pagination data
        if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
          this.isPageIntialised = true;
          this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
          this.clearPageTimer();
          this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe((x => {
            this.paginationSetup(this.paginatedResult);
          }));
        }
        this.paginationService.calculateTotalPages(this.pageDetails, this.paginatedResult?.greyhoundMeetingResultsTable?.length);
        return greyhoundMeetingResultsTemplate;
      }),
      tap((greyhoundMeetingResultsTemplate: GreyhoundMeetingResultsTemplate) => {
        JSON.stringify(greyhoundMeetingResultsTemplate, JsonStringifyHelper.replacer)
      }),
      catchError(err => {
        return EMPTY;
      }
      ));

  constructor(
    private greyhoundMeetingResultsService: GreyhoundMeetingResultsService,
    private routeDataService: RouteDataService,
    private paginationService: PaginationService
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    let typeId = queryParams['typeid'];
    this.greyhoundMeetingResultsService.setTypeId(typeId);
    this.pageDetails.pageSize = PageSizes.Ten;
  }

  paginationSetup(resultContent: GreyhoundMeetingResultsTemplate) {

    this.paginationService.paginationSetup(this.pageDetails, resultContent?.greyhoundMeetingResultsTable?.length);
  }

  deadHeatPagination(resultContent: GreyhoundMeetingResultsTemplate) {
    for (let i = 1; i < resultContent?.greyhoundMeetingResultsTable?.length; i++) {
      let index = this.pageDetails.pageSize * i; //creating index for each page
      if (resultContent.greyhoundMeetingResultsTable.length - 1 >= index) { // checking for the last element(row) in the page
        let deadHeat = resultContent?.greyhoundMeetingResultsTable[index]?.isDeadHeat;
        let runnerDeadHeat = resultContent?.greyhoundMeetingResultsTable[index]?.runnerList?.find(x => x.isDeadHeat);
        if (deadHeat && runnerDeadHeat) {
          let greyhoundMeetingResults: GreyhoundMeetingResults = new GreyhoundMeetingResults();
          resultContent?.greyhoundMeetingResultsTable.splice(index - 1, 0, greyhoundMeetingResults) // creating empty row when deadHeat is found at the last element
        }
      }
      else {
        break;
      }
    }

  }

  ngOnDestroy() {
    this.clearPageTimer();
  }

  clearPageTimer() {
    if (!!this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
  }
}
