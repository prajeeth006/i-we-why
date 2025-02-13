import { Injectable } from '@angular/core';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportBookMarketStructured, SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { SnookerOutCome } from '../../models/snooker.enum';
import { BetDetails, Market, SnookerMarketResult } from '../../models/snooker.model';

@Injectable({
  providedIn: 'root'
})
export class SnookerMarketService {

  constructor() { }

  prepareMatchResult(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: SnookerMarketResult) {
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Home) {
      sportBookMarket.homeTeamTitle = selection.selectionName;
      market.leftBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Away) {
      sportBookMarket.awayTeamTitle = selection.selectionName;
      market.rightBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Draw) {
      market.drawBetList.push(teamDetail);
    }
    return market;
  }

  prepareHandicapBetting(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: SportBookMarketStructured) {
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Home) {
      let selectionTeam = selection.selectionName.split("+");
      let betName = selectionTeam[0];
      teamDetail.betName = StringHelper.checkSelectionNameLengthAndTrimEnd(betName, SelectionNameLength.Seventeen);
      let handicapVal = sportBookMarket.handicapValue;
      let teamValue = ((handicapVal > 0) ? ("+") + handicapVal : handicapVal)
      teamDetail.betName = teamDetail.betName + "  " + teamValue;
      market.leftBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Away) {
      let selectionTeam = selection.selectionName.split("-");
      let betName = selectionTeam[0];
      teamDetail.betName = StringHelper.checkSelectionNameLengthAndTrimEnd(betName, SelectionNameLength.Seventeen);
      let handicapVal = -(sportBookMarket.handicapValue);
      let teamValue = ((handicapVal > 0) ? ("+") + handicapVal : handicapVal)
      teamDetail.betName = teamDetail.betName + "  " + teamValue;
      market.rightBetList.push(teamDetail);
    }
    return market;
  }

  prepareCorrectScore(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: SnookerMarketResult) {

    if (selection.selectionName.indexOf(sportBookMarket.homeTeamTitle) >= 0 || selection?.outcomeMeaningMinorCode?.trim()?.toUpperCase() == SnookerOutCome.Home) {
      teamDetail.betName = selection.selectionName;
      teamDetail = this.updateTeamDetails(teamDetail);
      market.leftBetList.push(teamDetail);

    } else if (selection.selectionName.indexOf(sportBookMarket.awayTeamTitle) >= 0 || selection?.outcomeMeaningMinorCode?.trim()?.toUpperCase() == SnookerOutCome.Away) {
      teamDetail.betName = selection.selectionName;
      teamDetail = this.updateTeamDetails(teamDetail);
      market.rightBetList.push(teamDetail);
    }

    return market;
  }

  prepareTotalFramesBetting(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: SportBookMarketStructured) {
    let selectionTeam = selection?.selectionName?.split(" ");
    let betName = selectionTeam[selectionTeam?.length - 1];
    teamDetail.betName =StringHelper.checkSelectionNameLengthAndTrimEnd(betName, SelectionNameLength.Seventeen);
    let handicapVal = sportBookMarket.handicapValue;
    teamDetail.betName = teamDetail.betName + " " + handicapVal;
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Home) {
      market.rightBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Under) {
      market.leftBetList.push(teamDetail);
    }
    return market;
  }

  prepareFirstFrameBetting(selection: SportBookSelection, teamDetail: BetDetails, market: Market, sportBookMarket: SnookerMarketResult) {
    if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Home) {
      sportBookMarket.homeTeamTitle = selection.selectionName;
      market.leftBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Away) {
      sportBookMarket.awayTeamTitle = selection.selectionName;
      market.rightBetList.push(teamDetail);
    } else if (selection.outcomeMeaningMinorCode.trim().toUpperCase() == SnookerOutCome.Draw) {
      market.drawBetList.push(teamDetail);
    }
    return market;
  }

  updateTeamDetails(teamDetail: BetDetails): BetDetails {
    let teamSelectionItems = teamDetail?.betName?.replace(/\s/g, ""); //Remove all spaces from SelectonName
    //Ex: "selectionName":"Neil Robertson 10-2"
    //Res: "NeilRobertson10-2"
    let selectScoreNumber = teamSelectionItems?.trim()?.substr(teamSelectionItems.length - 5); //We take last 5 characters from teamSelectionItems
    //Ex: "NeilRobertson10-2"
    //Res:10-2
    let scoreNumber = selectScoreNumber?.trim()?.replace(/[^-+\d]/g, '');  //Remove alphabets from selectScoreNumber
    //Ex: "ON10-2"
    //Res:10-2
    teamDetail.betName = scoreNumber;
    //Final Response :10-2
    return teamDetail;
  }
}
