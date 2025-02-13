import { Injectable } from '@angular/core';

import { SportBookMarketHelper } from '../../../common/helpers/sport-book-market.helper';
import { SportBookSelectionHelper } from '../../../common/helpers/sport-book-selection-helper';
import { SportBookSelection } from '../../../common/models/data-feed/sport-bet-models';
import { AdvantageType, Result } from '../../models/boxing-constants.model';
import { BetDetails, BoxingTemplateContent, MatchData } from '../../models/boxing-template.model';

@Injectable({
    providedIn: 'root',
})
export class FightBettingService {
    constructor() {}

    setFightDetails(
        marketName: string,
        boxingTemplateResult: BoxingTemplateContent,
        selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } },
    ): BoxingTemplateContent {
        const selection = selections[marketName];
        let teams = new MatchData();
        for (const selectionName in selection) {
            const odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
            const teamDetail = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);
            teams = this.setHomeDrawOrAwayDetails(selection[selectionName].outcomeMeaningMinorCode, teamDetail, teams, boxingTemplateResult);
        }
        boxingTemplateResult.mainEventInfoPanel = teams;
        return boxingTemplateResult;
    }

    setHomeDrawOrAwayDetails(code: string, teamDetail: BetDetails, teams: MatchData, boxingTemplateResult: BoxingTemplateContent): MatchData {
        if (code) {
            if (code.trim().toUpperCase() == AdvantageType.Home) {
                boxingTemplateResult.homeFighterTitle = teamDetail.betName;
                teams.homeFighterDetails = teamDetail;
            } else if (code.trim().toUpperCase() == AdvantageType.Away) {
                boxingTemplateResult.awayFighterTitle = teamDetail.betName;
                teams.awayFighterDetails = teamDetail;
            } else if (code.trim().toUpperCase() == Result.Draw) {
                teams.drawDetails = teamDetail;
            }
            return teams;
        }
        return teams;
    }
}
