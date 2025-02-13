// For Greyhound -
import { SisData } from '../../common/models/sis-model';

export class RacingContentGreyhoundResult {
    ladbrokesDigitalEventId: Array<number> | null | undefined;
    coralDigitalEventId: Array<number> | null | undefined;
    ladbrokesRetailEventId: Array<number> | null | undefined;
    coralRetailEventId: Array<number> | null | undefined;
    otherEventIds: Map<String, Array<Number>> | null | undefined;
    distance: string | null | undefined;
    trackName: string | null | undefined;
    bags: string | null | undefined;
    raceNo: string | null | undefined;
    raceType: string | null | undefined;
    postPick: string | null | undefined;
    grade: string | null | undefined;
    rpTrackId: Number | null | undefined;
    time: string | null | undefined;
    obStartTime: string | null | undefined;
    prize: string | null | undefined;
    rpRaceId: Number | null | undefined;
    abandoned: string | null | undefined;
    isIrishRace: Boolean | null | undefined;
    countryCode: string | null | undefined;
    runners: Array<GreyhoundRunner> | null | undefined;
    numberOfRunners: string | null | undefined;
    sisData: SisData;
    postPickNap?: boolean;
    postPickNextBest?: boolean;
    runnerCount?: string | null | undefined;
}

export class GreyhoundRunner {
    comment: string;
    reserve: boolean | null | undefined;
    rating: string | null | undefined;
    dogColor: string | null | undefined;
    bitchSeason: string | null | undefined;
    whelp: string | null | undefined;
    last5Runs: string | null | undefined;
    damName: string | null | undefined;
    bestRecentTime: string | null | undefined;
    dogSex: string | null | undefined;
    trap: string;
    lastRunTime: string | null | undefined;
    rpDogId: Number | null | undefined;
    trainerName: string | null | undefined;
    dogName: string | null | undefined;
    sireName: string | null | undefined;
    preRprRating: string | null | undefined;
    starRating: string | null | undefined;
    form: Array<GreyhoundForm> | null | undefined;
}

export class GreyhoundForm {
    comment: string | null | undefined;
    distance: string | null | undefined;
    sectionalTime: string | null | undefined;
    weight: string | null | undefined;
    grade: string | null | undefined;
    winner: string | null | undefined;
    distanceBeaten: string | null | undefined;
    going: string | null | undefined;
    winnersTime: string | null | undefined;
    trap: string | null | undefined;
    date: string | null | undefined;
    position: string | null | undefined;
    calcTime: string | null | undefined;
    bend: string | null | undefined;
}
