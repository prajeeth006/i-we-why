import { Component } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookEventStructured, SportBookResult } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionSuspended } from 'src/app/common/models/general-codes-model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from 'src/app/common/models/query-param.model';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { GreyhoundStaticContent } from '../../models/greyhound-racing-template.model';
import { MoneyBoxResult, MoneyBoxSelection } from '../../models/moneybox-model';
import { GreyhoundRacingContentService } from '../greyhound-racing-template/services/greyhound-racing-content.service';

@Component({
  selector: 'gn-moneybox',
  templateUrl: './moneybox.component.html',
  styleUrls: ['./moneybox.component.scss']
})
export class MoneyboxComponent {
  private eventId: string;
  private marketId: string;
  private isCoral: boolean; // if true its coral even otherwise its ladbrokes

  errorMessage$ = this.errorService.errorMessage$;

  greyHoundContentData$ = this.greyhoundRacingContentService.data$
    .pipe(
      tap((greyHoundData: GreyhoundStaticContent) => { }),
      catchError(err => {
        return EMPTY;
      })
    );

  sportBookData$ = this.sportBookService.data$
    .pipe(
      map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
      map((sportBookEvent: SportBookEventStructured) => SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent)),
      tap((sportBookResult: SportBookEventStructured) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  vm$ = combineLatest([
    this.sportBookData$,
    this.greyHoundContentData$
  ])
    .pipe(
      map(([sportBookResult, greyHoundContentData]) => {
        return this.prepareMoneyBoxResult(sportBookResult, greyHoundContentData);
      }),
      tap((result: MoneyBoxResult) => { }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(
    private sportBookService: SportBookService,
    private routeDataService: RouteDataService,
    private greyhoundRacingContentService: GreyhoundRacingContentService,
    private errorService: ErrorService
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    this.eventId = queryParams['eventId'];
    this.marketId = queryParams['marketId'];
    let url = this.routeDataService.getUrl();
    this.isCoral = url.toLowerCase().includes("coral");
    sportBookService.setEventMarketsList([new QueryParamEventMarkets(new QueryParamEvent(this.eventId), new QueryParamMarkets(this.marketId))]);
    sportBookService.setRemoveSuspendedSelections(false);
    this.greyhoundRacingContentService.setImageType(true);
  }

  prepareMoneyBoxResult(sportBookResult: SportBookEventStructured, greyHoundContentData: GreyhoundStaticContent){
    let moneyBoxResult = new MoneyBoxResult();
    if(!sportBookResult){
      return moneyBoxResult
    }
    this.prepareResult(moneyBoxResult, sportBookResult, greyHoundContentData);
    return moneyBoxResult;
  }

  private prepareResult(moneyBoxResult: MoneyBoxResult, sportBookResult: SportBookEventStructured, greyHoundContentData: GreyhoundStaticContent) {
    const [market] = sportBookResult.markets?.values(); // take first market
    let selections = [...market?.selections?.values() ?? []];
    selections.sort((a, b) => {
      if (Number(a.selectionName.replace(/\D/g, "")) < Number(b.selectionName.replace(/\D/g, ""))) return -1;
    });

    moneyBoxResult.selections = selections.map(selection => {
      if (selection?.hideEntry)
      return null;
      let moneyBoxSelection = new MoneyBoxSelection();
      let betPrice = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
      moneyBoxSelection.price = !selection?.hidePrice ? betPrice : SelectionSuspended.selectionAndPrice;
      const imageItemNo = parseInt(selection?.selectionName.replace(/\D/g, ""));
      moneyBoxSelection.trapImage = this.greyhoundRacingPostTipImage(imageItemNo, greyHoundContentData);
      moneyBoxSelection.hideEntry = selection.hideEntry;
      return moneyBoxSelection;
    })?.filter(x => x !== null);
    moneyBoxResult.greyhoundRacingContent = greyHoundContentData;
    moneyBoxResult.marketName = [...sportBookResult.markets?.values()]?.[0]?.marketName;
    moneyBoxResult.eventName = sportBookResult.eventName;
    moneyBoxResult.isCoral = this.isCoral;
  }
  greyhoundRacingPostTipImage(imageItemNo: number, imageData: GreyhoundStaticContent) {
    if (imageData?.greyHoundImages?.runnerImages?.length >= imageItemNo)
      return imageData?.greyHoundImages?.runnerImages[imageItemNo - 1]?.src;
    else
      return "";
  }
}
