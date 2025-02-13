import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { EMPTY, catchError, combineLatest, map, startWith, tap } from 'rxjs';

import { JsonStringifyHelper } from '../../../common/helpers/json-stringify.helper';
import { SportBookEventHelper } from '../../../common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from '../../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../../common/helpers/sport-book-selection-helper';
import { SportBookEventStructured, SportBookResult } from '../../../common/models/data-feed/sport-bet-models';
import { SelectionSuspended } from '../../../common/models/general-codes-model';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../../common/models/query-param.model';
import { SportBookService } from '../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../common/services/error.service';
import { RouteDataService } from '../../../common/services/route-data.service';
import { HorseRacingContent } from '../../models/horseracing-content.model';
import { MatchBetsResult, SelectionsNames } from '../../models/match-bets-model';
import { HorseRacingContentService } from '../../services/horseracing-content.service';

@Component({
    selector: 'gn-hot-show',
    templateUrl: './hot-show.component.html',
    styleUrls: ['./hot-show.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.ShadowDom,
})
export class HotShowComponent {
    private eventId: string;
    private marketId: string;

    errorMessage$ = this.errorService.errorMessage$;

    matchBetsResult$ = this.sportBookService.data$.pipe(
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
        catchError((err) => {
            this.errorService.logError(err);
            return EMPTY;
        }),
    );

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        tap((horseRacingContent: HorseRacingContent) => JSON.stringify(horseRacingContent, JsonStringifyHelper.replacer)),
        startWith({} as HorseRacingContent), // Initial value
    );

    vm$ = combineLatest([this.matchBetsResult$, this.horseRacingContent$]).pipe(
        map(([matchBetsResult, horseRacingContent]) => {
            matchBetsResult.horseRacingContent = horseRacingContent;
            this.prepareMatchBetResult(matchBetsResult, horseRacingContent);
            return matchBetsResult;
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

    prepareMatchBetsResult(sportBookEvent: SportBookEventStructured) {
        const result = new MatchBetsResult();
        if (!sportBookEvent) return result;

        const [market] = sportBookEvent.markets.values();
        const selections = [...(market?.selections?.values() ?? [])];

        result.event = sportBookEvent;
        result.selections = selections ?? [];
        this.prepareResult(result);
        return result;
    }

    private prepareResult(result: MatchBetsResult) {
        result.selections = SportBookSelectionHelper.sortSelectionsByCalculatedPrice(result.selections);
    }

    prepareMatchBetResult(matchBetsResult: MatchBetsResult, horseRacingContent: HorseRacingContent) {
        matchBetsResult.hotShowSelections = new SelectionsNames();
        matchBetsResult?.selections?.forEach((selection) => {
            const prices = selection?.hidePrice
                ? SelectionSuspended.selectionAndPrice
                : SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
            const selectionName = horseRacingContent?.contentParameters?.And
                ? selection?.selectionName?.split(horseRacingContent?.contentParameters?.And)
                : selection?.selectionName;
            if (selectionName) {
                matchBetsResult.hotShowSelections.selectionName1 = !selection.hideEntry ? selectionName[0] : '';
                matchBetsResult.hotShowSelections.selectionName2 = !selection.hideEntry
                    ? !!selectionName[1] && selectionName.length >= 1
                        ? (horseRacingContent?.contentParameters?.And ?? '') +
                          ' ' +
                          (horseRacingContent?.contentParameters?.BothToWin
                              ? selectionName[1]?.replace(horseRacingContent?.contentParameters?.BothToWin, '')
                              : selectionName[1])
                        : ''
                    : '';
                matchBetsResult.hotShowSelections.bothToWin = !selection.hideEntry
                    ? horseRacingContent?.contentParameters?.BothToWin
                        ? selection?.selectionName?.includes(horseRacingContent?.contentParameters?.BothToWin)
                            ? horseRacingContent?.contentParameters?.BothToWin
                            : ''
                        : ''
                    : '';
                matchBetsResult.hotShowSelections.price = prices;
                matchBetsResult.hotShowSelections.hideEntry = selection.hideEntry;
            }
        });
    }
}
