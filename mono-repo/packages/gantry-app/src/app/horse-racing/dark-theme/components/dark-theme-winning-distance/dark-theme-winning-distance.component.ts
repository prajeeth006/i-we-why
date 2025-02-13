import { Component, OnDestroy } from '@angular/core';

import { EMPTY, Subscription, catchError, combineLatest, interval, map, startWith, tap } from 'rxjs';

import { SportBookEventHelper } from '../../../../common/helpers/sport-book-event.helper';
import { SportBookMarketHelper } from '../../../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../../../common/helpers/sport-book-selection-helper';
import { SportBookResult } from '../../../../common/models/data-feed/sport-bet-models';
import { SelectionSuspended } from '../../../../common/models/general-codes-model';
import { PageSizes, PaginationContent } from '../../../../common/models/pagination/pagination.models';
import { SportBookService } from '../../../../common/services/data-feed/sport-book.service';
import { ErrorService } from '../../../../common/services/error.service';
import { PaginationService } from '../../../../common/services/pagination.service';
import { RouteDataService } from '../../../../common/services/route-data.service';
import {
    WinningDistanceEvent,
    WinningDistanceResult,
    WinningDistanceSelection,
} from '../../../components/winning-distance/models/winning-distance.model';
import { Order, selectionName } from '../../../models/common.model';
import { HorseRacingContent } from '../../../models/horseracing-content.model';
import { HorseRacingContentService } from '../../../services/horseracing-content.service';

@Component({
    selector: 'gn-dark-theme-winning-distance',
    templateUrl: './dark-theme-winning-distance.component.html',
    styleUrls: ['./dark-theme-winning-distance.component.scss'],
})
export class DarkThemeWinningDistanceComponent implements OnDestroy {
    private eventMarketPairs: string;
    pageRefreshTime = 30000;
    pageDetails: PaginationContent = new PaginationContent();
    errorMessage$ = this.errorService.errorMessage$;
    isPageIntialised = false;
    pageTimerSubscription: Subscription;
    paginatedResult: WinningDistanceResult;

    constructor(
        private routeDataService: RouteDataService,
        private sportBookService: SportBookService,
        private errorService: ErrorService,
        private horseRacingContent: HorseRacingContentService,
        private paginationService: PaginationService,
    ) {
        this.pageDetails.pageSize = PageSizes.Two;
        const queryParams = this.routeDataService.getQueryParams();

        this.eventMarketPairs = queryParams['eventMarketPairs'];
        sportBookService.setEventMarketPairs(this.eventMarketPairs);
        sportBookService.setRemoveSuspendedSelections(false);
    }

    horseRacingContent$ = this.horseRacingContent.data$.pipe(
        startWith({} as HorseRacingContent), // Initial value
    );

    vm$ = combineLatest([this.sportBookService.data$, this.horseRacingContent$]).pipe(
        map(([sportBookResult, horseRacingContent]) => {
            return this.prepareResult(sportBookResult, horseRacingContent);
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

    prepareResult(sportBookResult: SportBookResult, horseRacingContent: HorseRacingContent) {
        const result = new WinningDistanceResult();
        if (!sportBookResult || sportBookResult?.events?.size <= 0) {
            return result;
        }
        const sportBookEvents = [...sportBookResult.events.values()];
        sportBookEvents.forEach((sportBookEvent) => SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent));

        const [firstEvent] = sportBookResult.events.values();
        const [firstMarket] = firstEvent.markets.values();

        result.horseRacingContent = horseRacingContent;

        result.categoryName = firstEvent?.categoryName;
        result.marketTitle = firstMarket?.marketName;
        result.winOrEachWayText = horseRacingContent?.contentParameters?.WinningDistanceMaxDistancePerRace ?? '';
        result.date = firstEvent?.eventDateTime;
        result.events = [...sportBookResult.events.values()].map((sportBookEvent) => {
            const winningDistanceEvent = new WinningDistanceEvent();
            winningDistanceEvent.name = sportBookEvent?.eventName?.replace('-', ' ');
            winningDistanceEvent.eventDateTime = sportBookEvent.eventDateTime;
            const [eventFirstMarket] = [...sportBookEvent.markets.values()];
            winningDistanceEvent.selections = [...(eventFirstMarket?.selections?.values() ?? [])]
                .map((selection) => {
                    if (selection?.hideEntry) return new WinningDistanceSelection();

                    const winningDistanceSelection = new WinningDistanceSelection();
                    const selectionOrder = selection?.selectionName?.trim()?.split(' ');
                    if (selectionOrder[0]) {
                        const getNumbers = selection?.selectionName?.replace(/[^-+\d]/g, ''); //Remove alphabets from selection name
                        const chekSelectionNameLength = getNumbers?.split('-');
                        winningDistanceSelection.order =
                            selectionOrder[0]?.toLocaleUpperCase() == selectionName.Under
                                ? Order.One
                                : selectionOrder[0]?.toLocaleUpperCase() == selectionName.Between || chekSelectionNameLength?.length == 2
                                  ? Order.Two
                                  : selectionOrder[0]?.toLocaleUpperCase() == selectionName.Over
                                    ? Order.Three
                                    : Order.Four;
                    }

                    winningDistanceSelection.name = selection.selectionName;
                    const prices = selection?.hidePrice
                        ? SelectionSuspended.selectionAndPrice
                        : SportBookMarketHelper.getPreparePrice(SportBookSelectionHelper.getLatestPrice(selection));
                    winningDistanceSelection.price = prices;
                    winningDistanceSelection.hideEntry = selection?.hideEntry;
                    return winningDistanceSelection;
                })
                ?.filter((x) => x !== null);
            winningDistanceEvent.selections = winningDistanceEvent?.selections?.sort((a: WinningDistanceSelection, b: WinningDistanceSelection) => {
                return a?.order > b?.order ? 1 : a?.order < b?.order ? -1 : 0;
            });
            return winningDistanceEvent;
        });

        result.events = this.sortByEventNameAndEventDateArray(result.events, [{ key: 'eventDateTime' }, { key: 'name' }]);
        this.paginatedResult = result;
        // Pagination logic
        if (!this.isPageIntialised || this.pageDetails.totalPages == 0) {
            this.isPageIntialised = true;
            this.paginationSetup(this.paginatedResult); //show first page immediately as we get data
            this.clearPageTimer();
            this.pageTimerSubscription = interval(this.pageRefreshTime).subscribe(() => {
                this.paginationSetup(this.paginatedResult);
                this.pageDetails.paginationText = this.paginationService.getNewDesignFooterText(
                    this.pageDetails.pageNumber,
                    this.pageDetails.totalPages,
                );
            });
        }
        this.paginationService.calculateTotalPages(this.pageDetails, result?.events?.length);
        this.pageDetails.paginationText = this.paginationService.getNewDesignFooterText(this.pageDetails.pageNumber, this.pageDetails.totalPages);
        return result;
    }

    paginationSetup(resultContent: WinningDistanceResult) {
        this.paginationService.paginationSetup(this.pageDetails, resultContent?.events?.length);
    }

    private sortByEventNameAndEventDateArray(array: WinningDistanceEvent[], options: any) {
        if (!Array.isArray(options)) {
            options = [{ key: options, order: 'asc' }];
        }

        options.forEach((item: any) => {
            item.multiplier = item.order != 'desc' ? -1 : 1;
        });

        return array.sort((firstItem: WinningDistanceEvent, secondItem: WinningDistanceEvent) => {
            for (const item of options) {
                const { key, multiplier } = item;

                const firstValue = firstItem[key as keyof WinningDistanceEvent]!;
                const secondValue = secondItem[key as keyof WinningDistanceEvent]!;

                if (firstValue != secondValue) {
                    return multiplier * (firstValue < secondValue ? 1 : -1);
                }
            }
            return 0;
        });
    }

    ngOnDestroy(): void {
        this.clearPageTimer();
    }

    clearPageTimer() {
        if (this.pageTimerSubscription) this.pageTimerSubscription.unsubscribe();
    }
}
