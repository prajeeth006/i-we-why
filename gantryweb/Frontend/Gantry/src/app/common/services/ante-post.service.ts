import { Injectable } from "@angular/core";
import { catchError, EMPTY, map, tap } from "rxjs";
import { JsonStringifyHelper } from "../helpers/json-stringify.helper";
import { SportBookEventHelper } from "../helpers/sport-book-event.helper";
import { SportBookMarketHelper } from "../helpers/sport-book-market.helper";
import { SportBookSelectionHelper } from "../helpers/sport-book-selection-helper";
import { AntePostResult } from "../models/ante-post.model";
import { SportBookEventStructured, SportBookResult } from "../models/data-feed/sport-bet-models";
import { GantryCommonContent } from "../models/gantry-commom-content.model";
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from "../models/query-param.model";
import { SportBookService } from "./data-feed/sport-book.service";
import { ErrorService } from "./error.service";
import { GantryCommonContentService } from "./gantry-common-content.service";

@Injectable({
  providedIn: 'root'
})
export class AntiPostService {
  private eventId: string;
  gantryCommonContent: GantryCommonContent;

  errorMessage$ = this.errorService.errorMessage$;


  constructor(private sportBookService: SportBookService,
    private gantryCommonContentService: GantryCommonContentService,
    private errorService: ErrorService) {
    this.gantryCommonContent$.subscribe((content: GantryCommonContent) => {
      this.gantryCommonContent = content;
    });
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

  data$ =
    this.sportBookService.data$
      .pipe(
        map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
        map((sportBookEvent: SportBookEventStructured) => SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent)),
        map((sportBookEvent: SportBookEventStructured) => {
          return this.prepareAntiPost(sportBookEvent);
        }),
        tap((result: AntePostResult) => {
          this.errorService.isStaleDataAvailable = true;
          this.errorService.unSetError();
        }),
        catchError(err => {
          this.errorService.logError(err);
          return EMPTY;
        }
        ));

  setEventMarketsList(eventId: string, marketId: string) {
    this.eventId = eventId;
    this.sportBookService.setEventMarketsList([new QueryParamEventMarkets(new QueryParamEvent(eventId), new QueryParamMarkets(marketId))]);
    this.sportBookService.setRemoveSuspendedSelections(false);
  }

  prepareAntiPost(sportBookEvent: SportBookEventStructured){
    let result = new AntePostResult();
    if(!sportBookEvent){
      return result
    }
    const [market] = sportBookEvent.markets?.values();
    const selections = [...market?.selections?.values() ?? []];
    result.event = sportBookEvent;
    result.market = market;
    result.selections = selections;
    result.selections.forEach(selection => {
      let prices = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
      selection.selectionName = selection?.selectionName;
      selection.price = prices;
    });
    //This is for outright results
    result.isOutrightResults = result.event.eventSort.trim().toUpperCase() == 'TNMT';
    result.outRightTitle = result.isOutrightResults ? result.event?.categoryName : result.racingContent?.contentParameters?.Title ?? result.event?.categoryName
    this.prepareResult(result);
    return result
  } 

  private prepareResult(result: AntePostResult) {
    if (result.market) {
      result.marketEachWay = SportBookMarketHelper.getEachWayString(result.market, this.gantryCommonContent);
    }
    result.selections = SportBookSelectionHelper.sortSelectionsByCalculatedPrice(result.selections);
  }
}