import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, interval, map, Subscription, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { GantryCommonContent } from 'src/app/common/models/gantry-commom-content.model';
import { SelectionSuspended } from 'src/app/common/models/general-codes-model';
import { PageSizes, PaginationContent } from 'src/app/common/models/pagination/pagination.models';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';
import { PaginationService } from 'src/app/common/services/pagination.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { Order, selectionName } from '../../models/common.model';
import { WinningDistanceEvent, WinningDistanceResult, WinningDistanceSelection } from './models/winning-distance.model';
import { SportBookResult } from 'src/app/common/models/data-feed/sport-bet-models';

@Component({
  selector: 'gn-winning-distance',
  templateUrl: './winning-distance.component.html',
  styleUrls: ['./winning-distance.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class WinningDistanceComponent implements OnDestroy {
  private eventMarketPairs: string;
  pageRefreshTime = 20000;
  pageDetails: PaginationContent = new PaginationContent();
  errorMessage$ = this.errorService.errorMessage$;
  isPageIntialised = false;
  pageTimerSubscription: Subscription;
  paginatedResult: WinningDistanceResult;

  constructor(
    private routeDataService: RouteDataService,
    private sportBookService: SportBookService,
    private errorService: ErrorService,
    private gantryCommonContentService: GantryCommonContentService,
    private paginationService: PaginationService) {

    this.pageDetails.pageSize = PageSizes.Three;
    let queryParams = this.routeDataService.getQueryParams();

    this.eventMarketPairs = queryParams['eventMarketPairs'];
    sportBookService.setEventMarketPairs(this.eventMarketPairs);
    sportBookService.setRemoveSuspendedSelections(false);
  }

  gantryCommonContent$ = this.gantryCommonContentService.data$
    .pipe(
      tap((gantryCommonContent: GantryCommonContent) => {
        JSON.stringify(gantryCommonContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  vm$ = combineLatest([
    this.sportBookService.data$,
    this.gantryCommonContent$
  ])
    .pipe(
      map(([sportBookResult, gantryCommonContent]) => {
        return this.prepareResult(sportBookResult, gantryCommonContent);
      }),
      tap((result: WinningDistanceResult) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      }
      ));

  prepareResult(sportBookResult: SportBookResult, gantryCommonContent: GantryCommonContent){
    let result = new WinningDistanceResult();
    if(!sportBookResult || sportBookResult?.events?.size <= 0){
      return result
    }
    let sportBookEvents = [...sportBookResult.events.values()];
    sportBookEvents.forEach(sportBookEvent => SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent));

    let [firstEvent] = sportBookResult.events.values();
    const [firstMarket] = firstEvent.markets?.values();

    result.gantryCommonContent = gantryCommonContent;

    result.categoryName = firstEvent?.categoryName;
    result.marketTitle = firstMarket?.marketName;
    result.winOrEachWayText = gantryCommonContent?.contentParameters?.WinningDistanceMaxDistancePerRace;
    result.date = firstEvent?.eventDateTime;
    result.events = [...sportBookResult.events.values()].map(sportBookEvent => {
      let winningDistanceEvent = new WinningDistanceEvent();
      winningDistanceEvent.name = sportBookEvent?.eventName?.replace("-WINNING DISTANCE", "")?.toUpperCase();
      winningDistanceEvent.eventDateTime = sportBookEvent.eventDateTime;
      let [eventFirstMarket] = [...sportBookEvent.markets.values()];
      winningDistanceEvent.selections = [...eventFirstMarket?.selections?.values() ?? []].map(selection => {
        if (selection?.hideEntry)
          return null;

        let winningDistanceSelection = new WinningDistanceSelection();
        let selectionOrder = selection?.selectionName?.trim()?.split(" ");
        if (!!selectionOrder[0]) {
          let getNumbers = selection?.selectionName?.replace(/[^-+\d]/g, ''); //Remove alphabets from selection name
          let chekSelectionNameLength = getNumbers?.split('-');
          winningDistanceSelection.order = selectionOrder[0]?.toLocaleUpperCase() == selectionName.Under ? Order.One
            : selectionOrder[0]?.toLocaleUpperCase() == selectionName.Between || chekSelectionNameLength?.length == 2 ? Order.Two
              : selectionOrder[0]?.toLocaleUpperCase() == selectionName.Over ? Order.Three : Order.Four;
        }

        winningDistanceSelection.name = selection.selectionName;
        winningDistanceSelection.price = selection?.hidePrice ? SelectionSuspended.selectionAndPrice : (selection.prices?.price[0]?.numPrice && selection.prices?.price[0]?.denPrice ?
          selection.prices?.price[0]?.denPrice == 1 ? selection.prices?.price[0]?.numPrice?.toString() :
            selection.prices?.price[0]?.numPrice + "/" + selection.prices?.price[0]?.denPrice : ' ');
        winningDistanceSelection.hideEntry = selection?.hideEntry;
        return winningDistanceSelection;
      })?.filter(x => x !== null);
      winningDistanceEvent.selections = winningDistanceEvent?.selections?.sort((a, b) => { return a?.order > b?.order ? 1 : a?.order < b?.order ? -1 : 0 });
      return winningDistanceEvent;
    });

    result.events = this.sortByEventNameAndEventDateArray(result.events, [{ key: 'eventDateTime' }, { key: 'name' }])
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
    this.paginationService.calculateTotalPages(this.pageDetails, result?.events?.length);
    return result
  }

  paginationSetup(resultContent: WinningDistanceResult) {
    this.paginationService.paginationSetup(this.pageDetails, resultContent?.events?.length);
  }

  private sortByEventNameAndEventDateArray(array: WinningDistanceEvent[], options: any) {
    if (!Array.isArray(options)) {
      options = [{ key: options, order: 'asc' }];
    }

    options.forEach((item: any) => {
      item.multiplier = item.order != 'desc' ? -1 : 1;
    });

    return array.sort((firstItem: WinningDistanceEvent, secondItem: WinningDistanceEvent) => {
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

  ngOnDestroy(): void {
    this.clearPageTimer();
  }

  clearPageTimer() {
    if (!!this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
  }

}
