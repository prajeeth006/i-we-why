import { Observable } from "rxjs";
import { AvrContent } from "./avr-result-content.model";

export class AvrTemplate {
    eventName: string | null | undefined;
    runnerCount: string | null | undefined;
    distance: string | null | undefined;
    eachWay: string | null | undefined;
    resultsTable: Array<ResultDetails> = [];
    forecast: string | null | undefined;
    tricast: string | null | undefined;
    numEachWay: string | null | undefined;
    staticContent: AvrContent | null | undefined;
    isResultedOrOff: boolean | null | undefined;
    avrEventType: string | null | undefined;
    backgroundImageUrl: string | null | undefined;
    brandImageUrl: string | null | undefined;
    counterValue$: Observable<string> | null | undefined;
    countdownToOffTitle: string | null | undefined;
}

export class ResultDetails {
    position: string | null | undefined;
    imageSourceUrl: string | null | undefined;
    runnerNumber: string | null | undefined;
    runnerName: string | null | undefined;
    price: string | null | undefined;
    favourite: string | null | undefined;
    isFavourite: boolean | null | undefined;
}