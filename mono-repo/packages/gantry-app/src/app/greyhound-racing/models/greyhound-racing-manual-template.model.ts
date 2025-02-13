import { GantryCommonContent } from '../../common/models/gantry-commom-content.model';
import { GreyhoundStaticContent } from './greyhound-racing-template.model';

export class ManualGreyhoundRacingResponse {
    isAnyEventResulted: boolean;
    manualGreyhoundRacingRunners: ManualGreyhoundRacingRunners;
    manualGreyhoundRacingResults: ManualGreyhoundRacingResults;
}

export class ManualGreyhoundRacingRunners {
    greyhoundRacingContent: GreyhoundStaticContent;
    eventTimePlusTypeName?: string | null;
    eventTime: string;
    eventTitle: string;
    racingContent: RacingContentData;
    greyhoundRacingEntries: Array<ManualGreyhoundRacingEntry> = [];
    isRaceOff: boolean;
    runnerCount?: string | null | undefined;
    marketEachWayString: string | null;
    gantryCommonContent: GantryCommonContent;
    isHalfScreenType: boolean;
    isFullScreenType: boolean;
    hasAnyReservedRunner: boolean;
    favPrice: number;
    isUKEvent: boolean;
    foreCast: string | null | undefined;
    triCast: string | null | undefined;
}

export class ManualGreyhoundRacingResults {
    greyhoundRacingContent: GreyhoundStaticContent;
    eventTimePlusTypeName?: string | null;
    eventTime: string;
    eventTitle: string;
    racingContent: RacingContentData;
    time: string | null | undefined;
    eventName: string | null | undefined;
    runners: Array<ManualGreyhoundRacingResultDetails> = [];
    marketEachWayString: string | null;
    gantryCommonContent: GantryCommonContent;
    isHalfScreenType: boolean;
    isFullScreenType: boolean;
    hasAnyReservedRunner: boolean;
    isRaceOff: boolean;
    runnerCount?: string | null | undefined;
    foreCast: string | null | undefined;
    triCast: string | null | undefined;
    win: string | null | undefined;
    place: string | null | undefined;
    totes: Totes;
    eachWayResult: string | null | undefined;
    isAnyEventResulted: boolean;
    vacantRunners?: string;
    isUKEvent?: boolean;
}

export class Totes {
    exacta: string | null | undefined;
    trifecta: string | null | undefined;
}

export class RacingContentData {
    raceNo: string | null | undefined;
    distance: string | null | undefined;
    grade: string | null | undefined;
}

export class ManualGreyhoundRacingEntry {
    trapNumber: string | null | undefined;
    greyhoundName: string;
    comment: string | null | undefined;
    nonRunner: boolean;
    currentPrice: string;
    actualPrice: number;
    jockeySilkImage: string | null | undefined;
    isReserved: boolean;
    isStartPrice: boolean;
    isVacant: boolean;
}

export class ManualGreyhoundRacingResultDetails {
    greyhoundRunnerNumber: string | null | undefined;
    greyhoundName: string | null | undefined;
    position: any | null | undefined;
    favourite: string | null | undefined;
    price: string | null | undefined;
    jockeySilkImage?: string | null | undefined;
    isFavourite: boolean;
    isReserved?: boolean | null | undefined;
    trapNo: string | null | undefined;
    isStartPrice: boolean;
    currentPrice: string | null | undefined;
}

export class ManualGreyhoundRacingTemplateResult {
    category: string | null | undefined;
    timemins: string | null | undefined;
    timehrs: string | null | undefined;
    meetingName: string;
    race: string | null | undefined;
    country: string | null | undefined;
    raceoff: boolean;
    eachway: string;
    distance: string | null | undefined;
    grade: string | null | undefined;
    activerows: number;
    isEventResulted: boolean;
    forecast: string;
    tricast: string;
    run: string | null | undefined;
    going: string | null | undefined;
    priceType: string | null | undefined;
    win: any;
    place: any;
    Runners: Runner[];
}

export class Runner {
    isVacant: boolean;
    isReserved: boolean;
    trapNumber: string;
    greyhoundName: string;
    price_odds_sp: string;
    result_odds_sp: any;
    odds_sp_value: any;
    odds_sp: any;
    isStartPrice: boolean;
    finished: number | null | undefined;
    isFavourite: boolean;
}
