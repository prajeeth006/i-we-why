import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { BetDetails, BoxingTemplateContent, MatchDataList } from '../../models/boxing-template.model';

@Injectable({
  providedIn: 'root'
})

export class RoundBettingService {

  constructor() { }

  setRoundDetails(marketName: string, boxingTemplateResult: BoxingTemplateContent, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
    : BoxingTemplateContent {
    let selection = selections[marketName];
    for (let selectionName in selection) {
      let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
      let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
      this.setRoundPanelDetails(teamDetail, boxingTemplateResult);
    }

    if (boxingTemplateResult.roundBettingInfoPanel) {
      if (boxingTemplateResult.roundBettingInfoPanel.homeTeamListDetails.length > 1) {
        boxingTemplateResult.roundBettingInfoPanel.homeTeamListDetails.sort(function (a, b) {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        });
      }

      if (boxingTemplateResult.roundBettingInfoPanel.awayTeamListDetails.length > 1) {
        boxingTemplateResult.roundBettingInfoPanel.awayTeamListDetails.sort(function (a, b) {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        });
      }
    }

    if (boxingTemplateResult.roundBettingInfoPanel)
      boxingTemplateResult.roundBettingInfoPanel.marketName = marketName;
    return boxingTemplateResult;
  }

  setRoundPanelDetails(teamDetail: BetDetails, boxingTemplateResult: BoxingTemplateContent) {
    if (!boxingTemplateResult.roundBettingInfoPanel) {
      boxingTemplateResult.roundBettingInfoPanel = new MatchDataList();
    }

    if (!!teamDetail && boxingTemplateResult?.homeFighterTitle && boxingTemplateResult?.awayFighterTitle) {
      let selectionTeam: string[];
      if (teamDetail.betName.toUpperCase().indexOf(boxingTemplateResult.homeFighterTitle.toUpperCase()) > -1) {
        selectionTeam = teamDetail.betName.toUpperCase().split(boxingTemplateResult.homeFighterTitle.toUpperCase() + " -");
        if (selectionTeam.length > 1) {
          teamDetail.betName = selectionTeam[1].trim();
          teamDetail.order = this.setOrder(teamDetail.betName);
          boxingTemplateResult.roundBettingInfoPanel.homeTeamListDetails.push(teamDetail);
        }
      } else {
        selectionTeam = teamDetail.betName.toUpperCase().split(boxingTemplateResult?.awayFighterTitle.toUpperCase() + " -");
        if (selectionTeam.length > 1) {
          teamDetail.betName = selectionTeam[1].trim();
          teamDetail.order = this.setOrder(teamDetail.betName);
          boxingTemplateResult.roundBettingInfoPanel.awayTeamListDetails.push(teamDetail);
        }
      }
    }

  }

  setOrder(betName: string): number {
    let selectionTeam = betName.split(" ");
    let order: number = 10;
    switch (selectionTeam[selectionTeam.length - 1]) {
      case "1":
        order = 1;
        break;
      case "2":
        order = 2;
        break;
      case "3":
        order = 3;
        break;
      case "4":
        order = 4;
        break;
      case "5":
        order = 5;
        break;
      case "6":
        order = 6;
        break;
    }
    return order;
  }
}
