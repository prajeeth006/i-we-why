import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookMarketStructured, SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { OutCome } from 'src/app/foot-ball/models/football.enum';
import { BetDetails, Market, MarketResult } from 'src/app/foot-ball/models/football.model';
import { SportBookSelectionHelper } from '../../../../common/helpers/sport-book-selection-helper';

@Injectable({
  providedIn: 'root'
})
export class NflMarketService {

  prepareFirstTouchdownScorer(selection: SportBookSelection, teamDetail: BetDetails, market: Market) {

    teamDetail.order = SportBookSelectionHelper.getRecentCalculatedPrice(selection);
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Home) {
      market.rightBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Away) {
      market.leftBetList.push(teamDetail);
    }

    market.leftBetList.sort(function (a, b) {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
    market.leftBetList = market.leftBetList.slice(0, 4);

    market.rightBetList.sort(function (a, b) {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
    market.rightBetList = market.rightBetList.slice(0, 4);

    return market;
  }

  prepareHandicapBetting(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: SportBookMarketStructured) {
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Home) {
      let handicapVal = sportBookMarket.handicapValue;
      let teamValue = ((handicapVal > 0) ? ("+") + handicapVal : handicapVal)
      teamDetail.betName = StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail.betName, SelectionNameLength.Seventeen) + " " + teamValue;
      market.rightBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Away) {
      let handicapVal = -(sportBookMarket.handicapValue);
      let teamValue = ((handicapVal > 0) ? ("+") + handicapVal : handicapVal)
      teamDetail.betName = StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail.betName, SelectionNameLength.Seventeen) + " " + teamValue;
      market.leftBetList.push(teamDetail);
    }
    if (selection?.selectionName.trim().toUpperCase() == OutCome.Tie) {
      let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection));
      market.tieTitle = new BetDetails(OutCome.Tie, odds);
    }
    return market;
  }

  prepareMoneyLine(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: MarketResult) {
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Home) {
      sportBookMarket.homeTeamTitle = selection.selectionName;
      market.rightBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Away) {
      sportBookMarket.awayTeamTitle = selection.selectionName;
      market.leftBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Draw) {
      market.drawBetList.push(teamDetail);
    }
    return market;
  }

  prepareWinningMargin(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: MarketResult) {
    if (selection?.selectionName?.indexOf(sportBookMarket?.homeTeamTitle) >= 0) {
      let teamName = StringHelper?.checkSelectionNameLengthAndTrimEnd(sportBookMarket.homeTeamTitle, SelectionNameLength.Seventeen);
      teamDetail = this.updateTeamDetails(selection, teamDetail, market, teamName);
      market.rightBetList.push(teamDetail);

    } else if (selection?.selectionName?.indexOf(sportBookMarket?.awayTeamTitle) >= 0) {
      let teamName = StringHelper?.checkSelectionNameLengthAndTrimEnd(sportBookMarket.awayTeamTitle, SelectionNameLength.Seventeen);
      teamDetail = this.updateTeamDetails(selection, teamDetail, market, teamName);
      market.leftBetList.push(teamDetail);
    }
    market.rightBetList?.sort((a, b) => a.betName?.localeCompare(b.betName, undefined, { numeric: true, sensitivity: 'base' }));
    market.leftBetList?.sort((a, b) => a.betName?.localeCompare(b.betName, undefined, { numeric: true, sensitivity: 'base' }));
    return market;
  }

  updateTeamDetails(selection: SportBookSelection, teamDetail: BetDetails, market: Market, teamName: string): BetDetails {
    let teamSelectionItems = selection?.selectionName?.replace(/\s/g, ""); //Remove all spaces from SelectonName
    //Ex: "selectionName":"Toulon 11-20"
    //Res: "Toulon11-20"
    let selectScoreNumber = teamSelectionItems?.trim()?.substr(teamSelectionItems.length - 5); //We take last 5 characters from teamSelectionItems
    //Ex: "Toulon11-20"
    //Res:11-20
    let scoreNumber = selectScoreNumber?.trim()?.replace(/[^-+\d]/g, '');  //Remove alphabets from selectScoreNumber
    //Ex: "ON11-20"
    //Res:11-20
    teamDetail.betName = teamName + " " + scoreNumber;
    //Final Response :Toulon 11-20
    return teamDetail;
  }

  prepareTotalMatchPoints(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: SportBookMarketStructured) {
    if (selection?.outcomeMeaningMinorCode?.trim()?.toUpperCase() == OutCome.Low) {
      teamDetail.betName = sportBookMarket?.handicapValue > 0 ? StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen)
        + "  " + sportBookMarket?.handicapValue : StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen);
      market.rightBetList.push(teamDetail);
    }
    else if (selection?.outcomeMeaningMinorCode?.trim()?.toUpperCase() == OutCome.Home) {
      teamDetail.betName = sportBookMarket?.handicapValue > 0 ? StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen)
        + "  " + sportBookMarket?.handicapValue : StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen);
      market.leftBetList.push(teamDetail);
    }
    else if (selection?.outcomeMeaningMinorCode?.trim()?.toUpperCase() == OutCome.Away) {
      teamDetail.betName = sportBookMarket?.handicapValue > 0 ? StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen)
        + "  " + sportBookMarket?.handicapValue : StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen);
      market.leftBetList.push(teamDetail);
    }
    return market;
  }


  constructor() { }
}
