import { SportBookMarketStructured } from "../models/data-feed/sport-bet-models";

export interface IBaseRacingTemplateResultEntry{
    position: string;
    runnerNumber: string;
    price: string;
    isJointFavourite: boolean;
}

export interface IBaseRacingTemplateResult{
    markets: Array<SportBookMarketStructured>;
    featureMarkets?: Array<SportBookMarketStructured>;
    eventName: string;
    raceStage: string;
    defaultPriceColumn: string;
    marketEachWayString: string;
    isRaceOff: boolean;
    categoryName: string;
    isEventStarted? : boolean;
}