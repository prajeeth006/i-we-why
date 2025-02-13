import { Component } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { SportBookEventHelper } from '../../../../common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../../../common/helpers/sport-book-selection-helper';
import { SportBookEventStructured, SportBookResult, SportBookSelection } from '../../../../common/models/data-feed/sport-bet-models';
import { SelectionSuspended } from '../../../../common/models/general-codes-model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../../common/models/query-param.model';
import { SportBookService } from '../../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../../common/services/error.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import { GreyhoundRacingContentService } from '../../../components/greyhound-racing-template/services/greyhound-racing-content.service';
import { GreyhoundStaticContent } from '../../../models/greyhound-racing-template.model';
import { MoneyBoxResult, MoneyBoxSelection } from '../../../models/moneybox-model';

@Component({
    selector: 'gn-dark-theme-moneybox',
    templateUrl: './dark-theme-moneybox.component.html',
    styleUrls: ['./dark-theme-moneybox.component.scss'],
})
export class DarkThemeMoneyboxComponent {
    private eventId: string;
    private marketId: string;

    errorMessage$ = this.errorService.errorMessage$;

    greyHoundContentData$ = this.greyhoundRacingContentService.data$.pipe(
        tap((greyHoundData: GreyhoundStaticContent) => {
            console.log('greyHoundData', greyHoundData);
        }),
        startWith({} as GreyhoundStaticContent), // Initial Value
    );

    sportBookData$ = this.sportBookService.data$.pipe(
        map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
        map((sportBookEvent: SportBookEventStructured) => SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent)),
        tap(() => {
            this.errorService.isStaleDataAvailable = true;
            this.errorService.unSetError();
        }),
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    vm$ = combineLatest([this.sportBookData$, this.greyHoundContentData$]).pipe(
        map(([sportBookResult, greyHoundContentData]) => {
            return this.prepareMoneyBoxResult(sportBookResult, greyHoundContentData);
        }),
        catchError((error) => {
            console.log(error);
            return EMPTY;
        }),
    );

    constructor(
        private sportBookService: SportBookService,
        private routeDataService: RouteDataService,
        private greyhoundRacingContentService: GreyhoundRacingContentService,
        private errorService: ErrorService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        this.eventId = queryParams['eventId'];
        this.marketId = queryParams['marketId'];
        sportBookService.setEventMarketsList([new QueryParamEventMarkets(new QueryParamEvent(this.eventId), new QueryParamMarkets(this.marketId))]);
        sportBookService.setRemoveSuspendedSelections(false);
    }

    prepareMoneyBoxResult(sportBookResult: SportBookEventStructured, greyHoundContentData: GreyhoundStaticContent) {
        const moneyBoxResult = new MoneyBoxResult();
        if (!sportBookResult) {
            return moneyBoxResult;
        }
        this.prepareResult(moneyBoxResult, sportBookResult, greyHoundContentData);
        return moneyBoxResult;
    }

    private prepareResult(moneyBoxResult: MoneyBoxResult, sportBookResult: SportBookEventStructured, greyHoundContentData: GreyhoundStaticContent) {
        const [market] = sportBookResult.markets.values(); // take first market
        const selections = [...(market?.selections?.values() ?? [])];
        if (selections) {
            const sortingFunction: (a: SportBookSelection, b: SportBookSelection) => number = (a, b) => {
                // Your sorting logic here...
                if (Number(a.selectionName?.replace(/\D/g, '')) < Number(b.selectionName?.replace(/\D/g, ''))) {
                    return -1;
                } else {
                    return 0; // a and b are equal in terms of sorting
                }
            };
            selections.sort(sortingFunction);
        }

        moneyBoxResult.selections = selections
            .map((selection) => {
                if (selection?.hideEntry) return new MoneyBoxSelection();
                const moneyBoxSelection = new MoneyBoxSelection();
                const betPrice = SportBookMarketHelper.getPreparePrice(SportBookSelectionHelper.getLatestPrice(selection));
                moneyBoxSelection.price = !selection?.hidePrice ? betPrice : SelectionSuspended.selectionAndPrice;
                const imageItemNo = parseInt(selection?.selectionName?.replace(/\D/g, ''));
                moneyBoxSelection.trapNumber = imageItemNo;
                moneyBoxSelection.hideEntry = selection.hideEntry;
                return moneyBoxSelection;
            })
            ?.filter((x) => x !== null);
        moneyBoxResult.greyhoundRacingContent = greyHoundContentData;
        moneyBoxResult.marketName = [...sportBookResult.markets.values()]?.[0]?.marketName;
        moneyBoxResult.eventName = sportBookResult.eventName + ' ' + (greyHoundContentData?.contentParameters?.NewDesignMoneyBoxAndWYTHeader ?? '');
    }
}
