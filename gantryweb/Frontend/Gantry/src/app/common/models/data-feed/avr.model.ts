
export class AvrTempResult {
    newItem: AvrResult;
    result: AvrEventMap = new AvrEventMap();
    messageMap: AvrMessageTypeMap = new AvrMessageTypeMap();
}

export class AvrEventMap {
    eventIds: Map<number, AvrMessageTypeMap> = new Map<number, AvrMessageTypeMap>();
}

export class AvrMessageTypeMap {
    messageTypes: Map<string, AvrResult> = new Map<string, AvrResult>();
}

export class AvrResult {
    avr: AvrContent;
}

export class AvrContent {
    virtualEventKey: string | null | undefined;
    eventName: string | null | undefined;
    maxPayout: string | null | undefined;
    meetingID: string | null | undefined;
    numOfRacers: string | null | undefined;
    eventId: string | null | undefined;
    eventType: string | null | undefined;
    noMoreBetsTime: string | null | undefined;
    oddsType: string | null | undefined;
    numEachWay: string | null | undefined;
    internalName: string | null | undefined;
    winnerFinishedAtFrame: string | null | undefined;
    stockCars: string | null | undefined;
    courseIsJumps: string | null | undefined;
    useJockeyCam: string | null | undefined;
    commScriptName: string | null | undefined;
    distance: string | null | undefined;
    type: string | null | undefined;
    going: string | null | undefined;
    doCommentary: string | null | undefined;
    weatherCondition: string | null | undefined;
    localizedEventName: string | null | undefined;
    preambleDuration: string | null | undefined;
    countdownToNMB: string | null | undefined;
    eventSeed: string | null | undefined;
    raceLength: number | null | undefined;
    eventDateTime: string | null | undefined;
    markets: AvrMarkets | null | undefined;
    previousEvents: Array<AvrPreviousEvents> | null | undefined;
    tags: Array<AvrTags> | null | undefined;
    racers: Array<AvrRacers> | null | undefined;
    meta: AvrMeta | null | undefined;
}

export class AvrMarkets {
    num: number | null | undefined;
    market: Array<AvrMarket> | null | undefined;
}

export class AvrMarket {
    marketKey: number | null | undefined;
    marketTypeKey: string | null | undefined;
    fcDividend: number | null | undefined;
    tcDividend: number | null | undefined;
    selections: AvrSelections | null | undefined;
    key: string | null | undefined;
}

export class AvrSelections {
    selection: Array<AvrSelection> | null | undefined;
}

export class AvrSelection {
    selectionKey: number | null | undefined;
    runnerNumber: number | null | undefined;
    finalPosition: number | null | undefined;
    place: number | null | undefined;
    key: string | null | undefined;
}

export class AvrPreviousEvents {
    first: string | null | undefined;
    second: string | null | undefined;
    third: string | null | undefined;
    gameId: string | null | undefined;
    preambleDuration: string | null | undefined;
    countdownToNMB: string | null | undefined;
}

export class AvrTags {
    name: string | null | undefined;
    value: string | null | undefined;
}

export class AvrRacers {
    num: string | null | undefined;
    lane: string | null | undefined;
    name: string | null | undefined;
    price: string | null | undefined;
    fav: string | null | undefined;
    probWin: string | null | undefined;
    form: string | null | undefined;
    racerTextureID: string | null | undefined;
    rank: string | null | undefined;
    human: string | null | undefined;
    humanTextureID: string | null | undefined;
    place: string | null | undefined;
}

export class AvrMeta {
    typeKey: number | null | undefined;
    messageType: string | null | undefined;
    recordModifiedTime: string | null | undefined;
    controllerId: string | null | undefined;
}