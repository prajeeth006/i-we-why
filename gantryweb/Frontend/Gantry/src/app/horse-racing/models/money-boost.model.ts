import { SportBookEventStructured, SportBookSelection } from "../../common/models/data-feed/sport-bet-models";
import { HorseRacingContent } from "./horseracing-content.model";

export class MoneyBoostResult{
    event: SportBookEventStructured;
    selection: SportBookSelection;
    horseRacingContent: HorseRacingContent;
    oldPriceString: string;
    eventTimePlusTypeName?: string | null;
}