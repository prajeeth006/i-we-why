import {
    NCastDividend,
    SportBookEventStructured,
    SportBookMarketStructured,
    SportBookSelection,
} from '../../common/models/data-feed/sport-bet-models';

export class MockData {
    market: SportBookMarketStructured = {
        eventKey: 5525034,
        marketKey: 158856378,
        marketMeaningMajorCode: '-',
        marketMeaningMinorCode: '--',
        marketName: 'KHAN QWERTY QWERTY QWERTY ',
        marketStatus: 'Active',
        displayOrder: 1,
        displayStatus: 'Displayed',
        marketSort: '--',
        marketTypeKey: '-',
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: false,
        maxAccumulator: '25',
        minAccumulator: '1',
        hasRestrictedSet: 'N',
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: 'false',
        isForecastMarket: 'false',
        eachWayWithBet: 'Y',
        marketGroupID: '3017424',
        channels: ['K', 'a', 'b'],
        meta: {
            operation: 'create',
            parents: 'c.21:cl.226:t.114108:e.5525034',
        },
        betMinStake: '',
        marketFlags: '',
        isGpAvailable: false,
        isHandicapMarket: false,
        isIndexMarket: false,
        isLpAvailable: false,
        isMarketBIR: false,
        isOverUnderMarket: false,
        isSpAvailable: false,
        isStandardFixedOddsMarket: false,
        isTricastMarket: false,
        eachWayFactorDen: '',
        eachWayFactorNum: '',
        eachWayPlaces: '',
        nCastDividend: new NCastDividend(),
        nCastDeleteDividend: new NCastDividend(),
        nCastDividends: [],
        selections: undefined,
    };

    selection: SportBookSelection = {
        eventKey: 5525034,
        marketKey: 158856378,
        selectionKey: 507529080,
        selectionName: ' WIN BY 7.5 LENGTHS OR UNDER',
        selectionStatus: 'Active',
        displayStatus: 'Displayed',
        displayOrder: 1,
        runnerNumber: 1,
        outcomeMeaningMajorCode: '-',
        outcomeMeaningMinorCode: '-',
        channels: ['K', 'a', 'b'],
        isResulted: false,
        isResultConfirmed: false,
        resultCode: 'Unset',
        isSettled: false,
        suspensionReason: '-',
        prices: {
            price: [
                {
                    numPrice: 1,
                    denPrice: 10000,
                    selectionPriceType: 'LP',
                },
                {
                    numPrice: 1,
                    denPrice: 1,
                    selectionPriceType: 'LP',
                },
            ],
        },
        meta: {
            operation: 'update',
            parents: 'c.21:cl.226:t.114108:e.5525034:m.158856378',
        },
        hideEntry: false,
        hidePrice: false,
        price: '1/10000',
    };
    selection1: SportBookSelection = {
        eventKey: 5525034,
        marketKey: 158856378,
        selectionKey: 507529080,
        selectionName: 'KHAN QWERTY QWERTY QWERTY ',
        selectionStatus: 'Active',
        displayStatus: 'Displayed',
        displayOrder: 1,
        runnerNumber: 1,
        outcomeMeaningMajorCode: '-',
        outcomeMeaningMinorCode: '-',
        channels: ['K', 'a', 'b'],
        isResulted: false,
        isResultConfirmed: false,
        resultCode: 'Unset',
        isSettled: false,
        suspensionReason: '-',
        prices: {
            price: [
                {
                    numPrice: 1,
                    denPrice: 10000,
                    selectionPriceType: 'LP',
                },
                {
                    numPrice: 1,
                    denPrice: 1,
                    selectionPriceType: 'LP',
                },
            ],
        },
        meta: {
            operation: 'update',
            parents: 'c.21:cl.226:t.114108:e.5525034:m.158856378',
        },
        hideEntry: false,
        hidePrice: false,
        price: '1/10000',
    };

    sportBookEventMock: SportBookEventStructured = {
        markets: new Map<number, SportBookMarketStructured>(),
        eventKey: 5525034,
        eventName: '16:55 KEMPTON',
        typeName: 'WINNING DISTANCES',
        typeKey: '114108',
        categoryName: 'HORSE RACING',
        eventStatus: 'Active',
        displayStatus: 'Displayed',
        displayOrder: 0,
        eventDateTime: new Date(), // Placeholder, replace with actual date
        raceStage: 'Race Stage', // Placeholder, replace with actual race stage
        offTime: new Date(), // Placeholder, replace with actual off time
        hasBIRMarkets: 'false',
        eventSort: 'MTCH',
        isEventStarted: false,
        isEventFinished: false,
        isEventResulted: false,
        isCashoutAvailable: true,
        channels: ['K', 'a', 'b'],
        meta: {
            operation: 'create',
            parents: 'c.21:cl.226:t.114108',
        },
        eventTimePlusTypeName: '2:15  KEMPTON',
        typeFlagCode: '',
        flags: [],
    };

    constructor() {
        this.sportBookEventMock.markets.set(158856378, this.market);
    }
}
