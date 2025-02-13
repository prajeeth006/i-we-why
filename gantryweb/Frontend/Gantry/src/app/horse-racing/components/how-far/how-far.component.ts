import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { catchError, combineLatest, EMPTY, map, tap } from 'rxjs';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { SportBookResult, SportBookEventStructured } from '../../../common/models/data-feed/sport-bet-models';
import { HowFarResult } from '../../models/how-far.model';
import { QueryParamEventMarkets, QueryParamEvent, QueryParamMarkets } from '../../../common/models/query-param.model';
import { SportBookService } from '../../../common/services/data-feed/sport-book.service';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { HorseRacingContent } from '../../models/horseracing-content.model';
import { HorseRacingContentService } from '../../services/horseracing-content.service';
import { ErrorService } from 'src/app/common/services/error.service';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SelectionSuspended } from 'src/app/common/models/general-codes-model';

@Component({
  selector: 'gn-how-far',
  templateUrl: './how-far.component.html',
  styleUrls: ['./how-far.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized),
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HowFarComponent {
  private eventId: string;
  private marketId: string;

  errorMessage$ = this.errorService.errorMessage$;

  howFarResult$ = this.sportBookService.data$
    .pipe(
      map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
      map((sportBookEvent: SportBookEventStructured) => SportBookEventHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookEvent)),
      map((sportBookEvent: SportBookEventStructured) => {
        return this.prepareHowFarResult(sportBookEvent);
      }),
      tap((result: HowFarResult) => {
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
      tap((horseRacingContent: HorseRacingContent) => {}),
      catchError(err => {
        return EMPTY;
      })
    );

  vm$ = combineLatest(
    [
      this.howFarResult$,
      this.horseRacingContent$
    ]
  ).pipe(
    map(([howFarResult, horseRacingContent]) => {
      howFarResult.horseRacingContent = horseRacingContent;
      return howFarResult;
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

  prepareHowFarResult(sportBookEvent: SportBookEventStructured){
    const result = new HowFarResult();
    if(!sportBookEvent)
      return result;

    const [market] = sportBookEvent.markets?.values();
    let selections = [...market?.selections?.values() ?? []];

    result.event = sportBookEvent;
    result.market = market;
    result.selections = selections;
    result.eventTimePlusTypeName = result.event.eventTimePlusTypeName;
    result.selections.forEach(selection => {
      let prices = selection?.hidePrice ? SelectionSuspended.selectionAndPrice  : SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
      selection.price = prices;
    });
    this.prepareResult(result);

    return result;
  }

  private prepareResult(result: HowFarResult) {
    if (result.market) {
      result.market.marketName = result.market.marketName.replaceAll("WINNING DISTANCE", "");
    }
    result.selections = result.selections.filter(x => !x.hideEntry);
    result.selections.forEach(s => s.selectionName = s.selectionName.replace(result.market.marketName, "").replace("TO", ""));
    result.selections = result.selections.sort((first, second) => {
      let firstNumber = 10;
      firstNumber = first.selectionName.includes("LESS") || first.selectionName.includes("UNDER") ? 1 : firstNumber;
      firstNumber = first.selectionName.includes("BETWEEN") ? 2 : firstNumber;
      firstNumber = first.selectionName.includes("ABOVE") || first.selectionName.includes("OVER") ? 3 : firstNumber;


      let secondNumber = 10;
      secondNumber = second.selectionName.includes("LESS") || second.selectionName.includes("UNDER") ? 1 : secondNumber;
      secondNumber = second.selectionName.includes("BETWEEN") ? 2 : secondNumber;
      secondNumber = second.selectionName.includes("ABOVE") || second.selectionName.includes("OVER") ? 3 : secondNumber;

      return firstNumber - secondNumber;
    });
  }
}
