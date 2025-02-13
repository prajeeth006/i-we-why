import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { AdvantageType, Result } from '../../models/dart-constants.model';
import { BetDetails, DartTemplateContent, MatchData } from '../../models/dart-template.model';

@Injectable({
  providedIn: 'root'
})
export class MatchBettingService {

  setMatchDetails(marketName: string, dartTemplateResult: DartTemplateContent, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } }, isMatchBetting: boolean)
    : MatchData {
    let selection = selections[marketName];
    var teams = new MatchData();
    for (let selectionName in selection) {
      let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
      let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
      if (isMatchBetting) {
        teams = this.setHomeDrawOrAwayDetails(selection[selectionName].outcomeMeaningMinorCode, teamDetail, teams, dartTemplateResult, isMatchBetting);
      }
      else {
        teams = this.setHomeDrawOrAwayDetails(selection[selectionName].outcomeMeaningMinorCode, teamDetail, teams, dartTemplateResult, isMatchBetting);
      }
    }
    return teams;
  }

  setHomeDrawOrAwayDetails(code: string, teamDetail: BetDetails, teams: MatchData, dartTemplateResult: DartTemplateContent, isMatchBetting: boolean): MatchData {
    if (!!code) {
      if (code.trim().toUpperCase() == AdvantageType.Low) {
        teamDetail.betName = dartTemplateResult?.handicapValue > 0 ? StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen) + "  " + dartTemplateResult?.handicapValue : StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen);
        teams.homeTeamDetails = teamDetail;
      }
      else if (code.trim().toUpperCase() == AdvantageType.Home) {
        if (isMatchBetting) {
          if (!dartTemplateResult?.handicapValue) {
            dartTemplateResult.homePlayerTitle = teamDetail?.betName;
          }
          let teamValue = (dartTemplateResult?.handicapValue > 0) ? ("+") + dartTemplateResult?.handicapValue : dartTemplateResult?.handicapValue;
          teamDetail.betName = teamValue
            ? StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen) + "  " + teamValue
            : StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen);
          teams.homeTeamDetails = teamDetail;
        }
        else {
          teamDetail.betName = dartTemplateResult?.handicapValue > 0
            ? StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen) + "  " + dartTemplateResult?.handicapValue
            : StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen);
          teams.awayTeamDetails = teamDetail;
        }
      }
      else if (code.trim().toUpperCase() == AdvantageType.Away) {
        if (!dartTemplateResult?.handicapValue) {
          dartTemplateResult.awayPlayerTitle = teamDetail?.betName;
        }
        let teamValue = (dartTemplateResult?.handicapValue > 0) ? ("-") + dartTemplateResult?.handicapValue : dartTemplateResult?.handicapValue;
        if (!!dartTemplateResult?.handicapValue && Math.sign(dartTemplateResult?.handicapValue) === -1) {
          teamValue = ("+") + Math.abs(Number(teamValue));
        }
        teamDetail.betName = teamValue
          ? StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen) + "  " + teamValue
          : StringHelper?.checkSelectionNameLengthAndTrimEnd(teamDetail?.betName, SelectionNameLength.Seventeen);
        teams.awayTeamDetails = teamDetail;
      }
      else if (code.trim().toUpperCase() == Result.Draw) {
        teams.drawDetails = teamDetail;
      }
      return teams;
    }
  }

}
