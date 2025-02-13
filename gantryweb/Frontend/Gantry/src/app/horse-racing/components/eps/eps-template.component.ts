import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, debounceTime, EMPTY, map, tap, timer } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { EpsResultsContent } from './models/epsContent.model';
import { EpsTemplateService } from './services/eps-template.service';
import { Log, LogType, LoggerService } from 'src/app/common/services/logger.service';

@Component({
  selector: 'gn-eps-template',
  templateUrl: './eps-template.component.html',
  styleUrls: ['./eps-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class EpsTemplateComponent {
  pageDetails: PaginationContent = new PaginationContent();
  pageRefreshTime = 30000;
  timer$ = timer(0, this.pageRefreshTime);
  isTimerFirstTime: boolean = true;
  errorMessage$ = this.epsTemplateService.errorMessage$;
  result = new EpsResultsContent();

  epsContentHeight = 0;
  groupHeaderHeigth = 38 + 20 + 2 + 2;
  eventHeaderHeigth = 20 + 10 + 2;
  eventHeigth = 19;
  resultHeigth = 19;
  noOfColumns = 6;
  columnWidth = 16.4;

  @ViewChild('epsBlock') epsBlock: ElementRef;

  vm$ = combineLatest([this.epsTemplateService.data$]).pipe(
    debounceTime(500),
    map(([epsContent]) => {
      return epsContent;
    }),
    tap((epsContent: EpsResultsContent) => {
      JSON.stringify(epsContent, JsonStringifyHelper.replacer);
    }),
    catchError((err) => {
      this.loggerService.logError(err);
      return EMPTY;
    })
  );

  constructor(
    private epsTemplateService: EpsTemplateService,
    private _cdr: ChangeDetectorRef,
    private loggerService: LoggerService,
    private paginationService: PaginationService
  ) {
    this.pageDetails.currentPageNumber = 1;

    this.vm$.subscribe((epsContent: EpsResultsContent) => {
      if(!!epsContent && Object.keys(epsContent).length > 0){
        this.result = epsContent
      }
      this.calculateHeights();
    });
  }

  ngAfterViewInit() {
    this.timer$.subscribe(() => {
      if (this.result && this.pageDetails.totalPages != 0) {
        if (this.pageDetails.currentPageNumber >= this.pageDetails.totalPages || this.isTimerFirstTime) {
          this.isTimerFirstTime = false;
          this.pageDetails.currentPageNumber = 1;
        } else {
          this.pageDetails.currentPageNumber++;
        }
        this.pageDetails.pageNumber = this.pageDetails.currentPageNumber;
        this.pageDetails.paginationText = this.paginationService.getFooterText(
          this.pageDetails.pageNumber,
          this.pageDetails.totalPages
        );

        //Added logs for tracing Pagenation.
        let log: Log = {level: LogType.Information, message: `PageDetails${JSON.stringify(this.pageDetails)}`, status: "", fatal: false };
        this.loggerService.log(log);

        this._cdr.detectChanges();
      }
    });
  }

  calculateHeights() {
    try {
      if (this.epsContentHeight == 0) {
        let parentHeight = this.epsBlock.nativeElement.parentNode.clientHeight;
        if (parentHeight) this.epsContentHeight = parentHeight - this.groupHeaderHeigth;
      }

      try{
        if (this.epsContentHeight != 0) {
          let pageColumns = 0; // Will increment on each column fill
          this.pageDetails.totalPages = 1; // Will increment on max columns fill

          this.result.epsResultGroupedSorted.forEach((group) => {
            let heightConsumed = 0;
            let noOfPageGroupColumns = 1; // Will increase on every group fill and resets to 1 if page change
            if (pageColumns == this.noOfColumns) {
              pageColumns = 1;
              this.pageDetails.totalPages++;
            } else {
              pageColumns++;
            }

            group.events.forEach((event) => {
              heightConsumed += this.eventHeaderHeigth;
              let eventHeigth = 0;
              if (event.isEventResulted) {
                eventHeigth += event?.runnerList?.length * this.eventHeigth;
                eventHeigth += event?.nonRunnerList?.length * this.eventHeigth;
                eventHeigth += this.resultHeigth;
              } else if (event.isEarlyPrice) {
                eventHeigth += event?.allRunnerSelections?.length * this.eventHeigth;
                eventHeigth += event?.nonRunnerList?.length * this.eventHeigth;
              } else if (event.isLiveNowEvent) {
                if (!event.isRaceOff) {
                  eventHeigth += event?.allRunnerSelections?.length * this.eventHeigth;
                  eventHeigth += event?.nonRunnerList?.length * this.eventHeigth;
                  eventHeigth += this.resultHeigth;
                } else {
                  eventHeigth += event?.allRunnerSelections?.length * this.eventHeigth;
                  eventHeigth += event?.nonRunnerList?.length * this.eventHeigth;
                  eventHeigth += this.resultHeigth;
                }
              }

              heightConsumed += eventHeigth;
              if (heightConsumed > this.epsContentHeight) {
                pageColumns++;
                if (pageColumns > this.noOfColumns) {
                  if (noOfPageGroupColumns != 0) {
                    group.pages.push(this.pageDetails.totalPages);
                    group.noOfPageGroupColumns.push(noOfPageGroupColumns);
                  }
                  this.pageDetails.totalPages++;
                  noOfPageGroupColumns = 1;
                  pageColumns = 1;
                } else {
                  noOfPageGroupColumns++;
                }

                heightConsumed = this.eventHeaderHeigth;
                heightConsumed += eventHeigth;
                event.page = this.pageDetails?.totalPages;
              } else {
                event.page = this.pageDetails?.totalPages;
              }
            });

            if (noOfPageGroupColumns > 0 && noOfPageGroupColumns <= this.noOfColumns) {
              group?.pages?.push(this.pageDetails.totalPages);
              group?.noOfPageGroupColumns?.push(noOfPageGroupColumns);
            }
          });
        }
        this.pageDetails.pageNumber = this.pageDetails?.currentPageNumber;
        this.pageDetails.paginationText = this.paginationService?.getFooterText(
          this.pageDetails.pageNumber,
          this.pageDetails.totalPages
        );
        this._cdr.detectChanges();
      } catch (e) {
        this.loggerService.logError(e);
      }

    } catch (e) {
      console.warn('Waiting for render first element.');
      let _this = this;
      setTimeout(() => {
        _this.calculateHeights();
      }, 1000);
    }
  }
}
