import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { BetDetails, BoxingTemplateContent, MatchDataList } from '../../models/boxing-template.model';

@Injectable({
  providedIn: 'root'
})
export class GroupRoundBettingService {

  constructor() { }

  setGroupRoundDetails(marketName: string, boxingTemplateResult: BoxingTemplateContent, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } }): BoxingTemplateContent {
    let selection = selections[marketName];
    for (let selectionName in selection) {
      let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
      let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
      this.setGrpRoundPanelDetails(teamDetail, boxingTemplateResult);
    }
    if (boxingTemplateResult.groupRoundBettingInfoPanel) {
      if (boxingTemplateResult.groupRoundBettingInfoPanel.homeTeamListDetails.length > 1) {
        boxingTemplateResult.groupRoundBettingInfoPanel.homeTeamListDetails.sort(function (a, b) {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        });
      }
      if (boxingTemplateResult.groupRoundBettingInfoPanel.awayTeamListDetails.length > 1) {
        boxingTemplateResult.groupRoundBettingInfoPanel.awayTeamListDetails.sort(function (a, b) {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        });
      }
    }

    if (boxingTemplateResult.groupRoundBettingInfoPanel)
      boxingTemplateResult.groupRoundBettingInfoPanel.marketName = marketName;
    return boxingTemplateResult;
  }

  setGrpRoundPanelDetails(teamDetail: BetDetails, boxingTemplateResult: BoxingTemplateContent) {
    if (!boxingTemplateResult.groupRoundBettingInfoPanel) {
      boxingTemplateResult.groupRoundBettingInfoPanel = new MatchDataList();
    }
    if (!!teamDetail && boxingTemplateResult?.homeFighterTitle && boxingTemplateResult?.awayFighterTitle) {
      let selectionTeam: string[];
      if (teamDetail.betName.toUpperCase().indexOf(boxingTemplateResult.homeFighterTitle.toUpperCase()) > -1) {
        selectionTeam = teamDetail.betName.toUpperCase().split(boxingTemplateResult.homeFighterTitle.toUpperCase() + " -");
        if (selectionTeam.length > 1) {
          teamDetail.betName = selectionTeam[1].trim();
          teamDetail.order = this.setOrder(teamDetail.betName);
          boxingTemplateResult.groupRoundBettingInfoPanel.homeTeamListDetails.push(teamDetail);
        }
      } else {
        selectionTeam = teamDetail.betName.toUpperCase().split(boxingTemplateResult?.awayFighterTitle.toUpperCase() + " -");
        if (selectionTeam.length > 1) {
          teamDetail.betName = selectionTeam[1].trim();
          teamDetail.order = this.setOrder(teamDetail.betName);
          boxingTemplateResult.groupRoundBettingInfoPanel.awayTeamListDetails.push(teamDetail);
        }
      }
    }
  }

  setOrder(betName: string): number {
    let selectionTeam = betName.split(" ");
    let order: number = 6;
    switch (selectionTeam[selectionTeam.length - 1]) {
      case "1-3":
        order = 1;
        break;
      case "4-6":
        order = 2;
        break;
      case "7-9":
        order = 3;
        break;
      case "10-12":
        order = 4;
        break;
    }
    return order;
  }

}
