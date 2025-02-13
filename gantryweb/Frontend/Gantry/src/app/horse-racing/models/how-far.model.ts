import { SportBookEventStructured, SportBookMarketStructured, SportBookSelection } from "../../common/models/data-feed/sport-bet-models";
import { HorseRacingContent } from "./horseracing-content.model";

export class HowFarResult{
    event: SportBookEventStructured;
    market: SportBookMarketStructured;
    selections: Array<SportBookSelection>;
    horseRacingContent: HorseRacingContent;
    eventTimePlusTypeName?: string | null;
}