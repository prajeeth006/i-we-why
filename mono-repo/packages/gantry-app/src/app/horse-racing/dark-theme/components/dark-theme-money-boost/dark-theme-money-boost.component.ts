import { Component } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { SportBookEventHelper } from '../../../../common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../../../common/helpers/sport-book-selection-helper';
import { SportBookEventStructured, SportBookResult, SportBookSelection } from '../../../../common/models/data-feed/sport-bet-models';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../../common/models/query-param.model';
import { SportBookService } from '../../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../../common/services/error.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { HorseRacingContent } from '../../../models/horseracing-content.model';
import { MoneyBoostResult } from '../../../models/money-boost.model';
import { HorseRacingContentService } from '../../../services/horseracing-content.service';

@Component({
    selector: 'gn-dark-theme-money-boost',
    templateUrl: './dark-theme-money-boost.component.html',
    styleUrls: ['./dark-theme-money-boost.component.scss'],
})
export class DarkThemeMoneyBoostComponent {
    private eventId: string;
    private marketId: string;

    errorMessage$ = this.errorService.errorMessage$;

    constructor(
        private sportBookService: SportBookService,
        private routeDataService: RouteDataService,
        private horseRacingContent: HorseRacingContentService,
        private errorService: ErrorService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        this.eventId = queryParams['eventId'];
        this.marketId = queryParams['marketId'];
        sportBookService.setEventMarketsList([new QueryParamEventMarkets(new QueryParamEvent(this.eventId), new QueryParamMarkets(this.marketId))]);
        sportBookService.setRemoveSuspendedSelections(false);
    }

    moneyBoostResult$ = this.sportBookService.data$.pipe(
        map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
        map((sportBookEvent: SportBookEventStructured) =>
            SportBookEventHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookEvent),
        ),
        map((sportBookEvent: SportBookEventStructured) => {
            return this.prepareMoneyBoostResult(sportBookEvent);
        }),
        tap(() => {
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        tap(() => {}),
        startWith({} as HorseRacingContent), // Initial value
    );

    vm$ = combineLatest([this.moneyBoostResult$, this.horseRacingContent$]).pipe(
        map(([moneyBoostResult, horseRacingContent]) => {
            moneyBoostResult.horseRacingContent = horseRacingContent;
            return this.prepareResult(moneyBoostResult);
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    prepareMoneyBoostResult(sportBookEvent: SportBookEventStructured) {
        const result = new MoneyBoostResult();
        if (!sportBookEvent) {
            return result;
        }

        const [market] = sportBookEvent.markets.values();
        result.event = sportBookEvent;
        result.eventTimePlusTypeName = result?.event?.eventTimePlusTypeName; //?.split(" ")[0] + " " + market?.marketName
        market?.selections?.forEach((selection: SportBookSelection) => {
            result.selection = { ...selection };
        });

        if (result.selection) {
            const prices = SportBookMarketHelper.getPreparePrice(SportBookSelectionHelper.getLatestPrice(result.selection));
            result.selection.price = prices;
        }

        return result;
    }

    prepareResult(moneyBoostResult: MoneyBoostResult) {
        const selectionName = moneyBoostResult?.selection?.selectionName;
        if (selectionName && selectionName?.includes('(')) {
            moneyBoostResult.selection.selectionName = !moneyBoostResult?.selection?.hideEntry ? selectionName?.split('(')[0]?.trim() : '';
            moneyBoostResult.oldPriceString = moneyBoostResult?.selection?.hidePrice ? '' : selectionName?.split('(')[1]?.replace(')', '')?.trim();
        }
        return moneyBoostResult;
    }
}
