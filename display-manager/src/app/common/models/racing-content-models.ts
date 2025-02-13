
export class RacingContentTempResult {
    result: RacingContentSelection;
    isFinished: boolean;
}

export class RacingContentSelection {
    results: HorseResults | null | undefined;
    diomed: string | null | undefined;
    courseName: string | null | undefined;
    goingCode: string | null | undefined;
    going: string | null | undefined;
    horses: Array<HorseDetails> | null | undefined;
    raceName: string | null | undefined;
    yards: number | null | undefined;
    distance: string | null | undefined;
    grade: string | null | undefined;
    raceNo: number | null | undefined;
    time: string | null | undefined;     
    countryCode: string | null | undefined;
    hasRacingContent: boolean | null;
}
export class HorseDetails {
    trainer: string | null | undefined;
    rating: string | null | undefined;
    weight: string | null | undefined;
    unAdjustedMasterRating: string | null | undefined;
    silkCoral: string | null | undefined;
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
    hasJockeyChanged: boolean | null | undefined;
    formfigs: string | null | undefined;
    saddle: string | null | undefined;
    weightLbs: number | null | undefined;
    courseDistanceWinner: string | null | undefined;
    horseName: string | null | undefined;
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
export class HorseResults {
    nonRunners: string | null | undefined;
    raceComments: string | null | undefined;
    winSecs: string | null | undefined;
    abandonReason: string | null | undefined;
    offtime: string | null | undefined;                 // TODO: check if it can be a date
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
export class HorseDetailsForm {
    rpr: string | null | undefined;
    weight: string | null | undefined;
    raceid: number | null | undefined;
    weightLbs: number | null | undefined;
    officialRating: string | null | undefined;
    course: string | null | undefined;
    jockey: string | null | undefined;
    date: string | null | undefined;                   // TODO: maybe date type
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