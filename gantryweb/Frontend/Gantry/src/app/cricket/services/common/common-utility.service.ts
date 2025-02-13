import { Injectable } from "@angular/core";
import { SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { AdvantageType, Result } from "../../models/cricket-template.enum";
import { CricketTemplateResult, BetDetails, MatchData } from "../../models/cricket-template.model";

@Injectable({
    providedIn: 'root'
})
export class CommonUtilityService {

    constructor() { }

    setOddsFormat(selectionName: string, selection: { [selectionName: string]: SportBookSelection }): string {
        if (!!selection[selectionName]?.prices?.price) {
            return selection[selectionName]?.prices?.price[0]?.numPrice.toString() + " / " + selection[selectionName]?.prices?.price[0]?.denPrice.toString();
        }
    }

    setHomeDrawOrAwayDetails(selection: SportBookSelection, teamDetail: BetDetails, teams: MatchData, cricketTemplateResult: CricketTemplateResult)
        : MatchData {
        if (selection.outcomeMeaningMajorCode.trim().toUpperCase() == AdvantageType.Home
            || selection.outcomeMeaningMinorCode.trim().toUpperCase() == AdvantageType.Home) {
            teams.homeTeamDetails = teamDetail;
        }
        else if (selection.outcomeMeaningMajorCode.trim().toUpperCase() == AdvantageType.Away
            || selection.outcomeMeaningMinorCode.trim().toUpperCase() == AdvantageType.Away) {
            teams.awayTeamDetails = teamDetail;
        }
        else if (selection.outcomeMeaningMajorCode.trim().toUpperCase() == Result.Draw
            || selection.outcomeMeaningMinorCode.trim().toUpperCase() == Result.Draw) {
            cricketTemplateResult.isTestMatch = true;
            teams.drawMatchDetails = teamDetail;
        }
        return teams;
    }

    setCricketPageTitle(cricketTemplateResult: CricketTemplateResult)
        : CricketTemplateResult {
        if (!cricketTemplateResult.title) {
            if (!!cricketTemplateResult.mainEventInfoPanel.homeTeamDetails && !!cricketTemplateResult.mainEventInfoPanel.awayTeamDetails)
                cricketTemplateResult.title = cricketTemplateResult.mainEventInfoPanel.homeTeamDetails.betName + " V " + cricketTemplateResult.mainEventInfoPanel.awayTeamDetails.betName;
        }
        return cricketTemplateResult;
    }
}