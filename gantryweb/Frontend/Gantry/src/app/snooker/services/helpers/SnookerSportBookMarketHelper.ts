import { SportBookMarketStructured } from "src/app/common/models/data-feed/sport-bet-models";

export class SnookerSportBookMarketHelper {

    static isHandicapMarket(market: string, sportBookMarket: SportBookMarketStructured): string {
        if (sportBookMarket.isHandicapMarket.toString() == 'true') {
            return market;
        } else {
            return "";
        }
    }
}