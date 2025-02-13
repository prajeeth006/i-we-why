import { Observable } from 'rxjs';

import { AvrContent } from './avr-result-content.model';

export class AvrTemplate {
    eventName: string;
    runnerCount: string | null | undefined;
    distance: string | null | undefined;
    eachWay: string | null | undefined;
    eachWayOnTemplate: string;
    resultsTable: Array<ResultDetails> = [];
    forecast: string | null | undefined;
    tricast: string | null | undefined;
    numEachWay: string | null | undefined;
    staticContent: AvrContent;
    isResultedOrOff: boolean | null | undefined;
    avrEventType: string;
    backgroundImageUrl: string | null | undefined;
    brandImageUrl: string | null | undefined;
    tvBrandImageUrl: string | null | undefined;
    counterValue$: Observable<string> | null | undefined;
    countdownToOffTitle: string | null | undefined;
    racingImage: string;
    isOverlay: boolean;
}

export class ResultDetails {
    position: string | null | undefined;
    imageSourceUrl: string | null | undefined;
    runnerNumber: string | null | undefined;
    runnerName: string | null | undefined;
    price: string | null | undefined;
    favourite: string;
    isFavourite: boolean | null | undefined;
}
