import { Injectable } from '@angular/core';
import { SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { OutCome } from 'src/app/foot-ball/models/football.enum';
import { BetDetails, Market, MarketResult } from 'src/app/foot-ball/models/football.model';
import { SportBookSelectionHelper } from '../../../../common/helpers/sport-book-selection-helper';

@Injectable({
  providedIn: 'root'
})
export class FootballMarketService {

  prepareMatchResult(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: MarketResult) {
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Home) {
      sportBookMarket.homeTeamTitle = selection.selectionName;
      market.leftBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Away) {
      sportBookMarket.awayTeamTitle = selection.selectionName;
      market.rightBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Draw) {
      market.drawBetList.push(teamDetail);
    }
  }

  prepareCorrectScore(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: MarketResult) {
    let selectionTeam = selection.selectionName.split(" ");
    teamDetail.betName = selectionTeam[selectionTeam.length - 1];

    if (selection.selectionName.indexOf(sportBookMarket.homeTeamTitle) >= 0) {
      market.leftBetList.push(teamDetail);
    } else if (selection.selectionName.indexOf(sportBookMarket.awayTeamTitle) >= 0) {
      market.rightBetList.push(teamDetail)
    } else if (selection.selectionName.indexOf(sportBookMarket.drawTitle) >= 0) {
      market.drawBetList.push(teamDetail)
    
    }


    return market;

  }

  prepareFirstGoalScorer(selection: SportBookSelection, teamDetail: BetDetails, market: Market) {
    teamDetail.order = SportBookSelectionHelper.getRecentCalculatedPrice(selection);

    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Home) {
      market.leftBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Away) {
      market.rightBetList.push(teamDetail);
    }

    market.leftBetList.sort(function (a, b) {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });

    market.rightBetList.sort(function (a, b) {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });

  }

  prepareHalfTimeFullTime(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: MarketResult) {
    teamDetail.order = Number(selection?.outcomeMeaningMinorCode);
    market.allBetList.push(teamDetail);
    market.allBetList.sort(function (a, b) {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
    let selectionSplit = selection?.selectionName?.split('/');
    let selectionName = selectionSplit[0]?.trim() + "/" + selectionSplit[1]?.trim();
    if (selectionName.indexOf(sportBookMarket?.homeTeamTitle + "/" + sportBookMarket?.homeTeamTitle) >= 0) {
      let homeSelections = market?.allBetList[0]?.betName?.split('/');
      teamDetail.betName = homeSelections[0];
      teamDetail.hideEntry = selection.hideEntry;
      market.leftBetList.push(teamDetail);
    }
    else if (selectionName.indexOf(sportBookMarket?.awayTeamTitle + "/" + sportBookMarket?.awayTeamTitle) >= 0) {
      let awaySelections = market?.allBetList[market?.allBetList?.length - 1]?.betName?.split('/');
      teamDetail.betName = awaySelections[0];
      teamDetail.hideEntry = selection.hideEntry;
      market.rightBetList.push(teamDetail)
    }
    market.leftBetList.sort(function (a, b) {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });

    market.rightBetList.sort(function (a, b) {
      if (a.order > b.order) return -1;
      if (a.order < b.order) return 1;
      return 0;
    });

    return market;

  }

  prepareBothTeamsToScore(selection: SportBookSelection, teamDetail: BetDetails, market: Market) {
    teamDetail.order = SportBookSelectionHelper.getRecentCalculatedPrice(selection);

    if (selection.selectionName.trim().toUpperCase() == 'YES') {
      market.leftBetList.push(teamDetail);
    } else if (selection.selectionName.trim().toUpperCase() == 'NO') {
      market.rightBetList.push(teamDetail);
    }

    return market;
  }


  prepareTotalGloasInTheMatch(marketName: string, handicapValue: number, selection: SportBookSelection, teamDetail: BetDetails, market: Market) {
    teamDetail.order = SportBookSelectionHelper.getRecentCalculatedPrice(selection);


    if (selection.selectionName.trim().toUpperCase() == 'OVER') {
      teamDetail.betName = handicapValue?.toString();
      market.leftBetList.push(teamDetail);
    } else if (selection.selectionName.trim().toUpperCase() == 'UNDER') {
      teamDetail.betName = handicapValue?.toString();
      market.rightBetList.push(teamDetail);
    }

    return market;
  }


  prepareMatchResultBothTeamsToScore(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: MarketResult) {
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Home) {
      market.leftBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Away) {
      market.rightBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == OutCome.Draw) {
      market.drawBetList.push(teamDetail);
    }
  }

  constructor() { }

}
