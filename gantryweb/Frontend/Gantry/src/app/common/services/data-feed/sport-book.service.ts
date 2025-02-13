import { Injectable } from '@angular/core';
import { IChannelsObject, Prices, SportBookEventStructured, SportBookMarketStructured, SportBookSelection, SportBookTempResult } from '../../models/data-feed/sport-bet-models';
import { EventFeedUrlService } from './../event-feed-url.service';
import { EventSourceDataFeedService } from './../event-source-data-feed.service';
import { QueryParamEventMarkets } from '../../models/query-param.model';
import { BehaviorSubject, combineLatest, concat, concatMap, map, scan, shareReplay } from 'rxjs';
import { DisplayStatus, EventStatus, MarketStatus, PriceType, SelectionStatus } from '../../models/general-codes-model';
import { EventFeedApiUrls } from '../../models/event-feed-api-urls.model';
import { WindowHelper } from '../../helpers/window-helper/window-helper';

@Injectable({
  providedIn: 'root'
})
export class SportBookService {
  private eventMarketsListSubject = new BehaviorSubject<QueryParamEventMarkets[]>([]);
  private eventMarketsList$ = this.eventMarketsListSubject.asObservable();

  private useMultiEventUrlSubject = new BehaviorSubject<boolean>(false);
  private useMultiEventUrl$ = this.useMultiEventUrlSubject.asObservable();

  private eventMarketPairsSubject = new BehaviorSubject<string>("");
  private eventMarketPairs$ = this.eventMarketPairsSubject.asObservable();

  private needSuspendedFilterSubject = new BehaviorSubject<boolean>(true);
  private needSuspendedFilter$ = this.needSuspendedFilterSubject.asObservable();

  private removeSuspendedSelectionSubject = new BehaviorSubject<boolean>(true);
  private removeSuspendedSelection$ = this.removeSuspendedSelectionSubject.asObservable();

  private marketExceptionSubject = new BehaviorSubject<boolean>(false);
  private marketException$ = this.marketExceptionSubject.asObservable();

  private eventFeedApiUrls$ = this.eventFeedUrlService.eventFeedApiUrls$;

  data$ = combineLatest([
    this.eventMarketsList$,
    this.eventFeedApiUrls$,
    this.eventMarketPairs$,
    this.useMultiEventUrl$,
    this.needSuspendedFilter$,
    this.removeSuspendedSelection$,
    this.marketException$
  ])
    .pipe(
      concatMap(([eventMarketsList, eventFeedApiUrls, eventMarketPairs, useMultiEventUrl, needSuspendedFilter, removeSuspendedSelection, marketException]:
        [QueryParamEventMarkets[], EventFeedApiUrls, string, boolean, boolean, boolean, boolean]) => {

        var allUrls: string[] = [];
        if (useMultiEventUrl) {
          //let urlMultiEvent = `http://localhost:16704/local/multi-event/events/${eventMarketPairs}`;//`${eventFeedApiUrls.multiEventApi}${eventMarketPairs}`;
          let urlMultiEvent = `${eventFeedApiUrls.multiEventApi}${eventMarketPairs}`;
          allUrls.push(urlMultiEvent);
        }
        else {
          eventMarketsList.forEach(em => {
            let url = `${eventFeedApiUrls.eventsApi}${em.event.key}/markets/${em.market.keys}`;
            allUrls.push(url);
          });
        }

        return concat(allUrls.map(url => this.eventSourceDataFeedService.getServerSentEvent(url, true, eventFeedApiUrls.snapShotDataTimeOut)))
          .pipe(
            concatMap(dataString => {
              return dataString.pipe(
                map(dataString => {
                  let parsedData = JSON.parse(dataString);
                  let tempResult = new SportBookTempResult();

                  let item = this.getNewItem(parsedData);
                  if (item) {
                    tempResult.newItem = item;
                  }

                  return tempResult;
                }))
            }),
            scan((tempResultSum: SportBookTempResult, newTempResult: SportBookTempResult) => {

              if (newTempResult.newItem instanceof SportBookEventStructured) {
                // Event
                let newEvent: SportBookEventStructured = newTempResult.newItem;
                let existingMatchedEvent: SportBookEventStructured = tempResultSum.result.events.get(newEvent.eventKey);

                if (existingMatchedEvent) {
                  let currentMarkets = existingMatchedEvent.markets;
                  let updatedEvent: SportBookEventStructured = { ...existingMatchedEvent, ...newEvent };

                  this.setDeltaChannels(newEvent, existingMatchedEvent, updatedEvent);
                  this.setDeltaFlags(newEvent, existingMatchedEvent, updatedEvent);

                  updatedEvent.markets = this.setSelectionBasedOnEventStatus(currentMarkets, updatedEvent, needSuspendedFilter, removeSuspendedSelection, marketException);
                  tempResultSum.result.events.set(updatedEvent.eventKey, updatedEvent);
                } else {
                  tempResultSum.result.events.set(newEvent.eventKey, newEvent);
                }
              }
              else if (newTempResult.newItem instanceof SportBookMarketStructured) {
                // Market
                let newMarket: SportBookMarketStructured = newTempResult.newItem;
                let marketEvent: SportBookEventStructured = tempResultSum.result.events.get(newMarket.eventKey);

                if (!marketEvent) {
                  throw `Couldn't find event with id ${newMarket.eventKey}`;
                }

                let existingMatchedMarket: SportBookMarketStructured = marketEvent.markets.get(newMarket.marketKey);

                if (existingMatchedMarket) {
                  const currentSelections = existingMatchedMarket.selections
                  let updatedMarket: SportBookMarketStructured = { ...existingMatchedMarket, ...newMarket };

                  this.setDeltaChannels(newMarket, existingMatchedMarket, updatedMarket);
                  this.setNCastDividends(newMarket, existingMatchedMarket, updatedMarket);

                  updatedMarket.selections = this.setSelectionBasedOnMarketStatus(currentSelections, marketEvent, updatedMarket, needSuspendedFilter, removeSuspendedSelection, marketException);
                  marketEvent.markets.set(updatedMarket.marketKey, updatedMarket);
                } else {
                  marketEvent.markets.set(newMarket.marketKey, newMarket);
                }
              }
              else if (newTempResult.newItem instanceof SportBookSelection) {
                // Selection
                let newSelection: SportBookSelection = newTempResult.newItem;
                let selectionEvent: SportBookEventStructured = tempResultSum.result.events.get(newSelection.eventKey);

                if (!selectionEvent) {
                  throw `Couldn't find event with id ${newSelection.eventKey}`;
                }

                let selectionMarket: SportBookMarketStructured = selectionEvent.markets.get(newSelection.marketKey);

                if (!selectionMarket) {
                  throw `Couldn't find market with id ${newSelection.marketKey}`;
                }

                let existingMatchedSelection: SportBookSelection = selectionMarket.selections.get(newSelection.selectionKey)

                if (existingMatchedSelection) {
                  let updatedSelection: SportBookSelection = { ...existingMatchedSelection, ...newSelection };

                  this.setDeltaPriceChange(newSelection, existingMatchedSelection, updatedSelection);
                  this.setDeltaChannels(newSelection, existingMatchedSelection, updatedSelection);

                  updatedSelection = this.setSelectionBasedOnSelectionStatus(updatedSelection, selectionEvent, selectionMarket, needSuspendedFilter, removeSuspendedSelection, marketException)

                  if (updatedSelection)
                    selectionMarket.selections.set(updatedSelection.selectionKey, updatedSelection);

                } else {

                  newSelection = this.setSelectionBasedOnSelectionStatus(newSelection, selectionEvent, selectionMarket, needSuspendedFilter, removeSuspendedSelection, marketException)

                  if (newSelection)
                    selectionMarket.selections.set(newSelection.selectionKey, newSelection);
                }
              }
              return tempResultSum;
            }, new SportBookTempResult()),
            map((sportBookResult: SportBookTempResult) => {
              this._windowHelper.raiseEventToElectron();
              return sportBookResult.result
            })
            //map(dataString => )
          );
      }),
      shareReplay()
    );



  constructor(
    private eventFeedUrlService: EventFeedUrlService,
    private eventSourceDataFeedService: EventSourceDataFeedService,
    private _windowHelper: WindowHelper
  ) { }



  setSelectionBasedOnEventStatus(markets: Map<number, SportBookMarketStructured>, event: SportBookEventStructured, needSuspendedFilter: boolean, removeSuspendedSelection: boolean, marketException: boolean) {

    markets.forEach((market: SportBookMarketStructured, key: Number) => {
      market.selections = this.setSelectionBasedOnMarketStatus(market.selections, event, market, needSuspendedFilter, removeSuspendedSelection, marketException);
    });
    return markets;
  }

  setSelectionBasedOnMarketStatus(selections: Map<number, SportBookSelection>, event: SportBookEventStructured, market: SportBookMarketStructured, needSuspendedFilter: boolean, removeSuspendedSelection: boolean, marketException: boolean) {

    let finalSelection = new Map<number, SportBookSelection>();
    selections.forEach((selection: SportBookSelection, key: Number) => {
      let modifiedSelection = this.setSelectionBasedOnSelectionStatus(selection, event, market, needSuspendedFilter, removeSuspendedSelection, marketException);
      if (modifiedSelection)
        finalSelection.set(modifiedSelection.selectionKey, modifiedSelection);
    });

    return finalSelection;
  }

  setSelectionBasedOnSelectionStatus(selection: SportBookSelection, event: SportBookEventStructured, market: SportBookMarketStructured, needSuspendedFilter: boolean, removeSuspendedSelection: boolean, marketException: boolean) {
    if (!!selection?.prices?.price) {
      selection.prices.price = selection?.prices?.price?.filter(item => !PriceType.startPrice.includes(item?.selectionPriceType));
    }

    if (selection.selectionStatus?.toUpperCase() == SelectionStatus.Suspended && selection.displayStatus?.toUpperCase() == DisplayStatus.NotDisplayed) {
      selection.hideEntry = true;
    } else {
      selection.hideEntry = false;
    }

    if (removeSuspendedSelection && selection.selectionStatus?.toUpperCase() == SelectionStatus.Suspended && selection.displayStatus?.toUpperCase() == DisplayStatus.NotDisplayed) {
      return null;
    }

    selection.hidePrice = needSuspendedFilter && (
      event?.eventStatus?.toUpperCase() == EventStatus.Suspended ||
      (market?.marketStatus?.toUpperCase() == MarketStatus.Suspended && !marketException) ||
      selection.selectionStatus?.toUpperCase() == SelectionStatus.Suspended)

    return selection;
  }

  setEventMarketsList(eventMarketsList: QueryParamEventMarkets[]) {
    this.eventMarketsListSubject.next(eventMarketsList);
  }

  setNeedSuspendedFilter(needSuspended: boolean) {
    this.needSuspendedFilterSubject.next(needSuspended);
  }

  setRemoveSuspendedSelections(needSuspended: boolean) {
    this.removeSuspendedSelectionSubject.next(needSuspended);
  }


  setMarketException(marketExcept: boolean) {
    this.marketExceptionSubject.next(marketExcept);
  }

  setEventMarketPairs(eventMarketPairs: string) {
    this.eventMarketPairsSubject.next(eventMarketPairs);

    if (eventMarketPairs) {
      this.useMultiEventUrlSubject.next(true);
    }
    else {
      this.useMultiEventUrlSubject.next(false);
    }
  }

  setDeltaPriceChange(newSelection: SportBookSelection, existingMatchedSelection: SportBookSelection, updatedSelection: SportBookSelection) {
    let operation = newSelection.meta?.operation;
    let isCreateOperation = operation === "create";
    let isUpdateOperation = operation === "update";

    if (!isCreateOperation && !isUpdateOperation) {
      return;
    }

    const newPrices = new Prices();
    newPrices.price = [];
    updatedSelection.prices = existingMatchedSelection.prices ?? newPrices;

    if (isCreateOperation) {
      updatedSelection.prices.price = newSelection.prices?.price;
    }
    else if (isUpdateOperation) {
      updatedSelection.prices.price = [...newSelection.prices?.price ?? [], ...updatedSelection.prices.price ?? []];
    }
  }

  setDeltaChannels(newChannelObject: IChannelsObject, existingChannelObject: IChannelsObject, updatedChannelObject: IChannelsObject) {
    let operation = newChannelObject.meta?.operation;
    let isCreateOperation = operation === "create";
    let isUpdateOperation = operation === "update";

    if (!isCreateOperation && !isUpdateOperation) {
      return;
    }

    updatedChannelObject.channels = existingChannelObject.channels ?? [];

    if (isCreateOperation) {
      updatedChannelObject.channels = newChannelObject.channels;
    }
    else if (isUpdateOperation) {
      updatedChannelObject.channels = [...newChannelObject.channels ?? [], ...updatedChannelObject.channels];
    }
  }

  setDeltaFlags(newEvent: SportBookEventStructured, existingEvent: SportBookEventStructured, updatedEvent: SportBookEventStructured) {
    let operation = newEvent.meta?.operation;
    let isCreateOperation = operation === "create";
    let isUpdateOperation = operation === "update";

    if (!isCreateOperation && !isUpdateOperation) {
      return;
    }

    updatedEvent.flags = existingEvent.flags ?? [];

    if (isCreateOperation) {
      updatedEvent.flags = newEvent.flags;
    }
    else if (isUpdateOperation) {
      updatedEvent.flags = [...newEvent.flags ?? [], ...updatedEvent.flags];
    }
  }

  setNCastDividends(newMarket: SportBookMarketStructured, existingMarket: SportBookMarketStructured, updatedMarket: SportBookMarketStructured) {
    let operation = newMarket.meta?.operation;
    let isCreateOperation = operation === "create";
    let isUpdateOperation = operation === "update";

    if (!isCreateOperation && !isUpdateOperation) {
      return;
    }

    updatedMarket.nCastDividends = existingMarket.nCastDividends ?? [];

    if (isCreateOperation) {
      updatedMarket.nCastDividends = newMarket.nCastDividends;
    }
    else if (isUpdateOperation) {
      if (newMarket.nCastDividend) {
        updatedMarket.nCastDividends = [newMarket.nCastDividend, ...updatedMarket.nCastDividends];
      }

      if (newMarket.nCastDeleteDividend) {


        const nCastDividendToDelete = newMarket.nCastDeleteDividend;
        var indexDividendToRemove = updatedMarket.nCastDividends.findIndex(nCastDividend => this.shallowCompare(nCastDividend, nCastDividendToDelete));

        if (indexDividendToRemove > -1) {
          updatedMarket.nCastDividends.splice(indexDividendToRemove, 1);
        }
      }
    }
  }

  shallowCompare(obj1: any, obj2: any) {
    return Object.keys(obj1).length === Object.keys(obj2).length &&
      Object.keys(obj1).every(key =>
        obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
      );
  }

  getNewItem(parsedData: any) {
    if (parsedData.event) {
      let event: SportBookEventStructured = Object.assign(new SportBookEventStructured, parsedData.event);
      return event;
    }
    else if (parsedData.market) {
      const market: SportBookMarketStructured = Object.assign(new SportBookMarketStructured, parsedData.market);
      return market;
    }
    else if (parsedData.selection) {
      let selection: SportBookSelection = Object.assign(new SportBookSelection, parsedData.selection);
      return selection;
    }
  }

}
