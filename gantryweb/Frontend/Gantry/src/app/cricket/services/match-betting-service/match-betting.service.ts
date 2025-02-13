import { Injectable } from "@angular/core";
import { SportBookMarketHelper } from "src/app/common/helpers/sport-book-market.helper";
import { SportBookSelectionHelper } from "src/app/common/helpers/sport-book-selection-helper";
import { SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { BetDetails, CricketTemplateResult, MatchData } from "../../models/cricket-template.model";
import { CommonUtilityService } from "../common/common-utility.service";

@Injectable({
    providedIn: 'root'
})
export class MatchBettingService {

    constructor(private commonUtilityService: CommonUtilityService) {
    }

    setMatchDetails(marketName: string, cricketTemplateResult: CricketTemplateResult, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
        : CricketTemplateResult {

        let selection = selections[marketName];
        var teams = new MatchData();

        for (let selectionName in selection) {
            let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
            let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
            teams = this.commonUtilityService.setHomeDrawOrAwayDetails(selection[selectionName], teamDetail, teams, cricketTemplateResult);
        }

        cricketTemplateResult.mainEventInfoPanel = teams;

        this.checkHomeOrAwayPlayer(cricketTemplateResult);
        return cricketTemplateResult;
    }

    setCricketPageTitleDetails(cricketTemplateResult: CricketTemplateResult): CricketTemplateResult {
        return this.commonUtilityService.setCricketPageTitle(cricketTemplateResult);
    }


    private checkHomeOrAwayPlayer(cricketTemplate: CricketTemplateResult) {

        cricketTemplate.homeCountry = cricketTemplate.cricketCountries.find(x => x.name.toLowerCase() == cricketTemplate.mainEventInfoPanel?.homeTeamDetails?.betName?.toLowerCase())
        cricketTemplate.awayCountry = cricketTemplate.cricketCountries.find(x => x.name.toLowerCase() == cricketTemplate.mainEventInfoPanel?.awayTeamDetails?.betName?.toLowerCase())

    }
}