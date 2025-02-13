import { SportBookMarketStructured } from "src/app/common/models/data-feed/sport-bet-models";
import { FootballMarket } from "../../models/football.constant";
import { Market } from "../../models/football.model";

export class FootballSportBookMarketHelper {
    static isHandicapMarket(marketTitle: string, sportBookMarket: SportBookMarketStructured): string {
        return sportBookMarket.isHandicapMarket.toString() == 'true' ? marketTitle : null;
    }

    static isWinningMargin(market: Market, sportBookMarket: SportBookMarketStructured): string {
        if (sportBookMarket.marketName.includes(FootballMarket.WINNINGMARGIN)) {
            market.marketTitle = FootballMarket.WINNINGMARGIN;
            return sportBookMarket.marketName;
        } else {
            return "";
        }
    }
}