import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { BetDetails, DartTemplateContent, MatchDataList } from '../../models/dart-template.model';

@Injectable({
  providedIn: 'root'
})
export class MatchCorrectScoreService {
  setCorrectScore(marketName: string, dartTemplateResult: DartTemplateContent, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
    : DartTemplateContent {
    let selection = selections[marketName];
    dartTemplateResult.correctScoreBettingInfoPanel = new MatchDataList();
    for (let selectionName in selection) {
      let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
      let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
      this.setCorrectScorePanelDetails(teamDetail, dartTemplateResult);
    }
    dartTemplateResult.correctScoreBettingInfoPanel.marketName = marketName;
    if (dartTemplateResult.correctScoreBettingInfoPanel) {
      if (dartTemplateResult.correctScoreBettingInfoPanel.homeTeamListDetails.length > 1) {
        dartTemplateResult.correctScoreBettingInfoPanel.homeTeamListDetails = dartTemplateResult.correctScoreBettingInfoPanel.homeTeamListDetails;
      }
      if (dartTemplateResult.correctScoreBettingInfoPanel.awayTeamListDetails.length > 1) {
        dartTemplateResult.correctScoreBettingInfoPanel.awayTeamListDetails = dartTemplateResult.correctScoreBettingInfoPanel.awayTeamListDetails;
      }
    }
    return dartTemplateResult;
  }

  setCorrectScorePanelDetails(teamDetail: BetDetails, dartTemplateResult: DartTemplateContent) {

    if (teamDetail.betName?.indexOf(dartTemplateResult?.homePlayerTitle) >= 0) {
      teamDetail = this.updateTeamDetails(teamDetail);
      dartTemplateResult.correctScoreBettingInfoPanel.homeTeamListDetails.push(teamDetail);

    } else if (teamDetail?.betName?.indexOf(dartTemplateResult?.awayPlayerTitle) >= 0) {
      teamDetail = this.updateTeamDetails(teamDetail);
      dartTemplateResult.correctScoreBettingInfoPanel.awayTeamListDetails.push(teamDetail);
    }

  }

  updateTeamDetails(teamDetail: BetDetails): BetDetails {
    let teamSelectionItems = teamDetail?.betName?.replace(/\s/g, ""); //Remove all spaces from SelectonName
    //Ex: "selectionName":"Beau Anderson 6-7"
    //Res: "BeauAnderson6-7"
    let selectScoreNumber = teamSelectionItems?.trim()?.substr(teamSelectionItems.length - 5); //We take last 5 characters from teamSelectionItems
    //Ex: "BeauAnderson6-7"
    //Res:6-7
    let scoreNumber = selectScoreNumber?.trim()?.replace(/[^-+\d]/g, '');  //Remove alphabets from selectScoreNumber
    //Ex: "ON6-7"
    //Res:6-7
    // teamDetail.betName = teamName + " " + scoreNumber;
    teamDetail.betName = scoreNumber;
    //Final Response :Beau Anderson 6-7
    return teamDetail;
  }

}