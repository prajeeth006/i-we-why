import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { JsonStringifyHelper } from 'src/app/common/helpers/json-stringify.helper';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookEventStructured, SportBookResult } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionSuspended } from 'src/app/common/models/general-codes-model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from 'src/app/common/models/query-param.model';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { HorseRacingContent } from '../../models/horseracing-content.model';
import { MatchBetsResult, SelectionsNames } from '../../models/match-bets-model';
import { HorseRacingContentService } from '../../services/horseracing-content.service';

@Component({
  selector: 'gn-hot-show',
  templateUrl: './hot-show.component.html',
  styleUrls: ['./hot-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HotShowComponent {
  private eventId: string;
  private marketId: string;

  errorMessage$ = this.errorService.errorMessage$;

  matchBetsResult$ = this.sportBookService.data$
    .pipe(
      map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
      map((sportBookEvent: SportBookEventStructured) => SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent)),
      map((sportBookEvent: SportBookEventStructured) => {
        return this.prepareMatchBetsResult(sportBookEvent);
      }),
      tap((result: MatchBetsResult) => {
        this.errorService.isStaleDataAvailable = true;
        JSON.stringify(result, JsonStringifyHelper.replacer);
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  horseRacingContent$ = this.horseRacingContent.data$
    .pipe(
      tap((horseRacingContent: HorseRacingContent) => JSON.stringify(horseRacingContent, JsonStringifyHelper.replacer)),
      catchError(err => {
        return EMPTY;
      })
    );

  vm$ = combineLatest(
    [
      this.matchBetsResult$,
      this.horseRacingContent$
    ]
  ).pipe(
    map(([matchBetsResult, horseRacingContent]) => {
      matchBetsResult.horseRacingContent = horseRacingContent;
      this.prepareMatchBetResult(matchBetsResult, horseRacingContent);
      return matchBetsResult;
    }),
    catchError(err => {
      return EMPTY;
    })
  );


  constructor(
    private sportBookService: SportBookService,
    private routeDataService: RouteDataService,
    private horseRacingContent: HorseRacingContentService,
    private errorService: ErrorService
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    this.eventId = queryParams['eventId'];
    this.marketId = queryParams['marketId'];
    sportBookService.setEventMarketsList([new QueryParamEventMarkets(new QueryParamEvent(this.eventId), new QueryParamMarkets(this.marketId))]);
    sportBookService.setRemoveSuspendedSelections(false);
  }

  prepareMatchBetsResult(sportBookEvent: SportBookEventStructured){
    let result = new MatchBetsResult();
    if(!sportBookEvent)
      return result;

    const [market] = sportBookEvent.markets?.values();
    const selections = [...market?.selections?.values() ?? []];

    result.event = sportBookEvent;
    result.selections = selections ?? [];
    this.prepareResult(result);
    return result
  }

  private prepareResult(result: MatchBetsResult) {
    result.selections = SportBookSelectionHelper.sortSelectionsByCalculatedPrice(result.selections);
  }

  prepareMatchBetResult(matchBetsResult: MatchBetsResult, horseRacingContent: HorseRacingContent) {
    matchBetsResult.hotShowSelections = new SelectionsNames();
    matchBetsResult?.selections?.forEach(selection => {
      let prices = selection?.hidePrice ? SelectionSuspended.selectionAndPrice : SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
      let selectionName = selection?.selectionName?.split(horseRacingContent?.contentParameters?.And);
      if (!!selectionName) {
        matchBetsResult.hotShowSelections.selectionName1 = !selection.hideEntry ? selectionName[0] : "";
        matchBetsResult.hotShowSelections.selectionName2 = !selection.hideEntry ? ((!!selectionName[1] && selectionName.length >= 1)
          ? horseRacingContent?.contentParameters?.And + " " + selectionName[1]?.replace(horseRacingContent?.contentParameters?.BothToWin, '') : "") : "";
        matchBetsResult.hotShowSelections.bothToWin = !selection.hideEntry ? (selection?.selectionName?.includes(horseRacingContent?.contentParameters?.BothToWin)
          ? horseRacingContent?.contentParameters?.BothToWin : "") : "";
        matchBetsResult.hotShowSelections.price = prices;
        matchBetsResult.hotShowSelections.hideEntry = selection.hideEntry;

      }
    });
  }
}
