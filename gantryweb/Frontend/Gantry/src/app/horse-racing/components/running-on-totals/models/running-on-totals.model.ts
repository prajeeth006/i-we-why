import { PaginationContent } from "src/app/common/models/pagination/pagination.models";
import { HorseRacingContent } from "src/app/horse-racing/models/horseracing-content.model";

export class RunningTempResult {
    newItem: RunningResultContent;
    result: RunningResultMap = new RunningResultMap();
}

export class RunningResultMap {
    types: Map<string, RunningResultContent> = new Map<string, RunningResultContent>();
}

export class RunningResultContent {
    runningOnTotals: RunningOnTotals
}

export class RunningOnTotalsContent extends PaginationContent {
    typeDetails: Array<RunningOnTotals> = [];
    horseRacingContent: HorseRacingContent;
    distanceAfterRace: string;
}

export class RunningOnTotals{
    rpCourseId: string| null | undefined;
    rpTrackId: string| null | undefined;
    rpCourseName:string| null | undefined;
    rpTrackName: string| null | undefined;
    date: string| null | undefined;
    selectionName: string | null | undefined;
    distanceToWinner : number| null | undefined;
    eventIds: Map<string, Array<number>>  = new Map<string,  Array<number>>();
    racesFinished: number| null | undefined;;
    openBetTypeIds: Array<string> = [];
    isResulted: boolean| null | undefined;
    raceDateTime?: string | null | undefined;
}

export enum Label{
    DISTANCEAFTERRACE = "DISTANCE AFTER RACE"
}