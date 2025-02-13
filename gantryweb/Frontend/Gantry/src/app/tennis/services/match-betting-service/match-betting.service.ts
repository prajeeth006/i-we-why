import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookMarketStructured } from 'src/app/common/models/data-feed/sport-bet-models';
import { TennisContent } from '../../models/tennis.model';

@Injectable({
  providedIn: 'root'
})
export class MatchBettingService {

  getMatchBettingDetails(market: SportBookMarketStructured, tennisContent: TennisContent) {
    for (let [, selection] of market.selections) {
      if (selection.outcomeMeaningMinorCode == 'H') {
        let betPrice = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
        tennisContent.homePlayerBet = betPrice;
        tennisContent.homePlayer = selection.selectionName;
        tennisContent.ishideEntry = selection.hideEntry;
      }
      if (selection.outcomeMeaningMinorCode == 'A') {
        let betPrice = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
        tennisContent.awayPlayerBet = betPrice;
        tennisContent.awayPlayer = selection.selectionName;
        tennisContent.ishideEntry = selection.hideEntry;
      }
    }
    return tennisContent;
  }

  constructor() { }
}
