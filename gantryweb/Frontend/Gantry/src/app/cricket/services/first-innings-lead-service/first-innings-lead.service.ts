import { Injectable } from "@angular/core";
import { SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { CricketTemplateResult, BetDetails, MatchData } from "../../models/cricket-template.model";
import { CommonUtilityService } from "../common/common-utility.service";

@Injectable({
    providedIn: 'root'
})
export class InningsLeadService {

    constructor(private commonUtilityService: CommonUtilityService) { }

    setFirstInningsLeadDetails(marketName: string, cricketTemplateResult: CricketTemplateResult, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
        : CricketTemplateResult {
        let teams = new MatchData();
        let selection = selections[marketName];
        for (let selectionName in selection) {
            let odds = this.commonUtilityService.setOddsFormat(selectionName, selection);
            let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice);
            teams = this.setFirstInningsLeadPanel(teamDetail, teams, cricketTemplateResult);
        }
        cricketTemplateResult.tossOrLeadInfoPanel = teams;
        return cricketTemplateResult;
    }

    private setFirstInningsLeadPanel(teamDetail: BetDetails, teams: MatchData, cricketTemplateResult: CricketTemplateResult): MatchData {
        if (!!cricketTemplateResult?.mainEventInfoPanel) {
            if (teamDetail?.betName == cricketTemplateResult?.mainEventInfoPanel?.homeTeamDetails?.betName) {
                teams.homeTeamDetails = teamDetail;
            }
            else if (teamDetail?.betName == cricketTemplateResult?.mainEventInfoPanel?.awayTeamDetails?.betName) {
                teams.awayTeamDetails = teamDetail;
            }
        }
        return teams;
    }
}