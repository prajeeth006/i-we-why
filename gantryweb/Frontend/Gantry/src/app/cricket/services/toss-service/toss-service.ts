import { Injectable } from "@angular/core";
import { SportBookMarketHelper } from "src/app/common/helpers/sport-book-market.helper";
import { SportBookSelectionHelper } from "src/app/common/helpers/sport-book-selection-helper";
import { SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { CricketTemplateResult, MatchData, BetDetails } from "../../models/cricket-template.model";

@Injectable({
    providedIn: 'root'
})
export class TossService {

    constructor() { }

    setTossDetails(marketName: string, cricketTemplateResult: CricketTemplateResult, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
        : CricketTemplateResult {
        let teams = new MatchData();
        let selection = selections[marketName];
        for (let selectionName in selection) {
            let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
            let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
            teams = this.setTeamsInTossPanel(teamDetail, teams, cricketTemplateResult);
        }
        cricketTemplateResult.tossOrLeadInfoPanel = teams;
        return cricketTemplateResult;
    }

    private setTeamsInTossPanel(teamDetail: BetDetails, teams: MatchData, cricketTemplateResult: CricketTemplateResult): MatchData {
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