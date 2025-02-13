import { HorseRacingContent } from './horseracing-content.model';

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
    eventTime: string;
    eventTitle: string;
}

export class ManualHorseRacingResults {
    horseRacingContent: HorseRacingContent;
    time: string | null | undefined;
    eventTime: string;
    eventName: string | null | undefined;
    racingContent: RacingContentData;
    runners: Array<ManualHorseRacingResultDetails> = [];
    runnerCount?: string | null | undefined;
    foreCast: string;
    triCast: string;
    win: string;
    place: string;
    totes: Totes;
    eachWayResult: string | null | undefined;
    nonRunners: string | null | undefined;
    eventTimePlusTypeName?: string | null | undefined;
}

export class Totes {
    exacta: string;
    trifecta: string;
}

export class RacingContentData {
    raceNo: number | null;
    distance: string | null | undefined;
    going: string | null | undefined;
}

export class ManualHorseRacingEntry {
    horseNumber: string | null | undefined;
    horseName: string;
    jockeyName: string | null | undefined;
    nonRunner: boolean;
    isStartPrice: boolean;
    currentPrice: number = 0;
    fractionPrice: string;
    jockeySilkImage: string | null | undefined;
    isReserved: boolean;
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
    meetingName: string;
    race: string;
    activerows: number;
    raceoff: boolean;
    isEventResulted: boolean;
    eachway: string;
    run: string | null | undefined;
    distance: string | null | undefined;
    going: string | null | undefined;
    ran: string | null | undefined;
    forecast: string;
    tricast: string;
    win: string;
    place: string;
    exacta: string;
    trifecta: string;
    Runners: ManualHorseRunners[];
}

export class ManualHorseRunners {
    finished: number;
    horseNumber: string | null | undefined;
    horseName: string;
    jockeyName: string | null | undefined;
    price_odds_sp: string;
    odds_sp: string | null | undefined;
    result_odds_sp: string | null | undefined;
    isStartPrice: boolean;
    isNonRunner: boolean;
    isFavourite: boolean;
}

export class SplitScreenPage {
    pageNumber: number;
    startPageIndex: number;
    endPageIndex: number;
    totalRunners: number;
    templateClass: string;
}

export class SplitScreenRunner {
    runnerNumber: number;
    pages: SplitScreenPage[];
}
