import { SportBookMarketStructured } from "src/app/common/models/data-feed/sport-bet-models";
import { TennisDataContent } from "./tennis-content.model";

export class TennisContent {
    eventName: string;
    markets: Array<SportBookMarketStructured> = [];
    homePlayer: string;
    awayPlayer: string;
    sets: Map<string, TennisSet> = new Map<string, TennisSet>();
    content: TennisDataContent;
    typeName?: string;
    eventDateTime?: Date;
    title: string;
    leftStipulatedLine?: string;
    rightStipulatedLine?: string;
    MatchBetting?: string;
    SetBetting?: string;
    ishideEntry?: boolean = false;
    isSetScore?: boolean = false;
    homePlayerBet?: string;
    awayPlayerBet?: string;
}

export class TennisSet {
    homePlayerBet: string;
    awayPlayerBet: string;
    isHomeHideEntry?: boolean = false;
    isAwayHideEntry?: boolean = false;
    ishideEntry?: boolean = false;
}
