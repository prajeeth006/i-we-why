import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookMarketStructured } from 'src/app/common/models/data-feed/sport-bet-models';
import { TennisContent, TennisSet } from '../../models/tennis.model';

@Injectable({
  providedIn: 'root'
})
export class SetBettingService {

  setBettingDetails(market: SportBookMarketStructured, tennisContent: TennisContent) {
    for (let [, selection] of market.selections) {
      if (selection.selectionName.includes(tennisContent.homePlayer)) {
        let setName = selection.selectionName.replace(tennisContent.homePlayer, '')?.trim();
        let bet = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
        let set = tennisContent?.sets?.has(setName) ? tennisContent?.sets?.get(setName) : new TennisSet;
        set.homePlayerBet = selection?.hidePrice ? " " : bet;
        set.isHomeHideEntry = selection.hidePrice;
        set.ishideEntry = selection.hideEntry;
        tennisContent.isSetScore = true;
        tennisContent.sets.set(setName, set);
      }
      else if (selection.selectionName.includes(tennisContent.awayPlayer)) {
        let setName = selection.selectionName.replace(tennisContent.awayPlayer, '')?.trim();
        let bet = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
        let set = tennisContent?.sets?.has(setName) ? tennisContent?.sets?.get(setName) : new TennisSet;
        set.awayPlayerBet = selection?.hidePrice ? " " : bet;
        set.isAwayHideEntry = selection.hidePrice;
        set.ishideEntry = selection.hideEntry;
        tennisContent.isSetScore = true;
        tennisContent.sets.set(setName, set);
      }
    }

    return tennisContent;
  }

  constructor() { }
}
