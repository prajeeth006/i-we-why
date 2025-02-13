import { Injectable } from "@angular/core";
import { SportBookMarketHelper } from "src/app/common/helpers/sport-book-market.helper";
import { SportBookSelectionHelper } from "src/app/common/helpers/sport-book-selection-helper";
import { SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";
import { CricketCountriesContent } from "../../models/cricket-countries.model";
import { CricketTemplateResult, BetDetails, TopRunScorerList } from "../../models/cricket-template.model";

@Injectable({
    providedIn: 'root'
})
export class RunscorerService {
    firstTeamMarketName = "";
    constructor() { }

    setTopRunScorers(marketName: string, cricketTemplateResult: CricketTemplateResult, topRunScorerMarket: TopRunScorerList, selections: { [marketName: string]: { [selectionName: string]: SportBookSelection } })
        : TopRunScorerList {

        if (!topRunScorerMarket)
            topRunScorerMarket = new TopRunScorerList();

        if (this.checkHomeOrAwayPlaer(marketName, cricketTemplateResult.homeCountry)) {
            topRunScorerMarket.homeTeamTopRunScorerList = [];
        }
        else if (this.checkHomeOrAwayPlaer(marketName, cricketTemplateResult.awayCountry)) {
            topRunScorerMarket.awayTeamTopRunScorerList = [];
        }

        let selection = selections[marketName];
        for (let selectionName in selection) {
            let odds = SportBookMarketHelper.getPriceStr(SportBookSelectionHelper.getLatestPrice(selection[selectionName]));
            let playerDetails = new BetDetails(selectionName, odds, selection[selectionName]?.hidePrice, selection[selectionName]?.hideEntry);

            if (this.checkHomeOrAwayPlaer(marketName, cricketTemplateResult.homeCountry)) {
                topRunScorerMarket.homeTeamTopRunScorerList.push(playerDetails);
            }
            else if (this.checkHomeOrAwayPlaer(marketName, cricketTemplateResult.awayCountry)) {
                topRunScorerMarket.awayTeamTopRunScorerList.push(playerDetails);
            }
        }

        this.sortRunScorerList(topRunScorerMarket?.homeTeamTopRunScorerList);
        this.sortRunScorerList(topRunScorerMarket?.awayTeamTopRunScorerList);

        return topRunScorerMarket;
    }


    private sortRunScorerList(topRunScorerList: Array<BetDetails>) {
        if (topRunScorerList?.length > 1) {
            topRunScorerList.sort(
                function (first, second) {
                    let firstNumber = RunscorerService.getPriceFromOdds(first?.betOdds);
                    let secondNumber = RunscorerService.getPriceFromOdds(second?.betOdds);
                    return firstNumber - secondNumber;
                }
            );
        }
        return topRunScorerList;
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

    private checkHomeOrAwayPlaer(marketName: string, cricketCounty: CricketCountriesContent): boolean {
        let isHomeTeam: boolean;
        if (marketName?.toLowerCase()?.startsWith(cricketCounty?.name?.toLowerCase())) {
            return true;
        }
        cricketCounty?.matches.forEach(countryMatch => {
            if (marketName?.toLowerCase()?.startsWith(countryMatch?.toLowerCase()))
                isHomeTeam = true;
        })
        return isHomeTeam;
    }
}