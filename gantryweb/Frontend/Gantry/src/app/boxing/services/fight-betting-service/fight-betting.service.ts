import { Injectable } from '@angular/core';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from 'src/app/common/helpers/sport-book-selection-helper';
import { SportBookSelection } from 'src/app/common/models/data-feed/sport-bet-models';
import { AdvantageType, Result } from '../../models/boxing-constants.model';
import { BetDetails, BoxingTemplateContent, MatchData } from '../../models/boxing-template.model';

@Injectable({
    providedIn: 'root'
})
export class FightBettingService {

    constructor() { }

    setFightDetails(marketName: string, boxingTemplateResult: BoxingTemplateContent, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
        : BoxingTemplateContent {
        let selection = selections[marketName];
        var teams = new MatchData();
        for (let selectionName in selection) {
            let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
            let teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice,  selection[selectionName]?.hideEntry);
            teams = this.setHomeDrawOrAwayDetails(selection[selectionName].outcomeMeaningMinorCode, teamDetail, teams, boxingTemplateResult);
        }
        boxingTemplateResult.mainEventInfoPanel = teams;
        return boxingTemplateResult;
    }

    setHomeDrawOrAwayDetails(code: string, teamDetail: BetDetails, teams: MatchData, boxingTemplateResult: BoxingTemplateContent): MatchData {
        if (!!code) {
            if (code.trim().toUpperCase() == AdvantageType.Home) {
                boxingTemplateResult.homeFighterTitle = teamDetail.betName;
                teams.homeFighterDetails = teamDetail;
            }
            else if (code.trim().toUpperCase() == AdvantageType.Away) {
                boxingTemplateResult.awayFighterTitle = teamDetail.betName;
                teams.awayFighterDetails = teamDetail;
            }
            else if (code.trim().toUpperCase() == Result.Draw) {
                teams.drawDetails = teamDetail;
            }
            return teams;
        }
    }
}
