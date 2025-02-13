import { Component, ViewEncapsulation } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { SportBookEventHelper } from '../../../../common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../../../common/helpers/sport-book-selection-helper';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { SportBookEventStructured, SportBookResult } from '../../../../common/models/data-feed/sport-bet-models';
import { SelectionNameLength, SelectionSuspended } from '../../../../common/models/general-codes-model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../../common/models/query-param.model';
import { SportBookService } from '../../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../../common/services/error.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { HorseRacingContent } from '../../../models/horseracing-content.model';
import { HowFarResult } from '../../../models/how-far.model';
import { HorseRacingContentService } from '../../../services/horseracing-content.service';

@Component({
    selector: 'gn-dark-theme-how-far',
    templateUrl: './dark-theme-how-far.component.html',
    styleUrls: ['./dark-theme-how-far.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DarkThemeHowFarComponent {
    private eventId: string;
    private marketId: string;

    errorMessage$ = this.errorService.errorMessage$;

    howFarResult$ = this.sportBookService.data$.pipe(
        map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
        map((sportBookEvent: SportBookEventStructured) =>
            SportBookEventHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookEvent),
        ),
        map((sportBookEvent: SportBookEventStructured) => {
            return this.prepareHowFarResult(sportBookEvent);
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
        startWith({} as HorseRacingContent), // Initial value
    );

    vm$ = combineLatest([this.howFarResult$, this.horseRacingContent$]).pipe(
        map(([howFarResult, horseRacingContent]) => {
            howFarResult.horseRacingContent = horseRacingContent;
            return howFarResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

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

    prepareHowFarResult(sportBookEvent: SportBookEventStructured) {
        const result = new HowFarResult();
        if (!sportBookEvent) return result;

        const [market] = sportBookEvent.markets.values();
        const selections = [...(market?.selections?.values() ?? [])];

        result.event = sportBookEvent;
        result.market = market;
        result.selections = selections;
        result.eventTimePlusTypeName = result?.event?.eventTimePlusTypeName;
        result.selections.forEach((selection) => {
            const prices = selection?.hidePrice
                ? SelectionSuspended.selectionAndPrice
                : SportBookMarketHelper.getPreparePrice(SportBookSelectionHelper.getLatestPrice(selection));
            selection.price = prices;
        });
        this.prepareResult(result);
        const marketName = `${StringHelper.selectionNameLengthAndTrimEnd(result?.market?.marketName?.trim(), SelectionNameLength.Eighteen)}`;
        if (marketName) {
            result.marketNameOnTemplate = marketName;
        }

        return result;
    }

    private prepareResult(result: HowFarResult) {
        if (result?.market) {
            result.market.marketName = result?.market?.marketName?.replaceAll('WINNING DISTANCE', '');
        }
        result.selections = result?.selections?.filter((x) => !x?.hideEntry);
        result.selections.forEach((s) => (s.selectionName = s?.selectionName?.replace(result?.market?.marketName, '')?.replace('TO', '')));
        result.selections = result?.selections?.sort((first, second) => {
            let firstNumber = 10;
            firstNumber = first?.selectionName?.includes('LESS') || first?.selectionName?.includes('UNDER') ? 1 : firstNumber;
            firstNumber = first?.selectionName?.includes('BETWEEN') ? 2 : firstNumber;
            firstNumber = first?.selectionName?.includes('ABOVE') || first?.selectionName?.includes('OVER') ? 3 : firstNumber;

            let secondNumber = 10;
            secondNumber = second?.selectionName?.includes('LESS') || second?.selectionName?.includes('UNDER') ? 1 : secondNumber;
            secondNumber = second?.selectionName?.includes('BETWEEN') ? 2 : secondNumber;
            secondNumber = second?.selectionName?.includes('ABOVE') || second?.selectionName?.includes('OVER') ? 3 : secondNumber;

            return firstNumber - secondNumber;
        });
    }
}
