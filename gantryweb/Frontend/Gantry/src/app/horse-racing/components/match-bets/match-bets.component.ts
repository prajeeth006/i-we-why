import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { RouteDataService } from '../../../common/services/route-data.service';
import { SportBookEventStructured, SportBookResult } from '../../../common/models/data-feed/sport-bet-models';
import { MatchBetsResult } from '../../models/match-bets-model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../common/models/query-param.model';
import { SportBookService } from '../../../common/services/data-feed/sport-book.service';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { HorseRacingContentService } from '../../services/horseracing-content.service';
import { HorseRacingContent } from '../../models/horseracing-content.model';
import { ErrorService } from 'src/app/common/services/error.service';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SelectionSuspended } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-match-bets',
  templateUrl: './match-bets.component.html',
  styleUrls: ['./match-bets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.ShadowDom
})
export class MatchBetsComponent {
  private eventId: string;
  private marketId: string;

  errorMessage$ = this.errorService.errorMessage$;

  matchBetsResult$ = this.sportBookService.data$
    .pipe(
      map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
      map((sportBookEvent: SportBookEventStructured) => SportBookEventHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookEvent)),
      map((sportBookEvent: SportBookEventStructured) => {
        return this.prepareMatchBetsResult(sportBookEvent);
      }),
      tap((result: MatchBetsResult) => {
        this.errorService.isStaleDataAvailable = true;
        this.errorService.unSetError();
      }),
      catchError(err => {
        this.errorService.logError(err);
        return EMPTY;
      })
    );

  horseRacingContent$ = this.horseRacingContent.data$
    .pipe(
      tap((horseRacingContent: HorseRacingContent) => { }),
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
      return matchBetsResult;
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  prepareMatchBetsResult(sportBookEvent: SportBookEventStructured){
    let result = new MatchBetsResult();
    if(!sportBookEvent){
      return result
    }
    const [market] = sportBookEvent.markets?.values();
    const selections = [...market?.selections?.values() ?? []];

    result.event = sportBookEvent;
    result.selections = selections;
    result.eventTimePlusTypeName = result?.event?.eventTimePlusTypeName;
    result.selections = result.selections.filter(selection => {
      let prices = selection?.hidePrice ? SelectionSuspended.selectionAndPrice : SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
      selection.price = prices;
      return !selection.hideEntry;
    });
    this.prepareResult(result);

    return result
  }

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

  private prepareResult(result: MatchBetsResult) {
    result.selections = SportBookSelectionHelper.sortSelectionsByCalculatedPrice(result.selections);
  }
}
