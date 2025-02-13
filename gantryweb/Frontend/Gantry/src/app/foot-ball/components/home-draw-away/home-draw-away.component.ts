import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, interval, map, Subscription, tap } from 'rxjs';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { PageSizes, PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { OutCome } from '../../models/football.enum';

import { HomeDrawAway, HomeDrawAwayResult, HomeDrawAwaySelection } from './models/home-draw-away.model';
import { HomeDrawAwayService } from './services/home-draw-away/home-draw-away.service';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Component({
  selector: 'gn-home-draw-away',
  templateUrl: './home-draw-away.component.html',
  styleUrls: ['./home-draw-away.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class HomeDrawAwayComponent implements OnDestroy {
  private eventMarketPairs: string;
  pageRefreshTime = 20000;
  pageDetails: PaginationContent = new PaginationContent();
  errorMessage$ = this.errorService.errorMessage$;
  isEventDateRange: boolean;
  eventDateTimeInputValue: string;
  isPageIntialised = false;
  pageTimerSubscription: Subscription;
  paginatedResult: HomeDrawAwayResult;
  nameLength = SelectionNameLength.Seventeen;

  constructor(
    private routeDataService: RouteDataService,
    private sportBookService: SportBookService,
    private errorService: ErrorService,
    private paginationService: PaginationService,
    private homedrawawayService: HomeDrawAwayService,
    private sportContentService: SportContentService
  ) {

    let queryParams = this.routeDataService.getQueryParams();

    this.eventMarketPairs = queryParams['eventMarketPairs'];
    sportBookService.setEventMarketPairs(this.eventMarketPairs);
    sportBookService.setRemoveSuspendedSelections(false);
    this.pageDetails.pageSize = PageSizes.Nine;
  }

  nflContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.footballMultiMarket);


  vm$ = combineLatest([
    this.sportBookService.data$,
    this.nflContentFromSitecore$
  ])
    .pipe(
      map(([sportBookResult, gantryCommonContent]) => {
        let sportBookEvents = [...sportBookResult.events.values()];
        sportBookEvents.forEach(sportBookEvent => SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent));
        let result = new HomeDrawAwayResult();
        result.gantryCommonContent = gantryCommonContent;

        let [firstEvent] = sportBookResult.events.values();
        const [firstMarket] = firstEvent.markets?.values();

        result.categoryName = firstEvent?.categoryName;
        result.marketName = firstMarket?.marketName;
        result.homeDrawAwayEvent = [...sportBookResult.events.values()].map(sportBookEvent => {
          let homeEvents = new HomeDrawAway();
          homeEvents.eventName = sportBookEvent?.eventName.toUpperCase();
          homeEvents.eventDateTime = sportBookEvent?.eventDateTime;
          let [eventFirstMarket] = [...sportBookEvent.markets.values()];
          [...eventFirstMarket?.selections?.values() ?? []].map(selection => {
              let prices = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
              if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Home) {
                homeEvents.homeSelection = new HomeDrawAwaySelection();
                homeEvents.homeSelection.selectionName = selection.selectionName;
                homeEvents.homeSelection.price = prices;
                homeEvents.homeSelection.hidePrice = selection.hidePrice;
                homeEvents.homeSelection.hideEntry = selection.hideEntry;
              }
              else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Away) {
                homeEvents.awaySelection = new HomeDrawAwaySelection();
                homeEvents.awaySelection.selectionName = selection.selectionName;
                homeEvents.awaySelection.price = prices;
                homeEvents.awaySelection.hidePrice = selection.hidePrice;
                homeEvents.awaySelection.hideEntry = selection.hideEntry;
              }
              else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Draw) {
                homeEvents.drawSelection = new HomeDrawAwaySelection();
                homeEvents.drawSelection.price = prices;
                homeEvents.drawSelection.hidePrice = selection.hidePrice;
                homeEvents.drawSelection.hideEntry = selection.hideEntry;
              }
            return homeEvents;
          });
          return homeEvents;
        });

        result.homeDrawAwayEvent = StringHelper.getActiveSelections(result?.homeDrawAwayEvent);
        StringHelper.sortHomeDrawAwayEvent(result?.homeDrawAwayEvent);

        // get EventDateTime for the given selections
        if(result.homeDrawAwayEvent.length) {
          this.eventDateTimeInputValue = this.homedrawawayService.getEventTimeDateFromPipe(
            result?.homeDrawAwayEvent, result?.gantryCommonContent?.contentParameters?.EventTimeInfo, result?.gantryCommonContent);
          this.paginatedResult = result;
          // Pagination logic
          if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
            this.isPageIntialised = true;
            this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
            this.clearPageTimer();
            this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe((x => {
              this.paginationSetup(this.paginatedResult);
            }));
          }
          this.paginationService.calculateTotalPages(this.pageDetails, this.paginatedResult?.homeDrawAwayEvent?.length);
          return result;
        }
      }),
      tap((result: HomeDrawAwayResult) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      }
      ));

      paginationSetup(resultContent: HomeDrawAwayResult) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent.homeDrawAwayEvent.length);
      }

      ngOnDestroy(): void {
        this.clearPageTimer();
      }

      clearPageTimer() {
        if (!!this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
      }

}
