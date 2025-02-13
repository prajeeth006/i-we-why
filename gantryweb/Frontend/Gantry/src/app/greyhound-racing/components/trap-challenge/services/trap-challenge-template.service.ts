import { Injectable } from '@angular/core';
import { SportBookEventHelper } from 'src/app/common/helpers/sport-book-event.helper';
import { SportBookResult } from 'src/app/common/models/data-feed/sport-bet-models';
import { GreyhoundStaticContent, TrapChallengeEvent, TrapChallengeEventSelection, TrapChallengeResult } from 'src/app/greyhound-racing/models/trap-challenge.model';

@Injectable({
  providedIn: 'root'
})
export class TrapChallengeTemplateService {

  constructor() { }

  prepareResult(sportBookResult: SportBookResult, greyHoundData: GreyhoundStaticContent) {
    let result = new TrapChallengeResult();
    if(!sportBookResult || sportBookResult?.events?.size <= 0)
      return result;

    let sportBookEvents = [...sportBookResult.events.values()];
    sportBookEvents.forEach(sportBookEvent => SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(sportBookEvent));

    let [firstEvent] = sportBookResult.events.values();
    const [firstMarket] = firstEvent.markets?.values();
    result.gantryCommonContent = greyHoundData;

    result.categoryName = firstEvent?.categoryName;
    result.marketTitle = sportBookResult?.events?.size > 1 ? greyHoundData.contentParameters.TrapChallenges : firstMarket?.marketName;

    result.events = [...sportBookResult.events.values()].map(sportBookEvent => {
      let trapChallengeEvent = new TrapChallengeEvent();
      trapChallengeEvent.name = sportBookEvent?.eventName?.toUpperCase().split("TRAP CHALLENGE")[0];
      trapChallengeEvent.eventDateTime = sportBookEvent.eventDateTime;
      let [eventFirstMarket] = [...sportBookEvent.markets.values()];
      trapChallengeEvent.selections = [...eventFirstMarket?.selections?.values() ?? []].map(selection => {
        if (selection?.hideEntry)
          return null;
        let trapChallengeEventSelection = new TrapChallengeEventSelection();
        trapChallengeEventSelection.name = selection?.selectionName;
        const imageItemNo = parseInt(selection?.selectionName.replace(/\D/g, ""));
        trapChallengeEventSelection.trapImage = this.trapChallengeTrapImage(imageItemNo, greyHoundData);
        trapChallengeEventSelection.runnerNumber = imageItemNo;
        trapChallengeEventSelection.price = !selection?.hidePrice && selection.prices?.price[0] ?
          selection.prices?.price[0]?.denPrice == 1 ? selection?.prices?.price[0]?.numPrice?.toString() :
            selection?.prices?.price[0]?.numPrice + "/" + selection.prices?.price[0]?.denPrice : ' ';
        trapChallengeEventSelection.hidePrice = selection?.hidePrice;
        trapChallengeEventSelection.hideEntry = selection?.hideEntry;
        return trapChallengeEventSelection;
      })?.filter(x => x !== null)
      trapChallengeEvent.selections = trapChallengeEvent.selections.sort((a, b) => { return a.runnerNumber - b.runnerNumber });
      return trapChallengeEvent;
    });

    result.events = this.sortByEventNameAndEventDateArray(result.events, [{ key: 'eventDateTime' }, { key: 'name' }])
    return result;
  }

  private trapChallengeTrapImage(imageItemNo: number, imageData: GreyhoundStaticContent) {
    if (imageData?.greyHoundImages?.runnerImages?.length >= imageItemNo) {
      return imageData?.greyHoundImages?.runnerImages[imageItemNo - 1]?.src;
    } else {
      return "";
    }
  }

  private sortByEventNameAndEventDateArray(array: TrapChallengeEvent[], options: any) {
    if (!Array.isArray(options)) {
      options = [{ key: options, order: 'asc' }];
    }

    options.forEach((item: any) => {
      item.multiplier = item.order != 'desc' ? -1 : 1;
    });

    return array.sort((firstItem: TrapChallengeEvent, secondItem: TrapChallengeEvent) => {
      for (let item of options) {
        const { key, multiplier } = item;

        const firstValue = firstItem[key];
        const secondValue = secondItem[key];

        if (firstValue != secondValue) {
          return multiplier * (firstValue < secondValue ? 1 : -1);
        }
      }
      return 0;
    });
  }

}
