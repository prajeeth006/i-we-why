import { SisData } from '../../../common/models/sis-model';

// For Horse Racing
export class RacingContentResult {
    ladbrokesDigitalEventId: Array<number> | null | undefined;
    ladbrokesRetailEventId: Array<number> | null | undefined;
    results: HorseResults | null | undefined;
    coralDigitalEventId: Array<number> | null | undefined;
    coralRetailEventId: Array<number> | null | undefined;
    diomed: string;
    courseName: string | null | undefined;
    goingCode: string | null | undefined;
    going: string | null | undefined;
    obStartTime: string | null | undefined; // TODO: maybe date type
    rpCourseId: number | null | undefined;
    courseGraphicsLadbrokes: string | null | undefined;
    horses: Array<HorseDetails> | null | undefined;
    courseGraphicsCoral: string | null | undefined;
    raceName: string | null | undefined;
    yards: number | null | undefined;
    distance: string | null | undefined;
    newspapers: RacingContentNewspaper[];
    raceNo: number | null | undefined;
    verdict: string | null | undefined;
    time: string | null | undefined; // TODO: maybe date type
    rpRaceId: number | null | undefined;
    isHandicap: string | null | undefined;
    flatOrJump: string | null | undefined;
    raceType: string | null | undefined;
    tv: string | null | undefined;
    raceClass: number | null | undefined;
    agesAllowed: string | null | undefined;
    ageLimitation: string | null | undefined;
    openAgeRace: string | null | undefined;
    runnerCount: number | null | undefined;
    trackFences: number | null | undefined;
    prize1: number | null | undefined;
    prize2: number | null | undefined;
    prize3: number | null | undefined;
    prize4: number | null | undefined;
    prize5: number | null | undefined;
    prize6: number | null | undefined;
    countryCode: string | null | undefined;
    trends: Array<RacingContentTrends> | null | undefined;
    keystat: Array<RacingContentKeyStat> | null | undefined;
    graphics: string | null | undefined;
    fileTypeFlag: number | null | undefined;
    otherEventIds: RacingContentOtherEventIds | null | undefined;
    sisData: SisData;
    evrRaceType?: string | null | undefined;
    hasRacingContent: boolean | null;
}

export class HorseDetails {
    trainer: string | null | undefined;
    rating: string | null | undefined;
    weight: string | null | undefined;
    unAdjustedMasterRating: string | null | undefined;
    silkCoral: string;
    horseAge: number | null | undefined;
    jockey: string | null | undefined;
    silkLadbrokes: string | null | undefined;
    silk: string | null | undefined;
    starRating: string | null | undefined;
    rpJockeyId: number | null | undefined;
    adjustedMasterRating: string | null | undefined;
    daysSinceRun: string | null | undefined;
    rpHorseId: number | null | undefined;
    diomedComment: string | null | undefined;
    rpTrainerId: number | null | undefined;
    form: Array<HorseDetailsForm> | null | undefined;
    hasJockeyChanged: boolean;
    formfigs: string | null | undefined;
    saddle: string;
    weightLbs: number | null | undefined;
    courseDistanceWinner: string | null | undefined;
    horseName: string;
    spotlight: string | null | undefined;
    owner: string | null | undefined;
    officialRating: string | null | undefined;
    allowance: number | null | undefined;
    isBeatenFavourite: boolean | null | undefined;
    isReservedRunner: boolean | null | undefined;
    isWithdrawn: boolean | null | undefined;
    horseSuffix: string | null | undefined;
    nonRunner: boolean | null | undefined;
}

export class HorseDetailsForm {
    rpr: string | null | undefined;
    weight: string | null | undefined;
    raceid: number | null | undefined;
    weightLbs: number | null | undefined;
    officialRating: string | null | undefined;
    course: string | null | undefined;
    jockey: string | null | undefined;
    date: string | null | undefined; // TODO: maybe date type
    topspeed: string | null | undefined;
    outcome: string | null | undefined;
    condition: string | null | undefined;
    position: string | null | undefined;
    odds: string | null | undefined;
    comment: string | null | undefined;
    noOfRunners: string | null | undefined;
    distanceToWinner: string | null | undefined;
    courseName: string | null | undefined;
    distance: string | null | undefined;
    raceTitle: string | null | undefined;
    isHandicap: boolean | null | undefined;
    raceClass: string | null | undefined;
    agesAllowed: string | null | undefined;
    allowance: string | null | undefined;
    other: HorseDetailsFormOther | null | undefined;
}

export class HorseDetailsFormOther {
    horseName: string | null | undefined;
    weight: string | null | undefined;
}

export class RacingContentNewspaper {
    selection: string;
    name: string | null | undefined;
    rpSelectionUid: number;
    tips: string | null | undefined;
}

export class RacingContentTrends {
    year: string | null | undefined;
    weightLbs: string | null | undefined;
    trainer: string | null | undefined;
    jockey: string | null | undefined;
    rpr: string | null | undefined;
    draw: string | null | undefined;
    age: string | null | undefined;
    sp: string | null | undefined;
    winner: string | null | undefined;
}

export class RacingContentKeyStat {
    runner: string | null | undefined;
    comment: string | null | undefined;
}

export class RacingContentOtherEventIds {
    CDR: Array<number> | null | undefined;
    LDP: Array<number> | null | undefined;
}

export class HorseResults {
    nonRunners: string | null | undefined;
    raceComments: string | null | undefined;
    winSecs: string | null | undefined;
    abandonReason: string | null | undefined;
    offtime: string | null | undefined; // TODO: check if it can be a date
    runners: Array<HorseRunners> | null | undefined;
}

export class HorseRunners {
    comment: string | null | undefined;
    saddle: string | null | undefined;
    jockeyName: string | null | undefined;
    distanceToWinner: string | null | undefined;
    position: string | null | undefined;
    horseName: string | null | undefined;
    distanceHif: string | null | undefined;
    rpHorseId: number | null | undefined;
    odds: string | null | undefined;
    favourite: string | null | undefined;
}
