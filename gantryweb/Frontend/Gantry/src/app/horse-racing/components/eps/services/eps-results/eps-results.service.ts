import { Injectable } from '@angular/core';
import { concatMap, map, scan, shareReplay } from 'rxjs';
import { ResultingContent } from 'src/app/common/models/data-feed/meeting-results.model';
import { SportBookEventStructured, SportBookMarketStructured, SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { SportBookService } from 'src/app/common/services/data-feed/sport-book.service';
import { EventFeedUrlService } from 'src/app/common/services/event-feed-url.service';
import { EventSourceDataFeedService } from 'src/app/common/services/event-source-data-feed.service';
import { EpsTempResult, SportBookEPSEventStructured } from '../data-feed/eps-models';
import { WindowHelper } from 'src/app/common/helpers/window-helper/window-helper';

@Injectable({
  providedIn: 'root'
})
export class EpsResultsService {

  constructor(
    private eventFeedUrlService: EventFeedUrlService,
    private eventSourceDataFeedService: EventSourceDataFeedService,
    private sportBookService: SportBookService,
    private _windowHelper: WindowHelper,
  ) { }

  data$ = this.eventFeedUrlService.eventFeedApiUrls$
  .pipe(
    concatMap((eventFeedApiUrls) => {
      let url = `${eventFeedApiUrls.epsApi}`;

      return this.eventSourceDataFeedService.getServerSentEvent(url, true, eventFeedApiUrls.snapShotDataTimeOut)
      .pipe(dataString => {
        return dataString.pipe(
            map(dataString => {
                let parsedData = JSON.parse(dataString);
                let tempResult = new EpsTempResult();

                if (parsedData.resultingContent) {
                    let resultingContent: ResultingContent = Object.assign(new ResultingContent, parsedData.resultingContent);
                    tempResult.newItem = resultingContent;
                }
                // else if (parsedData.event) {
                //   let event: SportBookEventStructured = Object.assign(new SportBookEventStructured, parsedData.event);
                //   tempResult.newItem = event;
                // }
                // else if (parsedData.market) {
                //   const market : SportBookMarketStructured = Object.assign(new SportBookMarketStructured, parsedData.market);
                //   tempResult.newItem = market;
                // }
                // else if (parsedData.selection) {
                //   let selection: SportBookSelection = Object.assign(new SportBookSelection, parsedData.selection);
                //   tempResult.newItem = selection;
                // }

                let item = this.sportBookService.getNewItem(parsedData);
                if(item){
                  tempResult.newItem = item;
                }
                return tempResult;
            }
          ))
    }, scan((tempResultSum: EpsTempResult, newTempResult: EpsTempResult) => {
      if(newTempResult.newItem instanceof SportBookEventStructured){
        // Event
        let newEvent : SportBookEventStructured = newTempResult.newItem;
        let existingMatchedEvent : SportBookEPSEventStructured = tempResultSum.result.events.get(newEvent.eventKey);

        if(existingMatchedEvent){
          let currentMarkets = existingMatchedEvent.markets;
          let resultContent  = existingMatchedEvent.resultingContent;
          let updatedEvent : SportBookEPSEventStructured = {...existingMatchedEvent, ... newEvent};

          this.sportBookService.setDeltaChannels(newEvent, existingMatchedEvent, updatedEvent);
          this.sportBookService.setDeltaFlags(newEvent, existingMatchedEvent, updatedEvent);

          updatedEvent.markets = this.sportBookService.setSelectionBasedOnEventStatus(currentMarkets, updatedEvent, true, false, false);
          updatedEvent.resultingContent = resultContent;
          tempResultSum.result.events.set(updatedEvent.eventKey, updatedEvent);
        }else{
          let market = newEvent.markets;
          let epsevent = new SportBookEPSEventStructured();
          let upatedEvent : SportBookEPSEventStructured  = {...epsevent,...newEvent}
          upatedEvent.markets = market;
          tempResultSum.result.events.set(newEvent.eventKey, upatedEvent);
        }
      }
      else if(newTempResult.newItem instanceof SportBookMarketStructured){
        // Market
        let newMarket : SportBookMarketStructured = newTempResult.newItem;
        let marketEvent : SportBookEventStructured = tempResultSum.result.events.get(newMarket.eventKey);

        if(!marketEvent){
          throw `Couldn't find event with id ${newMarket.eventKey}`;
        }

        let existingMatchedMarket : SportBookMarketStructured = marketEvent.markets.get(newMarket.marketKey);

        if(existingMatchedMarket){
          const currentSelections = existingMatchedMarket.selections
          let updatedMarket : SportBookMarketStructured = {...existingMatchedMarket, ...newMarket};

          this.sportBookService.setDeltaChannels(newMarket, existingMatchedMarket, updatedMarket);
          this.sportBookService.setNCastDividends(newMarket, existingMatchedMarket, updatedMarket);

          updatedMarket.selections = this.sportBookService.setSelectionBasedOnMarketStatus(currentSelections, marketEvent, updatedMarket, true, false, false);
          marketEvent.markets.set(updatedMarket.marketKey, updatedMarket);
        }else{
          marketEvent.markets.set(newMarket.marketKey, newMarket);
        }
      }
      else if(newTempResult.newItem instanceof SportBookSelection){
        // Selection
        let newSelection : SportBookSelection = newTempResult.newItem;
        let selectionEvent : SportBookEventStructured = tempResultSum.result.events.get(newSelection.eventKey);

        if(!selectionEvent){
          throw `Couldn't find event with id ${newSelection.eventKey}`;
        }

        let selectionMarket : SportBookMarketStructured = selectionEvent.markets.get(newSelection.marketKey);

        if(!selectionMarket){
          throw `Couldn't find market with id ${newSelection.marketKey}`;
        }

        let existingMatchedSelection : SportBookSelection = selectionMarket.selections.get(newSelection.selectionKey)

        if(existingMatchedSelection){
          let updatedSelection : SportBookSelection = {...existingMatchedSelection, ...newSelection};

          this.sportBookService.setDeltaPriceChange(newSelection, existingMatchedSelection, updatedSelection);
          this.sportBookService.setDeltaChannels(newSelection, existingMatchedSelection, updatedSelection);

          updatedSelection = this.sportBookService.setSelectionBasedOnSelectionStatus(updatedSelection, selectionEvent, selectionMarket, true, false, false)

          if(updatedSelection)
            selectionMarket.selections.set(updatedSelection.selectionKey, updatedSelection);


        }else{
          newSelection = this.sportBookService.setSelectionBasedOnSelectionStatus(newSelection, selectionEvent, selectionMarket, true, false, false)

            if(newSelection)
              selectionMarket.selections.set(newSelection.selectionKey, newSelection);
        }
      }
      else if (newTempResult.newItem instanceof ResultingContent) {
        let newResult : ResultingContent = newTempResult.newItem;
        let resultEvent : SportBookEPSEventStructured = tempResultSum.result.events.get(newResult.eventId);

        if(!resultEvent){
          throw `Couldn't find event with id ${newResult.eventId}`;
        }
        else{
          let market = resultEvent.markets;
          let epsevent = new SportBookEPSEventStructured();
          epsevent.resultingContent = newResult;
          let upatedEvent : SportBookEPSEventStructured  = {...epsevent,...resultEvent}
          upatedEvent.markets = market;
          upatedEvent.resultingContent = newResult;
          //resultEvent.resultingContent = newResult;
          tempResultSum.result.events.set(resultEvent.eventKey, upatedEvent);
        }

      }

      return tempResultSum;
    }, new EpsTempResult()),
        map((epsResult: EpsTempResult) => {
          this._windowHelper.raiseEventToElectron();
          return epsResult.result
        }),
        shareReplay()
    );
  })
)
}
