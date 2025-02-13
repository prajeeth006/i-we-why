export class SportBookEvent implements IChannelsObject {
    eventKey: number | null | undefined;
    eventName: string | null | undefined;
    eventStatus: string | null | undefined;
    displayStatus: string | null | undefined;
    displayOrder: number | null | undefined;
    hasBIRMarkets: string | null | undefined;
    eventSort: string | null | undefined;
    eventDateTime: Date | null | undefined;
    isEventStarted: boolean | null | undefined;
    isEventFinished: boolean | null | undefined;
    isEventResulted: boolean | null | undefined;
    isCashoutAvailable: boolean | null | undefined;
    channels: string[] | null | undefined;
    flags: string[] | null | undefined;
    meta: DataMeta | null | undefined;
    raceStage: string | null | undefined;
    offTime: Date | null | undefined;
    categoryName?: string | null | undefined;
    typeName?: string | null | undefined;
    typeFlagCode?: string | null | undefined;
    runnerCount?: number | null | undefined;
    eventTimePlusTypeName?: string | null | undefined;
    typeKey?: string | null | undefined;
}

export class SportBookMarket implements IChannelsObject {
    eventKey: number | null | undefined;
    marketKey: number | null | undefined;
    marketMeaningMajorCode: string | null | undefined;
    marketMeaningMinorCode: string | null | undefined;
    marketName: string | null | undefined;
    marketStatus: string | null | undefined;
    displayOrder: number | null | undefined;
    displayStatus: string | null | undefined;
    marketSort: string | null | undefined;
    marketTypeKey: string | null | undefined;
    isResulted: boolean | null | undefined;
    isResultConfirmed: boolean | null | undefined;
    isCashoutAvailable: boolean | null | undefined;
    betMinStake: string | null | undefined;
    maxAccumulator: string | null | undefined;
    minAccumulator: string | null | undefined;
    marketFlags: string | null | undefined;
    hasRestrictedSet: string | null | undefined;
    isAntepost: boolean | null | undefined;
    isPlaceOnlyAvailable: boolean | null | undefined;
    isEachWayAvailable: string | null | undefined; // TODO maybe string and bellow
    isForecastMarket: string | null | undefined;
    isGpAvailable: boolean | null | undefined;
    isHandicapMarket: boolean | null | undefined;
    isIndexMarket: boolean | null | undefined;
    isLpAvailable: boolean | null | undefined;
    isMarketBIR: boolean | null | undefined;
    isOverUnderMarket: boolean | null | undefined;
    isSpAvailable: boolean | null | undefined;
    isStandardFixedOddsMarket: boolean | null | undefined;
    isTricastMarket: boolean | null | undefined;       // TODO: maybe string and above
    eachWayFactorDen: string | null | undefined;
    eachWayFactorNum: string | null | undefined;
    eachWayPlaces: string | null | undefined;
    eachWayWithBet: string | null | undefined;
    marketGroupID: string | null | undefined;
    channels: string[] | null | undefined;
    meta: DataMeta | null | undefined;
    nCastDividend: NCastDividend | null | undefined;
    nCastDeleteDividend: NCastDividend | null | undefined;
    nCastDividends: NCastDividend[] | null | undefined;
    handicapValue?: number | null | undefined;
}

export class SportBookSelection implements IChannelsObject {
    eventKey: number | null | undefined;
    marketKey: number | null | undefined;
    selectionKey: number | null | undefined;
    selectionName: string | null | undefined;
    selectionStatus: string | null | undefined;
    displayStatus: string | null | undefined;
    displayOrder: number | null | undefined;
    runnerNumber: number | null | undefined;
    outcomeMeaningMajorCode: string | null | undefined;
    outcomeMeaningMinorCode: string | null | undefined;
    channels: Array<string> | null | undefined;
    isResulted: boolean | null | undefined;
    isResultConfirmed: boolean | null | undefined;
    resultCode: string | null | undefined;
    isSettled: boolean | null | undefined;
    suspensionReason: string | null | undefined;
    prices: Prices | null | undefined;
    meta: DataMeta | null | undefined;
    correctScoreHome?: string | null | undefined;
    correctScoreAway?: string | null | undefined;
    price?: string | null | undefined;
    hidePrice?: boolean | null | undefined;
    hideEntry?: boolean | null | undefined;
}

export interface IChannelsObject{
    channels: Array<string> | null | undefined;
    meta: DataMeta | null | undefined;
}

export class Prices {
    price: Array<PriceDetails> | null | undefined;
}

export class PriceDetails {
    numPrice: number | null | undefined;
    denPrice: number | null | undefined;
    selectionPriceType: string | null | undefined
}

export class DataMeta {
    operation: string | null | undefined;
    parents: string | null | undefined;
}

export class NCastDividend {
    validFrom: Date | null | undefined;
    ncastTypeCode: string | null | undefined;
    dividend: string | null | undefined;
}

export class SportBookTempResult {
    newItem: SportBookEventStructured | SportBookMarketStructured | SportBookSelection;
    result: SportBookResult = new SportBookResult();
    isFinished: boolean;
}

export class SportBookResult {
    events: Map<number, SportBookEventStructured> = new Map<number, SportBookEventStructured>();
}

export class SportBookEventStructured extends SportBookEvent {
    markets: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>();
}

export class SportBookMarketStructured extends SportBookMarket {
    selections: Map<number, SportBookSelection> = new Map<number, SportBookSelection>();
}

export class SportBookFinishMessage {
    isFinished: boolean;
}