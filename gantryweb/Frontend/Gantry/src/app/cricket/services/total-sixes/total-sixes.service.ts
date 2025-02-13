import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookMarketStructured, SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { CricketSelection } from '../../models/cricket-template.enum';
import { BetDetails, CricketTemplateResult, MatchData } from '../../models/cricket-template.model';

@Injectable({
  providedIn: 'root'
})
export class TotalSixesService {

  constructor() { }

  setTotalSixes(marketName: string, market: SportBookMarketStructured, cricketTemplateResult: CricketTemplateResult, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } }) {

    if (!!marketName && marketName == market?.marketName) {
      if (!cricketTemplateResult.totalSixes)
        cricketTemplateResult.totalSixes = new MatchData();

      let selection = selections[marketName];
      for (let selectionName in selection) {
        let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
        let playerDetails = new BetDetails(StringHelper.checkSelectionNameLengthAndTrimEnd(selectionName, SelectionNameLength.Seventeen), odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
        playerDetails.betName += " " + market?.handicapValue;
        if (selectionName?.toUpperCase() == CricketSelection.Over)
          cricketTemplateResult.totalSixes.homeTeamDetails = playerDetails;
        else if (selectionName?.toUpperCase() == CricketSelection.Under)
          cricketTemplateResult.totalSixes.awayTeamDetails = playerDetails;

      }
    }

  }
}
