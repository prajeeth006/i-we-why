import { Game } from '../../../../common/cds-client/models/fixture.model';
import { GantryCommonContent } from '../../../../common/models/gantry-commom-content.model';
import { optionMarkets } from '../../../../common/models/hybrid-fixture.model';

export class MockNFLData {
    Totals: Game = {
        id: 76693584,
        name: {
            value: 'Totals',
            sign: '3If05A==',
        },
        results: [
            {
                id: -2133918758,
                odds: 2.04,
                name: {
                    value: 'Over 45',
                    sign: 'A05EEw==',
                },
                visibility: 'Visible',
                totalsPrefix: 'Over',
                numerator: 21,
                denominator: 20,
                americanOdds: 105,
            },
            {
                id: -2133918757,
                odds: 1.71,
                name: {
                    value: 'Under 45',
                    sign: 'xMFoXw==',
                },
                visibility: 'Visible',
                totalsPrefix: 'Under',
                numerator: 7,
                denominator: 10,
                americanOdds: -140,
            },
        ],
        templateId: 104,
        categoryId: 63,
        resultOrder: 'Default',
        combo1: 'NoEventCombo',
        combo2: 'Single',
        visibility: 'Visible',
        balanced: 1,
        attr: '45',
        spread: 0.33,
        category: 'Gridable',
        templateCategory: {
            id: 63,
            name: {
                value: 'Totals',
                sign: '3If05A==',
            },
            category: 'Gridable',
        },
        isMain: false,
        grouping: {
            gridGroups: ['uepttv0kt'],
            detailed: [],
        },
    };

    FirstHalfSpread: Game = {
        id: 76693585,
        name: {
            value: '1st Half Spread',
            sign: 'BGNUdA==',
        },
        results: [
            {
                id: -2133918756,
                odds: 1.91,
                name: {
                    value: 'Chicago Bears +1,5',
                    sign: 'qrciag==',
                },
                visibility: 'Visible',
                attr: '+1,5',
                numerator: 10,
                denominator: 11,
                americanOdds: -110,
            },
            {
                id: -2133918755,
                odds: 1.81,
                name: {
                    value: 'Las Vegas Aces -1,5',
                    sign: 'MuR+bA==',
                },
                visibility: 'Visible',
                attr: '-1,5',
                numerator: 4,
                denominator: 5,
                americanOdds: -125,
            },
        ],
        templateId: 364,
        categoryId: 738,
        resultOrder: 'Default',
        combo1: 'NoSportCombo',
        combo2: 'Single',
        visibility: 'Visible',
        balanced: 1,
        spread: 0.1,
        category: 'Gridable',
        templateCategory: {
            id: 738,
            name: {
                value: 'Halftime Spread',
                sign: 'LruvGg==',
            },
            category: 'Gridable',
        },
        isMain: false,
        grouping: {
            gridGroups: ['srox7vjhp'],
            detailed: [],
        },
    };

    staticContent: GantryCommonContent = {
        contentParameters: {
            Abandoned: 'ABANDONED',
            Away: 'AWAY',
            CoralPrice: 'EARLY PRICE',
            Draw: 'DRAW',
            Eighteen: '18',
            EventTimeInfo: '{0}',
            Home: 'HOME',
            LiveShow: 'LIVE PRICE',
            Odds: 'ODDS',
            PhotoFinish: 'PHOTO FINISH',
            Places: 'PLACES',
            RaceOff: 'RACE OFF',
            SeventeenNumber: '17',
            StewardsEnquiry: 'STEWARDS ENQUIRY',
            Time: 'TIME',
            Today: 'TODAY',
            Tomorrow: 'TOMORROW',
            TwentyOneNumber: '21',
            VirtualRacing: 'VIRTUAL RACING',
            WeekendCoupon: 'FEATURED FOOTBALL',
            WinningDistanceMaxDistancePerRace: 'MAX DISTANCE PER RACES = JUMPS 30L (WALKOVER 12L) / FLAT 12L (WALKOVER 5L)',
            WinOnly: 'WIN ONLY',
            Withdrawn: 'WITHDRAWN',
            ManualBottomStipLine: 'PRICES ARE SUBJECT TO CHANGE AND SHOULD BE TREATED AS A GUIDE',
            EachWay: 'EACH-WAY',
            MultiMatchFooter: 'PRICES LISTED ARE AVAILABLE VIA BETSTATION',
            LeftStipulatedLine: 'ALL PRICES FROM BETSTATION AND SUBJECT TO FLUCTUATION',
            TotalPoints: 'TOTAL POINTS',
            MoneyLine1: 'MONEY LINE',
            Spread: 'SPREAD',
            FirstHalfMoneyLine: '1ST HALF MONEY LINE',
            FirstHalfSpread: '1ST HALF SPREAD',
        },
    };

    Totals1: optionMarkets = {
        id: 65031242,
        name: {
            value: 'Totals',
        },
        status: 'Visible',
        options: [
            {
                id: -2098276876,
                status: 'Visible',
                name: {
                    value: 'Over 45',
                },
                price: {
                    id: -1,
                    numerator: 7,
                    denominator: 4,
                    odds: 2.75,
                    americanOdds: 175,
                },
            },
            {
                id: -2098276875,
                status: 'Visible',
                name: {
                    value: 'Under 45',
                },
                price: {
                    id: -1,
                    numerator: 13,
                    denominator: 2,
                    odds: 7.69,
                    americanOdds: 675,
                },
            },
        ],
        parameters: [
            {
                key: 'TemplateId',
                type: 'Integer',
                value: '104',
            },
            {
                key: 'CategoryId',
                type: 'Integer',
                value: '63',
            },
        ],
    };

    MoneyLine: optionMarkets = {
        id: 65031239,
        name: {
            value: 'Money Line',
        },
        status: 'Visible',
        options: [
            {
                id: -2098276882,
                status: 'Visible',
                name: {
                    value: 'Green Bay',
                },
                sourceName: {
                    value: '1',
                    sign: 'T+qo0w==',
                },
                price: {
                    id: -1,
                    numerator: 21,
                    denominator: 20,
                    odds: 2.05,
                    americanOdds: 105,
                },
            },
            {
                id: -2098276881,
                status: 'Visible',
                name: {
                    value: 'Tampa Bay',
                },
                sourceName: {
                    value: '2',
                    sign: 'tnAHzQ==',
                },
                price: {
                    id: -1,
                    numerator: 10,
                    denominator: 21,
                    odds: 1.48,
                    americanOdds: -210,
                },
            },
        ],
        parameters: [
            {
                key: 'TemplateId',
                type: 'Integer',
                value: '262',
            },
            {
                key: 'CategoryId',
                type: 'Integer',
                value: '58',
            },
        ],
    };

    Spread: optionMarkets = {
        id: 65031241,
        name: {
            value: 'Spread',
        },
        status: 'Visible',
        options: [
            {
                id: -2098276878,
                status: 'Visible',
                name: {
                    value: 'Green Bay Packers +1,5',
                },
                price: {
                    id: -1,
                    numerator: 21,
                    denominator: 20,
                    odds: 2.04,
                    americanOdds: 105,
                },
            },
            {
                id: -2098276877,
                status: 'Visible',
                name: {
                    value: 'Tampa Bay Buccaneers -1.5',
                },
                price: {
                    id: -1,
                    numerator: 6,
                    denominator: 4,
                    odds: 2.48,
                    americanOdds: 150,
                },
            },
        ],
        parameters: [
            {
                key: 'TemplateId',
                type: 'Integer',
                value: '103',
            },
            {
                key: 'CategoryId',
                type: 'Integer',
                value: '57',
            },
        ],
    };

    HalfMoney: optionMarkets = {
        id: 65031238,
        name: {
            value: '1st Half Money Line',
        },
        status: 'Visible',
        options: [
            {
                id: -2098276884,
                status: 'Visible',
                name: {
                    value: 'Green Bay',
                },
                sourceName: {
                    value: '1',
                    sign: 'iHqUBw==',
                },
                price: {
                    id: -1,
                    numerator: 1,
                    denominator: 14,
                    odds: 1.07,
                    americanOdds: -1400,
                },
            },
            {
                id: -2098276883,
                status: 'Visible',
                name: {
                    value: 'Tampa Bay',
                },
                sourceName: {
                    value: '2',
                    sign: 'ceA7GQ==',
                },
                price: {
                    id: -1,
                    numerator: 1,
                    denominator: 20,
                    odds: 1.05,
                    americanOdds: -2000,
                },
            },
        ],
        parameters: [
            {
                key: 'TemplateId',
                type: 'Integer',
                value: '11304',
            },
            {
                key: 'CategoryId',
                type: 'Integer',
                value: '58',
            },
        ],
    };

    HalfSpread: optionMarkets = {
        id: 65031240,
        name: {
            value: '1st Half Spread',
        },
        status: 'Visible',
        options: [
            {
                id: -2098276880,
                status: 'Visible',
                name: {
                    value: 'Green Bay Packers +1,5',
                },
                price: {
                    id: -1,
                    numerator: 13,
                    denominator: 5,
                    odds: 3.59,
                    americanOdds: 260,
                },
            },
            {
                id: -2098276879,
                status: 'Visible',
                name: {
                    value: 'Tampa Bay Buccaneers -1.5',
                },
                price: {
                    id: -1,
                    numerator: 19,
                    denominator: 4,
                    odds: 5.8,
                    americanOdds: 475,
                },
            },
        ],
        parameters: [
            {
                key: 'TemplateId',
                type: 'Integer',
                value: '364',
            },
            {
                key: 'CategoryId',
                type: 'Integer',
                value: '738',
            },
        ],
    };
}
