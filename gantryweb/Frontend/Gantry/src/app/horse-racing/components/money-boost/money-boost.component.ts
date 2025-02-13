import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { RouteDataService } from '../../../common/services/route-data.service';
import { SportBookEventStructured, SportBookResult, SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { MoneyBoostResult } from '../../models/money-boost.model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../common/models/query-param.model';
import { SportBookService } from '../../../common/services/data-feed/sport-book.service';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { HorseRacingContent } from '../../models/horseracing-content.model';
import { HorseRacingContentService } from '../../services/horseracing-content.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';

@Component({
  selector: 'gn-money-boost',
  templateUrl: './money-boost.component.html',
  styleUrls: ['./money-boost.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.ShadowDom
})
export class MoneyBoostComponent {
  private eventId: string;
  private marketId: string;

  errorMessage$ = this.errorService.errorMessage$;

  moneyBoostResult$ = this.sportBookService.data$
    .pipe(
      map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
      map((sportBookEvent: SportBookEventStructured) => SportBookEventHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookEvent)),
      map((sportBookEvent: SportBookEventStructured) => {
        return this.prepareMoneyBoostResult(sportBookEvent);
      }),
      tap((result: MoneyBoostResult) => {
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
      this.moneyBoostResult$,
      this.horseRacingContent$
    ]
  ).pipe(
    map(([moneyBoostResult, horseRacingContent]) => {
      moneyBoostResult.horseRacingContent = horseRacingContent;
      return this.prepareResult(moneyBoostResult);
    }),
    catchError(err => {
      return EMPTY;
    })
  );

  prepareMoneyBoostResult(sportBookEvent: SportBookEventStructured){
    let result = new MoneyBoostResult();
        if(!sportBookEvent){
          return result
        }

        const [market] = sportBookEvent.markets?.values();
        result.event = sportBookEvent;
        result.eventTimePlusTypeName = result?.event?.eventTimePlusTypeName;
        market?.selections?.forEach((selection: SportBookSelection) => {
          result.selection = { ...selection };
        })

        if (result.selection) {
          let prices = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(result.selection));
          result.selection.price = prices;
        }

        return result
  }

  prepareResult(moneyBoostResult: MoneyBoostResult) {
    let selectionName = moneyBoostResult?.selection?.selectionName;
    if (selectionName && selectionName?.includes('(')) {
      moneyBoostResult.selection.selectionName = !moneyBoostResult?.selection?.hideEntry ? selectionName?.split('(')[0]?.trim() : "";
      moneyBoostResult.oldPriceString = moneyBoostResult?.selection?.hidePrice ? "" : selectionName?.split('(')[1]?.replace(')', '')?.trim();
    }
    return moneyBoostResult;
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
}
