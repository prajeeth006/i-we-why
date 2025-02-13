import { Injectable } from '@angular/core';

import { concatMap, map, scan, shareReplay } from 'rxjs';

import { WindowHelper } from '../../../../../../common/helpers/window-helper/window-helper';
import { ResultingContent } from '../../../../../../common/models/data-feed/meeting-results.model';
import { SportBookEventStructured, SportBookMarketStructured, SportBookSelection } from '../../../../../../common/models/data-feed/sport-bet-models';
import { SportBookService } from '../../../../../../common/services/data-feed/sport-book.service';
import { EventFeedUrlService } from '../../../../../../common/services/event-feed-url.service';
import { EventSourceDataFeedService } from '../../../../../../common/services/event-source-data-feed.service';
import { EpsTempResult, SportBookEPSEventStructured } from '../data-feed/dark-theme-eps-models';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeEpsResultsService {
    constructor(
        private eventFeedUrlService: EventFeedUrlService,
        private eventSourceDataFeedService: EventSourceDataFeedService,
        private sportBookService: SportBookService,
        private _windowHelper: WindowHelper,
    ) {}

    data$ = this.eventFeedUrlService.eventFeedApiUrls$.pipe(
        concatMap((eventFeedApiUrls) => {
            const url = `${eventFeedApiUrls.epsApi}`;
            this.eventSourceDataFeedService.apiKeyName.next(null);

            return this.eventSourceDataFeedService.getServerSentEvent(url, true, eventFeedApiUrls.snapShotDataTimeOut).pipe(
                (dataString) => {
                    return dataString.pipe(
                        map((dataString) => {
                            const parsedData = JSON.parse(dataString);
                            const tempResult = new EpsTempResult();

                            if (parsedData.resultingContent) {
                                const resultingContent: ResultingContent = Object.assign(new ResultingContent(), parsedData.resultingContent);
                                tempResult.newItem = resultingContent;
                            }
                            const item = this.sportBookService.getNewItem(parsedData);
                            if (item) {
                                tempResult.newItem = item;
                            }
                            return tempResult;
                        }),
                    );
                },
                scan((tempResultSum: EpsTempResult, newTempResult: EpsTempResult) => {
                    if (newTempResult.newItem instanceof SportBookEventStructured) {
                        // Event
                        const newEvent: SportBookEventStructured = newTempResult.newItem;
                        const existingMatchedEvent: SportBookEPSEventStructured = tempResultSum.result.events.get(newEvent.eventKey!)!;

                        if (existingMatchedEvent) {
                            const currentMarkets = existingMatchedEvent.markets;
                            const resultContent = existingMatchedEvent.resultingContent;
                            const updatedEvent: SportBookEPSEventStructured = { ...existingMatchedEvent, ...newEvent };

                            this.sportBookService.setDeltaChannels(newEvent, existingMatchedEvent, updatedEvent);
                            this.sportBookService.setDeltaFlags(newEvent, existingMatchedEvent, updatedEvent);

                            updatedEvent.markets = this.sportBookService.setSelectionBasedOnEventStatus(
                                currentMarkets,
                                updatedEvent,
                                true,
                                false,
                                false,
                            );
                            updatedEvent.resultingContent = resultContent;
                            tempResultSum.result.events.set(updatedEvent.eventKey!, updatedEvent);
                        } else {
                            const market = newEvent.markets;
                            const epsevent = new SportBookEPSEventStructured();
                            const upatedEvent: SportBookEPSEventStructured = { ...epsevent, ...newEvent };
                            upatedEvent.markets = market;
                            tempResultSum.result.events.set(newEvent.eventKey!, upatedEvent);
                        }
                    } else if (newTempResult.newItem instanceof SportBookMarketStructured) {
                        // Market
                        const newMarket: SportBookMarketStructured = newTempResult.newItem;
                        const marketEvent: SportBookEventStructured = tempResultSum.result.events.get(newMarket.eventKey!)!;

                        if (!marketEvent) {
                            throw `Couldn't find event with id ${newMarket.eventKey}`;
                        }

                        const existingMatchedMarket: SportBookMarketStructured = marketEvent.markets.get(newMarket.marketKey!)!;

                        if (existingMatchedMarket) {
                            const currentSelections = existingMatchedMarket.selections;
                            const updatedMarket: SportBookMarketStructured = { ...existingMatchedMarket, ...newMarket };

                            this.sportBookService.setDeltaChannels(newMarket, existingMatchedMarket, updatedMarket);
                            this.sportBookService.setNCastDividends(newMarket, existingMatchedMarket, updatedMarket);

                            updatedMarket.selections = this.sportBookService.setSelectionBasedOnMarketStatus(
                                currentSelections,
                                marketEvent,
                                updatedMarket,
                                true,
                                false,
                                false,
                            );
                            marketEvent.markets.set(updatedMarket.marketKey!, updatedMarket);
                        } else {
                            marketEvent.markets.set(newMarket.marketKey!, newMarket);
                        }
                    } else if (newTempResult.newItem instanceof SportBookSelection) {
                        // Selection
                        let newSelection: SportBookSelection = newTempResult.newItem;
                        const selectionEvent: SportBookEventStructured = tempResultSum.result.events.get(newSelection.eventKey!)!;

                        if (!selectionEvent) {
                            throw `Couldn't find event with id ${newSelection.eventKey}`;
                        }

                        const selectionMarket: SportBookMarketStructured = selectionEvent.markets.get(newSelection.marketKey!)!;

                        if (!selectionMarket) {
                            throw `Couldn't find market with id ${newSelection.marketKey}`;
                        }

                        const existingMatchedSelection: SportBookSelection = selectionMarket.selections.get(newSelection.selectionKey!)!;

                        if (existingMatchedSelection) {
                            let updatedSelection: SportBookSelection = { ...existingMatchedSelection, ...newSelection };

                            this.sportBookService.setDeltaPriceChange(newSelection, existingMatchedSelection, updatedSelection);
                            this.sportBookService.setDeltaChannels(newSelection, existingMatchedSelection, updatedSelection);

                            updatedSelection = this.sportBookService.setSelectionBasedOnSelectionStatus(
                                updatedSelection,
                                selectionEvent,
                                selectionMarket,
                                true,
                                false,
                                false,
                            )!;

                            if (updatedSelection) selectionMarket.selections.set(updatedSelection.selectionKey!, updatedSelection);
                        } else {
                            newSelection = this.sportBookService.setSelectionBasedOnSelectionStatus(
                                newSelection,
                                selectionEvent,
                                selectionMarket,
                                true,
                                false,
                                false,
                            )!;

                            if (newSelection) selectionMarket.selections.set(newSelection.selectionKey!, newSelection);
                        }
                    } else if (newTempResult.newItem instanceof ResultingContent) {
                        const newResult: ResultingContent = newTempResult.newItem;

                        const resultEvent: SportBookEPSEventStructured = tempResultSum.result.events.get(newResult.eventId!)!;

                        if (!resultEvent) {
                            throw `Couldn't find event with id ${newResult.eventId}`;
                        } else {
                            const market = resultEvent.markets;
                            const epsevent = new SportBookEPSEventStructured();
                            epsevent.resultingContent = newResult;
                            const upatedEvent: SportBookEPSEventStructured = { ...epsevent, ...resultEvent };
                            upatedEvent.markets = market;
                            upatedEvent.resultingContent = newResult;
                            //resultEvent.resultingContent = newResult;
                            tempResultSum.result.events.set(resultEvent.eventKey!, upatedEvent);
                        }
                    }

                    return tempResultSum;
                }, new EpsTempResult()),
                map((epsResult: EpsTempResult) => {
                    this._windowHelper.raiseEventToElectron();
                    return epsResult.result;
                }),
                shareReplay(),
            );
        }),
    );
}
