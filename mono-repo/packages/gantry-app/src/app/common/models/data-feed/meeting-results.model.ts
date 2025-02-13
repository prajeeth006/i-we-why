export class MeetingTempResult {
    newItem: MeetingResultContent;
    result: MeetingResultMap = new MeetingResultMap();
}

export class MeetingResultMap {
    types: Map<number, MeetingResultContent> = new Map<number, MeetingResultContent>();
}

export class MeetingResultContent {
    resultingContent: ResultingContent;
}

export class ResultingContent {
    eventId: number | null | undefined;
    typeId: string | null | undefined;
    eventName: string | null | undefined; //2 2nd header = RESULTS COMPLETE
    eventTime: string; //1 header
    runnerCount: number | null | undefined; //5 4th header
    raceOffTime: string; //6 5th header
    resultMarket: ResultMarket;
    isStewardEnquiry: boolean | null | undefined;
    isAbandonedRace: boolean | null | undefined;
    isPhotoFinish: boolean | null | undefined;
    stewardsState: string | null | undefined;
    isVoidRace: boolean;
    typeFlagCode: string;
    eventDateTime: Date;
    category: number | null | undefined;
    marketSettledTime?: Date | null | undefined;
    isResultAmended?: boolean = false;
    isMarketResulted: boolean | null | undefined;
    isMarketSettled: boolean | null | undefined;
    displayStatus?: string;
}

export class ResultMarket {
    marketKey: number | null | undefined;
    foreCast: string; //7 top
    triCast: string; //7 bottom
    exacta: string; //10 (8th header = EXACTA content = stringdata) if only exacta present
    trifecta: string; // 8th header = content = EXACTA \n stringdata \n TRIFECTA \n stringdata
    win: string; //8 6th header
    place: string | null | undefined; // comma separated list - 9 7th header = PLACE content = array data
    get placeList(): Array<string> {
        if (!this.place) {
            return [];
        }

        const placeList = this.place.split(',').filter((place) => place != '');

        return placeList;
    }
    jackPot?: string | null | undefined;
    placePot: string | null | undefined;
    quadPot: string | null | undefined;
    eachWays: string; //4 3rd col header
    listOfSelections: Array<ResultSelection>;
    isMarketSettled: boolean | null | undefined;
    placeDividends?: Array<PlaceDividend>;
    stewardsState: string | null | undefined;
    isAbandonedRace: boolean | null | undefined;
    isPhotoFinish: boolean | null | undefined;
    sortedTricast: any;
}

export class ResultSelection {
    selectionName: string;
    selectionId: number | null | undefined;
    position: string;
    startingPrice: number | null | undefined;
    runnerNumber: number;
    startingPriceFraction: string;
    isDeadHeat: boolean;
    favourite: string;
    resultCode: string | null | undefined;
}

export class PlaceDividend {
    position: string | null | undefined;
    runnerNumber: string | null | undefined;
    dividend: string | null | undefined;
}
