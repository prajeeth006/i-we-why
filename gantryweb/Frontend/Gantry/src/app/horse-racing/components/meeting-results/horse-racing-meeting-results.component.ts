import { ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { catchError, EMPTY, map, tap, timer } from "rxjs";
import { JsonStringifyHelper } from "../../../common/helpers/json-stringify.helper";
import { HorseRacingMeetingResultsTemplate } from "../../models/horse-racing-meeting-results.model";
import { HorseRacingMeetingResultsService } from "./services/horse-racing-meeting-results.service";
import { RouteDataService } from "src/app/common/services/route-data.service";
import {
  PaginationContent,
} from "src/app/common/models/pagination/pagination.models";
import { RaceStage } from "../../models/horse-racing-meeting-results.model";
import { ToteDividend } from "src/app/common/models/general-codes-model";
import { PaginationService } from "src/app/common/services/pagination.service";
import { ScreenWidth } from "src/app/common/models/screen-size.model";

@Component({
  selector: "gn-horse-racing-meeting-results",
  templateUrl: "./horse-racing-meeting-results.component.html",
  styleUrls: ["./horse-racing-meeting-results.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class HorseRacingMeetingResultsComponent  {
  pageRefreshTime = 20000;
  timer$ = timer(0, this.pageRefreshTime);
  isTimerFirstTime: boolean = true;
  pageDetails: PaginationContent = new PaginationContent();
  RaceStage = RaceStage;
  DividendValue = ToteDividend.DividendValue;


  meetingTableResult = new HorseRacingMeetingResultsTemplate();
  @ViewChild('meetingResultBlock') meetingResultBlock: ElementRef;

  errorMessage$ = this.horseRacingMeetingResultsService.errorMessage$;
  fillerPageMessage$ = this.horseRacingMeetingResultsService.fillerPageMessage$;

  resultContentHeight = 0;
  eventMargin = 2;
  eventHeaderHeigth = 52 + 20
  runnerHeight = 37
  tricastHeight = 72 + 10

  vm$ = this.horseRacingMeetingResultsService.data$.pipe(
    map((horseRacingMeetingResultsTemplate) => {
      this.meetingTableResult = horseRacingMeetingResultsTemplate;
      this.calculateHeights();
      return horseRacingMeetingResultsTemplate;
    }),
    tap(
      (
        horseRacingMeetingResultsTemplate: HorseRacingMeetingResultsTemplate
      ) => {
        JSON.stringify(
          horseRacingMeetingResultsTemplate,
          JsonStringifyHelper.replacer
        );
      }
    ),
    catchError((err) => {
      return EMPTY;
    })
  );

  constructor(
    private horseRacingMeetingResultsService: HorseRacingMeetingResultsService,
    private routeDataService: RouteDataService,
    private _cdr: ChangeDetectorRef,
    private paginationService: PaginationService,
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    let typeId = queryParams["typeid"];
    this.horseRacingMeetingResultsService.setTypeId(typeId);
    this.pageDetails.currentPageNumber = 1;
  }

  ngAfterViewInit() {
    this.timer$.subscribe(() => {
      if (this.meetingTableResult && this.pageDetails.totalPages != 0) {
        if(this.pageDetails.currentPageNumber == 1){
          this.isTimerFirstTime = false;
        }
        if (this.pageDetails.currentPageNumber == this.pageDetails.totalPages || this.isTimerFirstTime) {
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
        let parentHeight = this.meetingResultBlock.nativeElement.parentNode.clientHeight;
        if (parentHeight)
          this.resultContentHeight = parentHeight
      }

      if (this.resultContentHeight != 0) {

        this.pageDetails.totalPages = 1; // Will increment on max height fills
        let heightConsumed = 0;
        this.meetingTableResult.horseRacingMeetingResultsTable.forEach(event => {

          let heightOfAllRunners = 0;
          let heightOfForecastTricast =  0;
          let heightOfExactaTrifecta = 0;

          heightOfAllRunners = event.runnerList.length * this.runnerHeight;

          if(event.triCast)
            heightOfForecastTricast += this.tricastHeight + (isMultiDesktop ? 2 : 0);
          if(event.foreCast)
            heightOfForecastTricast += this.tricastHeight + (isMultiDesktop ? 2 : 0);

          if(event.totes.exacta)
            heightOfExactaTrifecta += this.tricastHeight + (isMultiDesktop ? 2 : 0);
          if(event.totes.trifecta)
            heightOfExactaTrifecta += this.tricastHeight + (isMultiDesktop ? 2 : 0);


          let maxEventHeight = Math.max.apply(Math, [heightOfForecastTricast, heightOfExactaTrifecta, heightOfAllRunners]);
          let eventHeight = this.eventHeaderHeigth + maxEventHeight ;
          eventHeight = isMultiDesktop ? eventHeight/2 : eventHeight;
          eventHeight += this.eventMargin;

          if(heightConsumed + eventHeight > this.resultContentHeight ){
            heightConsumed = eventHeight;
            this.pageDetails.totalPages++;
          } else {
            heightConsumed += eventHeight;
          }
          event.page = this.pageDetails.totalPages;
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
