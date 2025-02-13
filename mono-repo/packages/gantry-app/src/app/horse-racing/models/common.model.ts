import { SportBookResult } from '../../common/models/data-feed/sport-bet-models';
import { RacingContentResult } from './data-feed/racing-content.model';

export class FullHorseRacingResult {
    constructor(
        public sportBookResult: SportBookResult,
        public racingContentResult: RacingContentResult,
    ) {}
}

export enum HorseRacingMarkets {
    WinOrEachWay = 'WIN OR EACH WAY',
    WinOnly = 'WIN ONLY',
    BettingWithout = 'BETTING WITHOUT',
}

export enum ResultCode {
    Win = 'WIN',
    Place = 'PLACE',
    Lose = 'LOSE',
}

export enum selectionName {
    Under = 'UNDER',
    Between = 'BETWEEN',
    Over = 'OVER',
}

export enum Order {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
}

export const FlipGoingPostPicStages = {
    Going: 'GOING',
    RacingPostPic: 'RACING_POST',
    FcTcValue: 'FCTC_VALUE',
};

export class CommonTimers {
    static FcTcTimer: number = 5000;
    static PageRefreshTime: number = 30000;
}

export enum ForecastTricastType {
    forecast = 'FC Available',
    tricast = 'TC Available',
    forecastandtricast = 'FC/TC Available',
}

export enum AssetType {
    runnercount = 'runnercount',
    scrolling = 'scrolling',
    halfScreensplitting = 'halfscreensplit',
    quadScreensplitting = 'quadscreensplit',
}
