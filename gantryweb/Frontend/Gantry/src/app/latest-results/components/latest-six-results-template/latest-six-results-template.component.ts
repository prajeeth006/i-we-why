import { ChangeDetectorRef, Component, ViewEncapsulation, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { catchError, EMPTY, map, timer } from 'rxjs';
import { LatestResultsTemplate } from '../../models/latest-results.model';
import { LatestResultsService } from '../../services/latest-results.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { ScreenWidth } from "src/app/common/models/screen-size.model";
import { PaginationContent } from "src/app/common/models/pagination/pagination.models";
import { ToteDividend } from "src/app/common/models/general-codes-model";
import { PaginationService } from "src/app/common/services/pagination.service";
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { ResultCount } from '.././../models/common.model'


@Component({
  selector: 'gn-latest-six-results-template',
  templateUrl: './latest-six-results-template.component.html',
  styleUrls: ['./latest-six-results-template.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class LatestSixResultsTemplateComponent implements OnDestroy {
  pageRefreshTime = 20000;
  timer$ = timer(0, this.pageRefreshTime);
  isTimerFirstTime: boolean = true;
  pageDetails: PaginationContent = new PaginationContent();
  DividendValue = ToteDividend.DividendValue;
  flipper: boolean = false;
  isIntervalSet: boolean = false;
  interval: NodeJS.Timer;
  isLatestSixResultTemplate: boolean;
  latestSixResultCount: number;
  latestThreeResultCount: number;
  latestTableResult = new LatestResultsTemplate();
  @ViewChild('latestResultBlock') latestResultBlock: ElementRef;

  errorMessage$ = this.errorService.errorMessage$;
  fillerPageMessage$ = this.latestResultsService.fillerPageMessage$;

  resultContentHeight = 0;
  eventMargin = 2;
  eventHeaderHeigth = 52 + 20
  runnerHeight = 60

  vm$ = this.latestResultsService.data$.pipe(
    map((latestResultsTemplate: LatestResultsTemplate) => {
      this.latestTableResult = latestResultsTemplate;
      this.calculateHeights();
      this.updateEachWayText(latestResultsTemplate)
      return latestResultsTemplate;
    }),
    catchError((err) => {
      return EMPTY;
    }));

  constructor(
    private routeDataService: RouteDataService,
    private latestResultsService: LatestResultsService,
    private errorService: ErrorService,
    private paginationService: PaginationService,
    private _cdr: ChangeDetectorRef,
  ) {
    this.pageDetails.currentPageNumber = 1;
    this.latestSixResultCount = ResultCount.latestSix;
    this.latestThreeResultCount = ResultCount.latestThree;
    this.isLatestSixResultTemplate = this.routeDataService.isLatestSixResultUrl();
  }

  updateEachWayText(latestResultsTemplate: LatestResultsTemplate) {
    latestResultsTemplate?.latestResultsTable?.forEach(result => {
      if (result.flipHeader && !this.isIntervalSet) {
        this.isIntervalSet = true;
        this.interval = setInterval(() => {
        this.flipper = !this.flipper;
        }, 5000);
      }
    });
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  ngAfterViewInit() {
    this.timer$.subscribe(() => {
      if (this.latestTableResult && this.pageDetails.totalPages != 0) {
        if(this.pageDetails.currentPageNumber == 1){
          this.isTimerFirstTime = false;
        }
        if (this.pageDetails.currentPageNumber >= this.pageDetails.totalPages || this.isTimerFirstTime) {
          this.isTimerFirstTime = false;
          this.pageDetails.currentPageNumber = 1;
        } else {
          this.pageDetails.currentPageNumber++;
        }
        this.pageDetails.pageNumber = this.pageDetails.currentPageNumber;
        this.pageDetails.paginationText = this.paginationService.getFooterText(this.pageDetails.pageNumber, this.pageDetails.totalPages);
        this._cdr.detectChanges();
      }
    });
  }

  private calculateHeights() {
    try {
      let isMultiDesktop = window.innerWidth <= ScreenWidth.multidesktop;
      if (this.resultContentHeight == 0) {
        let parentHeight = this.latestResultBlock.nativeElement.parentNode.clientHeight;
        if (parentHeight)
          this.resultContentHeight = parentHeight
      }

      if (this.resultContentHeight != 0) {
        this.pageDetails.totalPages = 1; // Will increment on max height fills
        let heightConsumed = 0;
        let cnt = 0;
        this.latestTableResult.latestResultsTable.forEach(event => {
          if (this.isLatestSixResultTemplate == true && cnt < 6 || (this.isLatestSixResultTemplate == false && cnt < 3)) {
            cnt++
            let heightOfAllRunners = 0;

            heightOfAllRunners = event.runnerList.length * this.runnerHeight;

            let maxEventHeight = heightOfAllRunners;
            let eventHeight = this.eventHeaderHeigth + maxEventHeight;
            eventHeight = isMultiDesktop ? eventHeight / 2 : eventHeight;
            eventHeight += this.eventMargin;

            if (heightConsumed + eventHeight > this.resultContentHeight) {
              heightConsumed = eventHeight;
              this.pageDetails.totalPages++;
            } else {
              heightConsumed += eventHeight;
            }
            event.page = this.pageDetails.totalPages;
          }
        });
      }

      this.pageDetails.pageNumber = this.pageDetails.currentPageNumber;
      this.pageDetails.paginationText = this.paginationService.getFooterText(this.pageDetails.pageNumber, this.pageDetails.totalPages);
      this._cdr.detectChanges();
    }
    catch (e) {
      console.warn('Waiting for render first element.');
      let _this = this;
      setTimeout(() => {
        _this.calculateHeights();
      }, 1000);
    }
  }
}


