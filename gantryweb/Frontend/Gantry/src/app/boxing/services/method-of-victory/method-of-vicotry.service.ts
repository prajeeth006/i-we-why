import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { BoxingDataContent } from '../../models/boxing-content.model';
import { BetDetails, BoxingTemplateContent, MatchDataList } from '../../models/boxing-template.model';

@Injectable({
  providedIn: 'root'
})
export class MethodOfVicotryService {

  setMethodOfVictory(marketName: string, boxingTemplateResult: BoxingTemplateContent, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } }): BoxingTemplateContent {
    let selection = selections[marketName];
    for (let selectionName in selection) {
      let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
      let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
      this.setMethodOfVictoryPanel(teamDetail, boxingTemplateResult);
    }
    if (boxingTemplateResult.methodOfVictoryInfoPanel) {
      if (boxingTemplateResult.methodOfVictoryInfoPanel.homeTeamListDetails.length > 1) {
        boxingTemplateResult.methodOfVictoryInfoPanel.homeTeamListDetails.sort(function (a, b) {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        });
      }
      if (boxingTemplateResult.methodOfVictoryInfoPanel.awayTeamListDetails.length > 1) {
        boxingTemplateResult.methodOfVictoryInfoPanel.awayTeamListDetails.sort(function (a, b) {
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return 0;
        });
      }
    }
    boxingTemplateResult.methodOfVictoryInfoPanel.marketName = marketName;
    return boxingTemplateResult;
  }

  setMethodOfVictoryPanel(teamDetail: BetDetails, boxingTemplateResult: BoxingTemplateContent) {
    if (!boxingTemplateResult.methodOfVictoryInfoPanel) {
      boxingTemplateResult.methodOfVictoryInfoPanel = new MatchDataList();
    }
    if (!!teamDetail && boxingTemplateResult?.homeFighterTitle && boxingTemplateResult?.awayFighterTitle) {
      let selectionTeam: string[];
      if (teamDetail.betName.toUpperCase().indexOf(boxingTemplateResult.homeFighterTitle.toUpperCase()) > -1) {
        selectionTeam = teamDetail.betName.toUpperCase().split(boxingTemplateResult.homeFighterTitle.toUpperCase() + " -");
        if (selectionTeam.length > 1) {
          teamDetail.betName = this.setBetTitle(selectionTeam[1].trim(), boxingTemplateResult.boxingDataContent);
          boxingTemplateResult.methodOfVictoryInfoPanel.homeTeamListDetails.push(teamDetail);
        }
      } else {
        selectionTeam = teamDetail.betName.toUpperCase().split(boxingTemplateResult?.awayFighterTitle.toUpperCase() + " -");
        if (selectionTeam.length > 1) {
          teamDetail.betName = this.setBetTitle(selectionTeam[1].trim(), boxingTemplateResult.boxingDataContent);
          boxingTemplateResult.methodOfVictoryInfoPanel.awayTeamListDetails.push(teamDetail);
        }
      }
    }
  }

  setBetTitle(betName: string, boxingData: BoxingDataContent) {
    let byDecision = boxingData.contentParameters.ByDecisionorTechnicalDecision?.split('|');
    let koOrTko = boxingData.contentParameters.KOorTKOorDisqualification?.split('|');
    if (byDecision.find(key => key.toUpperCase() === betName?.toUpperCase()) != undefined) {
      betName = byDecision[0]
    } else if (koOrTko.find(key => key.toUpperCase() === betName?.toUpperCase()) != undefined) {
      betName = koOrTko[0]
    }
    return betName;
  }


  constructor() { }
}
