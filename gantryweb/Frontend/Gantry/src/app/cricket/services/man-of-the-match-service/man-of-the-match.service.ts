import { Injectable } from "@angular/core";
import { StringHelper } from "src/app/common/helpers/string.helper";
import { SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { SelectionNameLength } from "src/app/common/models/general-codes-model";
import { CricketTemplateResult, BetDetails, ManOfTheMatchPlayers } from "../../models/cricket-template.model";
import { CommonUtilityService } from "../common/common-utility.service";

@Injectable({
    providedIn: 'root'
})
export class ManOfTheMatchService {

    constructor(private commonUtilityService: CommonUtilityService) { }

    /* Home and Away Man Of the Match Code

    setManOfTheMatchDetails(marketName: string, cricketTemplateResult: CricketTemplateResult, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
        : CricketTemplateResult {
        let manOfTheMatchList = new ManOfTheMatchList();
        let selection = selections[marketName];
        for (let selectionName in selection) {
            let code = selection[selectionName].outcomeMeaningMajorCode;
            let odds = this.commonUtilityService.setOddsFormat(selectionName, selection);
            let playerDetails = new BetDetails(selectionName, odds);
            this.setManOfTheMatchListEntries(code, playerDetails, manOfTheMatchList);
        }
        cricketTemplateResult.manOfTheMatchInfoPanel = manOfTheMatchList;
        return cricketTemplateResult;
    }

    setManOfTheMatchDetails(marketName: string, cricketTemplateResult: CricketTemplateResult, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
        : CricketTemplateResult {
        let manOfTheMatchList = new ManOfTheMatchList();
        let selection = selections[marketName];
        for (let selectionName in selection) {
            let code = selection[selectionName].outcomeMeaningMajorCode;
            let odds = this.commonUtilityService.setOddsFormat(selectionName, selection);
            let playerDetails = new BetDetails(selectionName, odds);
            this.setManOfTheMatchListEntries(code, playerDetails, manOfTheMatchList);
        }
        cricketTemplateResult.manOfTheMatchInfoPanel = manOfTheMatchList;
        return cricketTemplateResult;
    }

    private setManOfTheMatchListEntries(code: string, playerDetails: BetDetails, manOfTheMatchList: ManOfTheMatchList) {
        if (!!code) {
            if (code.trim().toUpperCase() == AdvantageType.Home) {
                this.setHomeManOfTheMatchDetails(playerDetails, manOfTheMatchList);
            }
            else if (code.trim().toUpperCase() == AdvantageType.Away) {
                this.setAwayManOfTheMatchDetails(playerDetails, manOfTheMatchList);
            }
            else {
                this.setHomeManOfTheMatchDetails(playerDetails, manOfTheMatchList);
                this.setAwayManOfTheMatchDetails(playerDetails, manOfTheMatchList);
            }
        }
    }

    private setHomeManOfTheMatchDetails(playerDetails: BetDetails, manOfTheMatchList: ManOfTheMatchList) {
        if (!manOfTheMatchList.homeTeamManOfTheMatchShortest) {
            manOfTheMatchList.homeTeamManOfTheMatchShortest = playerDetails;
        }
        else {
            let shortestPrice = this.getPriceFromOdds(manOfTheMatchList.homeTeamManOfTheMatchShortest?.betOdds);
            let currentPrice = this.getPriceFromOdds(playerDetails?.betOdds);
            if (currentPrice <= shortestPrice) {
                manOfTheMatchList.homeTeamManOfTheMatchSecondShortest = manOfTheMatchList.homeTeamManOfTheMatchShortest;
                manOfTheMatchList.homeTeamManOfTheMatchShortest = playerDetails;
            }
            else {
                if (!manOfTheMatchList.homeTeamManOfTheMatchSecondShortest) {
                    manOfTheMatchList.homeTeamManOfTheMatchSecondShortest = playerDetails;
                }
                else {
                    let secondShortestPrice = this.getPriceFromOdds(manOfTheMatchList.homeTeamManOfTheMatchSecondShortest?.betOdds);
                    if (currentPrice <= secondShortestPrice) {
                        manOfTheMatchList.homeTeamManOfTheMatchSecondShortest = playerDetails;
                    }
                }
            }
        }
    }

    private setAwayManOfTheMatchDetails(playerDetails: BetDetails, manOfTheMatchList: ManOfTheMatchList) {
        if (!manOfTheMatchList.awayTeamManOfTheMatchShortest) {
            manOfTheMatchList.awayTeamManOfTheMatchShortest = playerDetails;
        }
        else {
            let shortestPrice = this.getPriceFromOdds(manOfTheMatchList.awayTeamManOfTheMatchShortest?.betOdds);
            let currentPrice = this.getPriceFromOdds(playerDetails?.betOdds);
            if (currentPrice <= shortestPrice) {
                manOfTheMatchList.awayTeamManOfTheMatchSecondShortest = manOfTheMatchList.awayTeamManOfTheMatchShortest;
                manOfTheMatchList.awayTeamManOfTheMatchShortest = playerDetails;
            }
            else {
                if (!manOfTheMatchList.awayTeamManOfTheMatchSecondShortest) {
                    manOfTheMatchList.awayTeamManOfTheMatchSecondShortest = playerDetails;
                }
                else {
                    let secondShortestPrice = this.getPriceFromOdds(manOfTheMatchList.awayTeamManOfTheMatchSecondShortest?.betOdds);
                    if (currentPrice <= secondShortestPrice) {
                        manOfTheMatchList.awayTeamManOfTheMatchSecondShortest = playerDetails;
                    }
                }
            }
        }
    }

    -- End Home and Away Man Of the Match Code
    */

    setManOfTheMatchDetails(marketName: string, cricketTemplateResult: CricketTemplateResult, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
        : CricketTemplateResult {
        let manOfTheMatchList = new ManOfTheMatchPlayers();
        manOfTheMatchList.manOfTheMatchPlayerList = [];
        let selection = selections[marketName];
        for (let selectionName in selection) {
            let odds = this.commonUtilityService.setOddsFormat(selectionName, selection);
            let playerDetails = new BetDetails(StringHelper.checkSelectionNameLengthAndTrimEnd(selectionName, SelectionNameLength.Seventeen), odds, selection[selectionName]?.hidePrice);
            this.setManOfTheMatchPlayers(playerDetails, manOfTheMatchList);
        }
        cricketTemplateResult.manOfTheMatchPlayerPanel = manOfTheMatchList;
        return cricketTemplateResult;
    }

    private setManOfTheMatchPlayers(playerDetails: BetDetails, manOfTheMatchList: ManOfTheMatchPlayers): ManOfTheMatchPlayers {
        manOfTheMatchList.manOfTheMatchPlayerList.push(playerDetails);
        if (manOfTheMatchList.manOfTheMatchPlayerList.length > 1) {
            manOfTheMatchList.manOfTheMatchPlayerList.sort(
                function (first, second) {
                    let firstNumber = ManOfTheMatchService.getPriceFromOdds(first?.betOdds);
                    let secondNumber = ManOfTheMatchService.getPriceFromOdds(second?.betOdds);
                    return firstNumber - secondNumber;
                }
            );
            if (manOfTheMatchList.manOfTheMatchPlayerList.length > 4) {
                manOfTheMatchList.manOfTheMatchPlayerList.pop();
            }
        }
        return manOfTheMatchList;
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