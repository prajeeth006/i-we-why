import { Injectable } from '@angular/core';
import { IChannelsObject, Prices, SportBookEventStructured, SportBookMarketStructured, SportBookSelection, SportBookTempResult } from './../../models/sport-bet-models';
import { EventSourceDataFeedService } from '../../services/eventfeed-service/event-source-data-feed.service';
import { QueryParamEventMarkets } from '../../models/query-param.model';
import { DisplayStatus, EventStatus, MarketStatus, PriceType, SelectionStatus } from '../../models/general-codes-model';
import { concatMap, map, scan } from 'rxjs/operators';
import { Observable, concat } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SportBookService {

  getEventDataFromSportsBook(eventMarketsList: QueryParamEventMarkets[], eventFeedApiUrls: string, snapShotTimeout: number, eventMarketPairs: string = "", useMultiEventUrl: boolean = false, needSuspendedFilter: boolean = false, removeSuspendedSelection: boolean = false) {

    var allUrls: string[] = [];
    if (useMultiEventUrl) {
      let urlMultiEvent = `${eventFeedApiUrls}${eventMarketPairs}`;
      allUrls.push(urlMultiEvent);
    }
    else {
      eventMarketsList.forEach(em => {
        let url = eventFeedApiUrls?.replace("{event}", !!em.event.key ? em.event.key : "")?.replace("{markets}", !!em.market.keys ? em.market.keys : "");
        allUrls.push(url);
      });
    }

    return concat(allUrls.map(url => this.eventSourceDataFeedService.getServerSentEvent(url, snapShotTimeout)))
      .pipe(
        concatMap((dataString: Observable<any>) => {
          return dataString.pipe(
            map((dataString: string) => {

              let parsedData = JSON.parse(dataString);
              let tempResult = new SportBookTempResult();

              let item = this.getNewItem(parsedData);
              if (item) {
                tempResult.newItem = item;
              }
              tempResult.isFinished = parsedData?.isFinished;

              return tempResult;
            }))
        }),
        scan((tempResultSum: SportBookTempResult, newTempResult: SportBookTempResult) => {


          if (newTempResult.newItem instanceof SportBookEventStructured) {
            // Event
            let newEvent: SportBookEventStructured = newTempResult.newItem;
            if (newEvent.eventKey) {
              let existingMatchedEvent: SportBookEventStructured | undefined = tempResultSum.result.events.get(newEvent.eventKey);

              if (existingMatchedEvent) {
                let currentMarkets = existingMatchedEvent.markets;
                let updatedEvent: SportBookEventStructured = { ...existingMatchedEvent, ...newEvent };

                this.setDeltaChannels(newEvent, existingMatchedEvent, updatedEvent);
                this.setDeltaFlags(newEvent, existingMatchedEvent, updatedEvent);

                updatedEvent.markets = this.setSelectionBasedOnEventStatus(currentMarkets, updatedEvent, needSuspendedFilter, removeSuspendedSelection);
                if (updatedEvent.eventKey)
                  tempResultSum.result.events.set(updatedEvent.eventKey, updatedEvent);
              } else {
                tempResultSum.result.events.set(newEvent.eventKey, newEvent);
              }
            }
          }
          else if (newTempResult.newItem instanceof SportBookMarketStructured) {
            // Market
            let newMarket: SportBookMarketStructured = newTempResult.newItem;
            if (newMarket && newMarket.eventKey) {
              let marketEvent: SportBookEventStructured | undefined = tempResultSum.result.events.get(newMarket.eventKey);

              if (!marketEvent) {
                throw `Couldn't find event with id ${newMarket.eventKey}`;
              }

              if (newMarket.marketKey) {
                let existingMatchedMarket: SportBookMarketStructured | undefined = marketEvent.markets.get(newMarket.marketKey);

                if (existingMatchedMarket) {
                  const currentSelections = existingMatchedMarket.selections
                  let updatedMarket: SportBookMarketStructured = { ...existingMatchedMarket, ...newMarket };

                  this.setDeltaChannels(newMarket, existingMatchedMarket, updatedMarket);
                  this.setNCastDividends(newMarket, existingMatchedMarket, updatedMarket);

                  updatedMarket.selections = this.setSelectionBasedOnMarketStatus(currentSelections, marketEvent, updatedMarket, needSuspendedFilter, removeSuspendedSelection);
                  if (updatedMarket.marketKey)
                    marketEvent.markets.set(updatedMarket.marketKey, updatedMarket);
                } else {
                  marketEvent.markets.set(newMarket.marketKey, newMarket);
                }
              }

            }

          }
          else if (newTempResult.newItem instanceof SportBookSelection) {
            // Selection
            let newSelection: SportBookSelection | null = newTempResult.newItem;
            if (newSelection && newSelection.eventKey) {
              let selectionEvent: SportBookEventStructured | undefined = tempResultSum.result.events.get(newSelection.eventKey);

              if (!selectionEvent) {
                throw `Couldn't find event with id ${newSelection.eventKey}`;
              }

              if (newSelection.marketKey) {
                let selectionMarket: SportBookMarketStructured | undefined = selectionEvent.markets.get(newSelection.marketKey);

                if (!selectionMarket) {
                  throw `Couldn't find market with id ${newSelection.marketKey}`;
                }

                if (newSelection.selectionKey) {
                  let existingMatchedSelection: SportBookSelection | undefined = selectionMarket.selections.get(newSelection.selectionKey)

                  if (existingMatchedSelection) {
                    let updatedSelection: SportBookSelection | null = { ...existingMatchedSelection, ...newSelection };

                    this.setDeltaPriceChange(newSelection, existingMatchedSelection, updatedSelection);
                    this.setDeltaChannels(newSelection, existingMatchedSelection, updatedSelection);

                    updatedSelection = this.setSelectionBasedOnSelectionStatus(updatedSelection, selectionEvent, selectionMarket, needSuspendedFilter, removeSuspendedSelection)

                    if (updatedSelection && updatedSelection.selectionKey)
                      selectionMarket.selections.set(updatedSelection.selectionKey, updatedSelection);

                  } else {

                    newSelection = this.setSelectionBasedOnSelectionStatus(newSelection, selectionEvent, selectionMarket, needSuspendedFilter, removeSuspendedSelection)

                    if (newSelection && newSelection.selectionKey)
                      selectionMarket.selections.set(newSelection.selectionKey, newSelection);
                  }
                }

              }

            }

          }
          else if (tempResultSum && !tempResultSum.isFinished) {
            tempResultSum.isFinished = newTempResult.isFinished;
          }

          return tempResultSum;
        }, new SportBookTempResult()),
        map((sportBookResult: SportBookTempResult) => {
          return sportBookResult
        })
      );
  }




  constructor(
    private eventSourceDataFeedService: EventSourceDataFeedService,
  ) { }



  setSelectionBasedOnEventStatus(markets: Map<number, SportBookMarketStructured>, event: SportBookEventStructured, needSuspendedFilter: boolean, removeSuspendedSelection: boolean) {
    markets.forEach((market: SportBookMarketStructured, key: Number) => {
      market.selections = this.setSelectionBasedOnMarketStatus(market.selections, event, market, needSuspendedFilter, removeSuspendedSelection);
    });
    return markets;
  }

  setSelectionBasedOnMarketStatus(selections: Map<number, SportBookSelection>, event: SportBookEventStructured, market: SportBookMarketStructured, needSuspendedFilter: boolean, removeSuspendedSelection: boolean) {
    let finalSelection = new Map<number, SportBookSelection>();
    selections.forEach((selection: SportBookSelection, key: Number) => {
      let modifiedSelection = this.setSelectionBasedOnSelectionStatus(selection, event, market, needSuspendedFilter, removeSuspendedSelection);
      if (modifiedSelection && modifiedSelection.selectionKey)
        finalSelection.set(modifiedSelection.selectionKey, modifiedSelection);
    });
    return finalSelection;
  }

  setSelectionBasedOnSelectionStatus(selection: SportBookSelection, event: SportBookEventStructured, market: SportBookMarketStructured, needSuspendedFilter: boolean, removeSuspendedSelection: boolean) {
    if (!!selection?.prices?.price) {
      selection.prices.price = selection?.prices?.price?.filter((item: any) => !PriceType.startPrice.includes(item?.selectionPriceType));
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
      (market?.marketStatus?.toUpperCase() == MarketStatus.Suspended) ||
      selection.selectionStatus?.toUpperCase() == SelectionStatus.Suspended)

    return selection;
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
        var indexDividendToRemove = updatedMarket.nCastDividends.findIndex((nCastDividend: any) => this.shallowCompare(nCastDividend, nCastDividendToDelete));

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
    return null;
  }

}
