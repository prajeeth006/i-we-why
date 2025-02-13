import { ChangeDetectionStrategy, Component } from '@angular/core';

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
import { HorseRacingContent } from '../../../models/horseracing-content.model';
import { MatchBetsResult } from '../../../models/match-bets-model';
import { HorseRacingContentService } from '../../../services/horseracing-content.service';

@Component({
    selector: 'gn-dark-theme-match-bets',
    templateUrl: './dark-theme-match-bets.component.html',
    styleUrls: ['./dark-theme-match-bets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
})
export class DarkThemeMatchBetsComponent {
    private eventId: string;
    private marketId: string;

    errorMessage$ = this.errorService.errorMessage$;

    matchBetsResult$ = this.sportBookService.data$.pipe(
        map((sportBookResult: SportBookResult) => sportBookResult.events.get(parseInt(this.eventId))),
        map((sportBookEvent: SportBookEventStructured) =>
            SportBookEventHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookEvent),
        ),
        map((sportBookEvent: SportBookEventStructured) => {
            return this.prepareMatchBetsResult(sportBookEvent);
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

    vm$ = combineLatest([this.matchBetsResult$, this.horseRacingContent$]).pipe(
        map(([matchBetsResult, horseRacingContent]) => {
            matchBetsResult.horseRacingContent = horseRacingContent;
            return matchBetsResult;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    prepareMatchBetsResult(sportBookEvent: SportBookEventStructured) {
        const result = new MatchBetsResult();
        if (!sportBookEvent) {
            return result;
        }
        const [market] = sportBookEvent.markets.values();
        const selections = [...(market?.selections?.values() ?? [])];

        result.event = sportBookEvent;
        result.selections = selections;
        result.eventTimePlusTypeName = result?.event?.eventTimePlusTypeName;
        result.selections = result.selections.filter((selection) => {
            const prices = selection?.hidePrice
                ? SelectionSuspended.selectionAndPrice
                : SportBookMarketHelper.getPreparePrice(SportBookSelectionHelper.getLatestPrice(selection));
            selection.price = prices;
            return !selection.hideEntry;
        });
        this.prepareResult(result);

        return result;
    }

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

    private prepareResult(result: MatchBetsResult) {
        result.selections = result?.selections?.sort((a: SportBookSelection, b: SportBookSelection) =>
            a?.selectionName?.localeCompare(b?.selectionName),
        );
    }
}
