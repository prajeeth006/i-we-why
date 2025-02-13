import { GreyhoundStaticContent } from './greyhound-racing-template.model';

export class GreyhoundMeetingResultsTemplate {
    title: string | null | undefined;
    eventName: string | null | undefined;
    eventLogo?: string | null | undefined;
    isMarketSettled: boolean | null | undefined;
    isUKIrishCountry: boolean | null | undefined;
    greyhoundStaticContent: GreyhoundStaticContent;
    greyhoundMeetingResultsTable: Array<GreyhoundMeetingResults> = [];
    isVirtualRace: boolean | null | undefined;
}

export class GreyhoundMeetingResults {
    time?: string | null | undefined;
    foreCast: string | null | undefined;
    triCast: string | null | undefined;
    eachWayTerms: string;
    runnerList: Array<GreyhoundMeetingRunnerDetails> = [];
    eventDateTime?: Date | null | undefined;
    eventId?: number | null | undefined;
    isDeadHeat: boolean | null | undefined;
    sortedTricast?: string;
    vacantTraps?: string | null | undefined;
}

export class GreyhoundMeetingRunnerDetails {
    position: string | null | undefined;
    runnerNumber: string | null | undefined;
    favourite: string | null | undefined;
    price: string | null | undefined;
    imgSrc: string | null | undefined;
    isDeadHeat: boolean | null | undefined;
    eventId?: number | null | undefined;
}
