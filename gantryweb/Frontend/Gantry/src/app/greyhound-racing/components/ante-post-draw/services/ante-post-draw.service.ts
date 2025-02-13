import { Injectable } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookEventStructured, SportBookResult } from 'src/app/common/models/data-feed/sport-bet-models';
import { GantryCommonContent } from 'src/app/common/models/gantry-commom-content.model';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from 'src/app/common/models/query-param.model';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { GantryCommonContentService } from 'src/app/common/services/gantry-common-content.service';
import { AntePostDrawResult, AntePostDrawSelection } from 'src/app/greyhound-racing/models/ante-post-draw.model';
import { GreyhoundStaticContent } from 'src/app/greyhound-racing/models/greyhound-racing-template.model';
import { GreyhoundRacingContentService } from '../../greyhound-racing-template/services/greyhound-racing-content.service';

@Injectable({
  providedIn: 'root'
})
export class AntePostDrawService {
  private eventId: string;

  errorMessage$ = this.errorService.errorMessage$;

  gantryCommonContent$ = this.gantryCommonContentService.data$
    .pipe(
      tap((gantryCommonContent: GantryCommonContent) => {
        JSON.stringify(gantryCommonContent, JsonStringifyHelper.replacer);
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  greyHoundData$ = this.greyhoundRacingContentService.data$
    .pipe(
      tap((greyHoundData: GreyhoundStaticContent) => { }),
      catchError(err => {
        return EMPTY;
      })
    );

  data$ =
    combineLatest([
      this.sportBookService.data$,
      this.gantryCommonContent$,
      this.greyHoundData$
    ])
      .pipe(
        map(([sportBookResult, gantryCommonContent, greyhoundData]) => {
          return this.prepareAntiPostDrawResult(sportBookResult, gantryCommonContent, greyhoundData);
        }),
        tap((result: AntePostDrawResult) => {
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

  constructor(
    private sportBookService: SportBookService,
    private gantryCommonContentService: GantryCommonContentService,
    private greyhoundRacingContentService: GreyhoundRacingContentService,
    private errorService: ErrorService) {
    this.greyhoundRacingContentService.setImageType(true);
  }

  prepareAntiPostDrawResult(sportBookResult: SportBookResult, gantryCommonContent: GantryCommonContent, greyhoundData: GreyhoundStaticContent){
    let result = new AntePostDrawResult();
    if(!sportBookResult || sportBookResult?.events?.size <= 0){
      return result
    }
    let sportBookEvent = sportBookResult.events.get(parseInt(this.eventId));
    SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent)

    this.prepareResult(result, sportBookEvent, gantryCommonContent, greyhoundData);
    return result
  }

  private prepareResult(
    result: AntePostDrawResult,
    sportBookEvent: SportBookEventStructured,
    gantryCommonContent: GantryCommonContent,
    greyhoundData: GreyhoundStaticContent) {

    result.categoryName = greyhoundData.contentParameters.Title;
    result.typeName = sportBookEvent.typeName;
    result.eventName = sportBookEvent.eventName;

    const [market] = sportBookEvent.markets?.values();
    const selections = [...market?.selections?.values() ?? []];

    if (market) {
      result.winOrEachWayText = SportBookMarketHelper.getEachWayString(market, gantryCommonContent);
    }

    let selectionsSorted = selections.sort((a, b) => Number(a.runnerNumber) - Number(b.runnerNumber));

    result.selections = selectionsSorted.map(selection => {
      if (selection?.hideEntry)
      return null;
      let antePostDrawSelection = new AntePostDrawSelection();
      let prices = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
      antePostDrawSelection.name = !selection.hideEntry ? StringHelper.checkSelectionNameLengthAndTrimEnd(selection?.selectionName, SelectionNameLength.Eighteen) : "";
      antePostDrawSelection.price = prices;
      antePostDrawSelection.hidePrice = selection.hidePrice;
      antePostDrawSelection.trapImage = this.setGreyhoundTrapImages(selection.runnerNumber?.toString(), greyhoundData);
      antePostDrawSelection.hideEntry = selection.hideEntry;
      return antePostDrawSelection;
    })?.filter(x => x !== null);

  }

  private setGreyhoundTrapImages(runnerNo: string, staticContent: GreyhoundStaticContent): string {
    if (staticContent?.greyHoundImages?.runnerImages?.length >= (parseInt(runnerNo)))
      return staticContent?.greyHoundImages?.runnerImages[parseInt(runnerNo) - 1]?.src;
  }
}
