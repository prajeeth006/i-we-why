import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { CricketSelection } from '../../models/cricket-template.enum';
import { BetDetails, CricketTemplateResult } from '../../models/cricket-template.model';

@Injectable({
  providedIn: 'root'
})
export class Toscore100In1stInnsService {

  constructor() { }

  setScore100In1stInning(marketName: string, cricketTemplateResult: CricketTemplateResult, topRunScorerMarket: Array<BetDetails>, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } }) {
    let selection = selections[marketName];
    for (let selectionName in selection) {
      if (selectionName?.toUpperCase() == CricketSelection.Yes) {
        let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
        let [, ...selectionTitle] = marketName?.split('-');
        let playerDetails = new BetDetails(StringHelper.checkSelectionNameLengthAndTrimEnd(selectionTitle?.length > 0 ? selectionTitle.join('-')?.trim() : marketName, SelectionNameLength.Seventeen), odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
        topRunScorerMarket.push(playerDetails);
      }
    }

    this.sortRunScorerList(topRunScorerMarket);

    return topRunScorerMarket;
  }

  private sortRunScorerList(topRunScorerList: Array<BetDetails>) {
    if (topRunScorerList?.length > 1) {
      topRunScorerList.sort(
        function (first, second) {
          let firstNumber = Toscore100In1stInnsService.getPriceFromOdds(first?.betOdds);
          let secondNumber = Toscore100In1stInnsService.getPriceFromOdds(second?.betOdds);
          return firstNumber - secondNumber;
        }
      );
    }
    return topRunScorerList;
  }

  private static getPriceFromOdds(odds: string): number {
    if (!odds) {
      return 0;
    }
    else {
      let price = odds.trim().split('/');
      if (price.length > 1) {
        let ratio = Number(price[0]) / Number(price[1]);
        return ratio;
      }
      return Number(odds);
    }
  }
}
