import { SportBookResult } from "../models/data-feed/sport-bet-models";
import { SportBookEventHelper } from "./sport-book-event.helper";

export class SportBookResultHelper {
    static removePipeSymbolsAndUpperCaseAllNames(sportBookResult: SportBookResult) {
        for (let [, event] of sportBookResult.events) {
            SportBookEventHelper.removePipeSymbolsAndUpperCaseAllNames(event);
        }
        return sportBookResult;
    }

    static removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(sportBookResult: SportBookResult) {
        for (let [, event] of sportBookResult.events) {
            SportBookEventHelper.removeHorseAndGreyhoundPipeSymbolsAndUpperCaseAllNames(event);
        }
        return sportBookResult;
    }
}