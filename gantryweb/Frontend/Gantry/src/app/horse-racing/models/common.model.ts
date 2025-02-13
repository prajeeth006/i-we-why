import { RacingContentResult } from "./data-feed/racing-content.model";
import { SportBookResult } from "../../common/models/data-feed/sport-bet-models";

export class FullHorseRacingResult {
    constructor(public sportBookResult: SportBookResult, public racingContentResult: RacingContentResult) { }
}

export enum HorseRacingMarkets {
    WinOrEachWay = 'WIN OR EACH WAY',
    WinOnly = 'WIN ONLY',
    BettingWithout = 'BETTING WITHOUT'
}

export enum ResultCode {
    Win = 'WIN',
    Place = 'PLACE',
    Lose = 'LOSE'
}

export enum selectionName {
    Under = 'UNDER',
    Between = 'BETWEEN',
    Over = 'OVER'
}

export enum Order {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4
}