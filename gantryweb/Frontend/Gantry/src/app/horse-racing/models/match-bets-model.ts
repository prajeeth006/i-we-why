import { SportBookEventStructured, SportBookSelection } from "../../common/models/data-feed/sport-bet-models";
import { HorseRacingContent } from "./horseracing-content.model";

export class MatchBetsResult {
    event: SportBookEventStructured;
    selections: Array<SportBookSelection>;
    horseRacingContent: HorseRacingContent;
    eventTimePlusTypeName?: string | null;
    hotShowSelections: SelectionsNames;
}

export class SelectionsNames {
    selectionName1: string | null | undefined;
    selectionName2: string | null | undefined;
    bothToWin: string | null | undefined;
    price?: string | null | undefined;
    hideEntry?: boolean = false;
}