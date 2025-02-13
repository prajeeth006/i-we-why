import { HorseRacingContent } from "./horseracing-content.model";

export class ManualHorseRacingResponse {
    isAnyEventResulted: boolean;
    manualHorseRacingRunners: ManualHorseRacingRunners;
}

export class ManualHorseRacingRunners {
    horseRacingContent: HorseRacingContent;
    eventTimePlusTypeName?: string | null | undefined;
    categoryName: string | null | undefined;
    racingContent: RacingContentData;
    horseRacingEntries: Array<ManualHorseRacingEntry> = [];
    isRaceOff: boolean;
    runnerCount?: string | null | undefined;
    marketEachWayString: string | null | undefined;
    bettingFavouritePrice: number;
}

export class ManualHorseRacingResults {
    horseRacingContent: HorseRacingContent;
    time: string | null | undefined;
    eventName: string | null | undefined;
    racingContent: RacingContentData;
    runners: Array<ManualHorseRacingResultDetails> = [];
    runnerCount?: string | null | undefined;
    foreCast: string | null | undefined;
    triCast: string | null | undefined;
    win: string | null | undefined;
    place : string | null | undefined;
    totes: Totes;
    eachWayResult: string | null | undefined;
    nonRunners: string | null | undefined;
}

export class Totes {
    exacta: string | null | undefined;
    trifecta: string | null | undefined;
}

export class RacingContentData {
    raceNo: number;
    distance: string | null | undefined;
    going: string | null | undefined;
}

export class ManualHorseRacingEntry {
    horseNumber: string | null | undefined;
    horseName: string | null | undefined;
    jockeyName: string | null | undefined;
    nonRunner: boolean;
    isStartPrice: boolean;
    currentPrice: number = 0;
    fractionPrice: string | null | undefined;
    jockeySilkImage: string | null | undefined;
    isReserved : boolean;
}


export class ManualHorseRacingResultDetails {
    horseRunnerNumber: string | null | undefined;
    horseName: string | null | undefined;
    position: number;
    favourite: string | null | undefined;
    price: string | null | undefined;
    jockeySilkImage: string | null | undefined;
    isFavourite: boolean = false;
    isReserved?: boolean | null | undefined;
    nonRunner: boolean;
    isStartPrice: boolean;
    fractionPrice: string | null | undefined;
}


export class ManualHorseRacingTemplateResult {
    timehrs: string | null | undefined;
    timemins: string | null | undefined;
    category: string | null | undefined;
    meetingName: string | null | undefined;
    race: string | null | undefined;
    activerows: number;
    raceoff: boolean;
    isEventResulted: boolean;
    eachway: string | null | undefined;
    run: string | null | undefined;
    distance: string | null | undefined;
    going: string | null | undefined;
    ran: string | null | undefined;
    forecast: string | null | undefined;
    tricast: string | null | undefined;
    win: string | null | undefined;
    place: string | null | undefined;
    exacta: string | null | undefined;
    trifecta: string | null | undefined;
    Runners: ManualHorseRunners[];
}

export class ManualHorseRunners {
    finished: number;
    horseNumber: string | null | undefined;
    horseName: string | null | undefined;
    jockeyName: string | null | undefined;
    price_odds_sp: string | null | undefined;
    odds_sp: string | null | undefined;
    result_odds_sp: string | null | undefined;
    isStartPrice: boolean;
    isNonRunner: boolean;
    isFavourite: boolean;
}
