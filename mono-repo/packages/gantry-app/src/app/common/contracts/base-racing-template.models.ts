import { SportBookMarketStructured } from '../models/data-feed/sport-bet-models';

export interface IBaseRacingTemplateResultEntry {
    position: string;
    runnerNumber: string | null | undefined;
    price: string | null | undefined;
    isJointFavourite: boolean | null | undefined;
}

export interface IBaseRacingTemplateResult {
    markets: Array<SportBookMarketStructured>;
    featureMarkets?: Array<SportBookMarketStructured>;
    eventName: string | null | undefined;
    raceStage: string | null | undefined;
    defaultPriceColumn: string | null | undefined;
    marketEachWayString: string | null | undefined;
    isRaceOff?: boolean;
    categoryName: string | null | undefined;
    isEventStarted?: boolean;
    darkThemeEachWayString?: string;
}
