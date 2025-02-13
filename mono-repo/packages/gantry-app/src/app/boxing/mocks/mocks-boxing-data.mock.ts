import {
    NCastDividend,
    SportBookEventStructured,
    SportBookMarketStructured,
    SportBookResult,
    SportBookSelection,
} from '../../common/models/data-feed/sport-bet-models';
import { BoxingDataContent } from '../models/boxing-content.model';

export class MockBoxingData {
    eventId: '1953704';

    marketIds: '79907388,79908265,79908108';

    leadTitle: 'BOXING';
    additionalInfo: 'ADDITIONAL INFORMATION';
    optionalInfo: 'OPTIONAL ADDITIONAL INFORMATION';
    onRequest: 'OTHERS ON REQUEST';
    moreMarkets: 'MORE MARKETS AVAILABLE ON BETSTATION';
    eventName: 'DANIEL JACOBS VS JOHN RYDER';

    boxingMockDataContent: BoxingDataContent = {
        contentParameters: {
            AdditionalInfo: '{0}',
            ByDecisionorTechnicalDecision: 'BY DECISION OR TECHNICAL DECISION',
            Draw: 'DRAW',
            KOorTKOorDisqualification: 'KO / TKO / DISQUALIFICATION|KO or TKO or DISQUALIFICATION',
            LeadTitle: 'BOXING',
            MethodOfVictory: 'METHOD OF VICTORY',
            MoreMarkets: 'MORE MARKETS AVAILABLE ON BETSTATION',
            OnRequest: 'OTHERS ON REQUEST',
            OptionalInfo: 'OPTIONAL ADDITIONAL INFO',
            RoundBetting: 'ROUND BETTING',
            RoundGroupBetting: 'WINNING GROUP OF ROUNDS',
            Today: 'TODAY',
            Tomorrow: 'TOMORROW',
        },
    };

    mainEventInfoPanel: {
        homeFighterDetails: {
            betName: 'DANIEL JACOBS';
            betOdds: '5 / 6';
        };
        awayFighterDetails: {
            betName: 'JOHN RYDER';
            betOdds: '2 / 6';
        };
        drawDetails: {
            betName: 'DRAW';
            betOdds: '5 / 6';
        };
    };
    roundBettingInfoPanel: {
        homeTeamListDetails: [
            {
                betName: 'Round 1';
                betOdds: '1 / 6';
                order: '1';
            },
            {
                betName: 'Round 2';
                betOdds: '2 / 6';
                order: '2';
            },
            {
                betName: 'Round 3';
                betOdds: '3 / 6';
                order: '3';
            },
            {
                betName: 'Round 4';
                betOdds: '4 / 6';
                order: '4';
            },
            {
                betName: 'Round 5';
                betOdds: '5 / 6';
                order: '5';
            },
            {
                betName: 'Round 6';
                betOdds: '6 / 6';
                order: '6';
            },
            {
                betName: 'Round 7';
                betOdds: '7 / 6';
                order: '7';
            },
            {
                betName: 'Round 8';
                betOdds: '8 / 6';
                order: '8';
            },
        ];
        awayTeamListDetails: [
            {
                betName: 'Round 1';
                betOdds: '11 / 6';
                order: '1';
            },
            {
                betName: 'Round 2';
                betOdds: '22 / 6';
                order: '2';
            },
            {
                betName: 'Round 3';
                betOdds: '33 / 6';
                order: '3';
            },
            {
                betName: 'Round 4';
                betOdds: '44 / 6';
                order: '4';
            },
            {
                betName: 'Round 5';
                betOdds: '55 / 6';
                order: '5';
            },
            {
                betName: 'Round 6';
                betOdds: '66 / 6';
                order: '6';
            },
            {
                betName: 'Round 7';
                betOdds: '77 / 6';
                order: '7';
            },
            {
                betName: 'Round 8';
                betOdds: '88 / 6';
                order: '8';
            },
        ];
    };
    groupRoundBettingInfoPanel: {
        homeTeamListDetails: [
            {
                betName: 'Round 1';
                betOdds: '1 / 6';
                order: '1';
            },
            {
                betName: 'Round 2';
                betOdds: '2 / 6';
                order: '2';
            },
            {
                betName: 'Round 3';
                betOdds: '3 / 6';
                order: '3';
            },
            {
                betName: 'Round 4';
                betOdds: '4 / 6';
                order: '4';
            },
            {
                betName: 'Round 5';
                betOdds: '5 / 6';
                order: '5';
            },
            {
                betName: 'Round 6';
                betOdds: '6 / 6';
                order: '6';
            },
            {
                betName: 'Round 7';
                betOdds: '7 / 6';
                order: '7';
            },
            {
                betName: 'Round 8';
                betOdds: '8 / 6';
                order: '8';
            },
        ];
        awayTeamListDetails: [
            {
                betName: 'Round 1';
                betOdds: '11 / 6';
                order: '1';
            },
            {
                betName: 'Round 2';
                betOdds: '22 / 6';
                order: '2';
            },
            {
                betName: 'Round 3';
                betOdds: '33 / 6';
                order: '3';
            },
            {
                betName: 'Round 4';
                betOdds: '44 / 6';
                order: '4';
            },
            {
                betName: 'Round 5';
                betOdds: '55 / 6';
                order: '5';
            },
            {
                betName: 'Round 6';
                betOdds: '66 / 6';
                order: '6';
            },
            {
                betName: 'Round 7';
                betOdds: '77 / 6';
                order: '7';
            },
            {
                betName: 'Round 8';
                betOdds: '88 / 6';
                order: '8';
            },
        ];
    };
    homeFighterTitle: 'DANIEL JACOBS';
    awayFighterTitle: 'JOHN RYDER';

    selectionsFightMarket: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                eventKey: 1953704,
                marketKey: 79907388,
                selectionKey: 278403730,
                selectionName: 'DRAW',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 2,
                outcomeMeaningMajorCode: 'D',
                outcomeMeaningMinorCode: 'D',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79731778',
                },
                prices: {
                    price: [
                        {
                            numPrice: 8,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 7,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 13,
                            denPrice: 2,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            1,
            {
                eventKey: 1953704,
                marketKey: 79907388,
                selectionKey: 266644950,
                selectionName: 'DANIEL JACOBS',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 1,
                outcomeMeaningMajorCode: 'H',
                outcomeMeaningMinorCode: 'H',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79731778',
                },
                prices: {
                    price: [
                        {
                            numPrice: 1,
                            denPrice: 9,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 1,
                            denPrice: 8,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 1,
                            denPrice: 7,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            2,
            {
                eventKey: 1953704,
                marketKey: 79907388,
                selectionKey: 266645096,
                selectionName: 'JOHN RYDER',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 3,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79731778',
                },
                prices: {
                    price: [
                        {
                            numPrice: 22,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 20,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 18,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
    ]);

    fightBettingMarket: SportBookMarketStructured = {
        eventKey: 1953704,
        marketKey: 79907388,
        marketMeaningMajorCode: '-',
        marketMeaningMinorCode: 'MR',
        marketName: 'Fight Betting',
        marketStatus: 'Active',
        displayOrder: 0,
        displayStatus: 'Displayed',
        isGpAvailable: false,
        isHandicapMarket: false,
        isIndexMarket: false,
        isLpAvailable: true,
        isMarketBIR: false,
        isOverUnderMarket: false,
        isSpAvailable: false,
        isStandardFixedOddsMarket: true,
        channels: ['a', 'R', 'b', 'c', 'd', 'K'],
        meta: {
            operation: 'create',
            parents: 'c.9:cl.56:t.147:e.1953704',
        },
        selections: this.selectionsFightMarket,
        marketSort: '',
        marketTypeKey: '',
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: false,
        betMinStake: '',
        maxAccumulator: '',
        minAccumulator: '',
        marketFlags: '',
        hasRestrictedSet: '',
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: '',
        isForecastMarket: '',
        isTricastMarket: false,
        eachWayFactorDen: '',
        eachWayFactorNum: '',
        eachWayPlaces: '',
        eachWayWithBet: '',
        marketGroupID: '',
        nCastDividend: new NCastDividend(),
        nCastDividends: [],
        nCastDeleteDividend: undefined,
    };

    roundBettingSelection: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278405040,
                selectionName: '|Daniel Jacobs| -|Round 3|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 5,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            1,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278410746,
                selectionName: '|Daniel Jacobs| -|Round 7|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'H',
                outcomeMeaningMinorCode: 'H',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 1,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            2,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278410408,
                selectionName: '|John Ryder| -|Round 5|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'H',
                outcomeMeaningMinorCode: 'H',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 2,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            3,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278405788,
                selectionName: '|Daniel Jacobs| -|Round 6|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 3,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            4,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278410283,
                selectionName: 'John Ryder| -|Round 1|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'H',
                outcomeMeaningMinorCode: 'H',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 7,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            5,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278410749,
                selectionName: '|Daniel Jacobs| -|Round 8|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'H',
                outcomeMeaningMinorCode: 'H',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 6,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            6,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278405041,
                selectionName: '|Daniel Jacobs| -|Round 4|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 4,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            7,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 266646957,
                selectionName: '|Daniel Jacobs| -|Round 1|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'H',
                outcomeMeaningMinorCode: 'H',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 9,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 3,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            8,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278405786,
                selectionName: '|Daniel Jacobs| -|Round 5|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 1,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            9,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 266647053,
                selectionName: '|Daniel Jacobs| -|Round 2|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'H',
                outcomeMeaningMinorCode: 'H',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 5,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            10,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278411444,
                selectionName: 'John Ryder| -|Round 7|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'H',
                outcomeMeaningMinorCode: 'H',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 4,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            11,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278410401,
                selectionName: 'John Ryder| -|Round 4|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 2,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            12,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278412869,
                selectionName: 'John Ryder| -|Round 8|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 2,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            13,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278410322,
                selectionName: 'John Ryder| -|Round 2|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 2,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            14,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278410323,
                selectionName: 'John Ryder| -|Round 3|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 2,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
        [
            15,
            {
                eventKey: 1953704,
                marketKey: 79908265,
                selectionKey: 278410454,
                selectionName: 'John Ryder| -|Round 6|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: 'A',
                outcomeMeaningMinorCode: 'A',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 2,
                            denPrice: 12,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908265',
                },
                runnerNumber: 0,
                correctScoreAway: '',
                correctScoreHome: '',
            },
        ],
    ]);

    roundBetting: SportBookMarketStructured = {
        eventKey: 1953704,
        marketKey: 79908265,
        marketMeaningMajorCode: '-',
        marketMeaningMinorCode: '--',
        marketName: 'Round Betting',
        marketStatus: 'Active',
        displayOrder: 10,
        displayStatus: 'Displayed',
        isGpAvailable: false,
        isHandicapMarket: false,
        isIndexMarket: false,
        isLpAvailable: true,
        isMarketBIR: false,
        isOverUnderMarket: false,
        isSpAvailable: false,
        isStandardFixedOddsMarket: true,
        channels: ['a', 'R', 'b', 'c', 'd', 'K'],
        meta: { operation: 'create', parents: 'c.9:cl.56:t.147:e.1953704' },
        selections: this.roundBettingSelection,
        marketSort: '',
        marketTypeKey: '',
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: false,
        betMinStake: '',
        maxAccumulator: '',
        minAccumulator: '',
        marketFlags: '',
        hasRestrictedSet: '',
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: '',
        isForecastMarket: '',
        isTricastMarket: false,
        eachWayFactorDen: '',
        eachWayFactorNum: '',
        eachWayPlaces: '',
        eachWayWithBet: '',
        marketGroupID: '',
        nCastDividend: new NCastDividend(),
        nCastDividends: [],
        nCastDeleteDividend: undefined,
    };

    groupRoundBettingSelection: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                eventKey: 1950394,
                marketKey: 79908108,
                selectionKey: 278418214,
                selectionName: 'Daniel Jacobs - Rounds 10-12',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 4,
                outcomeMeaningMajorCode: 'S',
                outcomeMeaningMinorCode: 'S',
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                correctScoreHome: '3',
                correctScoreAway: '0',
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908108',
                },
                prices: {
                    price: [
                        {
                            numPrice: 13,
                            denPrice: 2,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 7,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 13,
                            denPrice: 2,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                runnerNumber: 0,
            },
        ],
        [
            1,
            {
                eventKey: 1950394,
                marketKey: 79908108,
                selectionKey: 266646694,
                selectionName: '|Daniel Jacobs| - | Rounds 1-3|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 31,
                outcomeMeaningMajorCode: 'S',
                outcomeMeaningMinorCode: 'S',
                runnerNumber: 0,
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                correctScoreHome: '0',
                correctScoreAway: '1',
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908108',
                },
                prices: {
                    price: [
                        {
                            numPrice: 80,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 70,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 66,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
            },
        ],
        [
            2,
            {
                eventKey: 1950394,
                marketKey: 79908108,
                selectionKey: 278420588,
                selectionName: '|John Ryder| - |Rounds 4-6|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 12,
                outcomeMeaningMajorCode: 'S',
                outcomeMeaningMinorCode: 'S',
                runnerNumber: 0,
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                correctScoreHome: '5',
                correctScoreAway: '1',
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908108',
                },
                prices: {
                    price: [
                        {
                            numPrice: 16,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 18,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 20,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
            },
        ],
        [
            3,
            {
                eventKey: 1950394,
                marketKey: 79908108,
                selectionKey: 278420636,
                selectionName: '|John Ryder| - |Rounds 10-12|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 32,
                outcomeMeaningMajorCode: 'S',
                outcomeMeaningMinorCode: 'S',
                runnerNumber: 0,
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                correctScoreHome: '0',
                correctScoreAway: '2',
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908108',
                },
                prices: {
                    price: [
                        {
                            numPrice: 150,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 125,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 100,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
            },
        ],
        [
            4,
            {
                eventKey: 1950394,
                marketKey: 79908108,
                selectionKey: 278417582,
                selectionName: '|Daniel Jacobs| - | Rounds 7-9|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 33,
                outcomeMeaningMajorCode: 'S',
                outcomeMeaningMinorCode: 'S',
                runnerNumber: 0,
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                correctScoreHome: '1',
                correctScoreAway: '2',
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908108',
                },
                prices: {
                    price: [
                        {
                            numPrice: 55,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 50,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 45,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
            },
        ],
        [
            5,
            {
                eventKey: 1950394,
                marketKey: 79908108,
                selectionKey: 266646794,
                selectionName: '|Daniel Jacobs| - | Rounds 4-6|',
                selectionStatus: 'Suspended',
                displayStatus: 'NotDisplayed',
                displayOrder: 39,
                outcomeMeaningMajorCode: 'S',
                outcomeMeaningMinorCode: 'S',
                runnerNumber: 0,
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                correctScoreHome: '2',
                correctScoreAway: '4',
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908108',
                },
                prices: {
                    price: [
                        {
                            numPrice: 250,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 200,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 250,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
            },
        ],
        [
            6,
            {
                eventKey: 1950394,
                marketKey: 79908108,
                selectionKey: 278420635,
                selectionName: '|John Ryder| - |Rounds 7-9|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 1,
                outcomeMeaningMajorCode: 'S',
                outcomeMeaningMinorCode: 'S',
                runnerNumber: 0,
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                correctScoreHome: '1',
                correctScoreAway: '0',
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908108',
                },
                prices: {
                    price: [
                        {
                            numPrice: 12,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 11,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 12,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
            },
        ],
        [
            7,
            {
                eventKey: 1950394,
                marketKey: 79908108,
                selectionKey: 278420587,
                selectionName: '|John Ryder| - |Rounds 1-3|',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 2,
                outcomeMeaningMajorCode: 'S',
                outcomeMeaningMinorCode: 'S',
                runnerNumber: 0,
                channels: ['K', 'R', 'a', 'b', 'c', 'd'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                correctScoreHome: '2',
                correctScoreAway: '0',
                suspensionReason: '-',
                meta: {
                    operation: 'create',
                    parents: 'c.16:cl.97:t.442:e.1950394:m.79908108',
                },
                prices: {
                    price: [
                        {
                            numPrice: 15,
                            denPrice: 2,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 7,
                            denPrice: 1,
                            selectionPriceType: 'LP',
                        },
                        {
                            numPrice: 15,
                            denPrice: 2,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
            },
        ],
    ]);

    groupRoundBetting: SportBookMarketStructured = {
        eventKey: 1953704,
        marketKey: 79908108,
        marketMeaningMajorCode: '-',
        marketMeaningMinorCode: '--',
        marketName: 'Round Group Betting',
        marketStatus: 'Active',
        displayOrder: 10,
        displayStatus: 'Displayed',
        isGpAvailable: false,
        isHandicapMarket: false,
        isIndexMarket: false,
        isLpAvailable: true,
        isMarketBIR: false,
        isOverUnderMarket: false,
        isSpAvailable: false,
        isStandardFixedOddsMarket: true,
        channels: ['a', 'R', 'b', 'c', 'd', 'K'],
        meta: { operation: 'create', parents: 'c.9:cl.56:t.147:e.1953704' },
        selections: this.groupRoundBettingSelection,
        marketSort: '',
        marketTypeKey: '',
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: false,
        betMinStake: '',
        maxAccumulator: '',
        minAccumulator: '',
        marketFlags: '',
        hasRestrictedSet: '',
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: '',
        isForecastMarket: '',
        isTricastMarket: false,
        eachWayFactorDen: '',
        eachWayFactorNum: '',
        eachWayPlaces: '',
        eachWayWithBet: '',
        marketGroupID: '',
        nCastDividend: new NCastDividend(),
        nCastDividends: [],
        nCastDeleteDividend: undefined,
    };

    methodOfVictorySelection: Map<number, SportBookSelection> = new Map<number, SportBookSelection>([
        [
            0,
            {
                eventKey: 1953704,
                marketKey: 102040078,
                selectionKey: 330869867,
                selectionName: 'JOHN RYDER -BY DECISION OR TECHNICAL DECISION',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: '-',
                outcomeMeaningMinorCode: '-',
                channels: ['a', 'b'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 4,
                            denPrice: 13,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.9:cl.56:t.147:e.1953704:m.102040078',
                },
                runnerNumber: 1,
            },
        ],
        [
            1,
            {
                eventKey: 1953704,
                marketKey: 102040078,
                selectionKey: 330869557,
                selectionName: 'DANIEL JACOBS -BY DECISION OR TECHNICAL DECISION',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: '-',
                outcomeMeaningMinorCode: '-',
                channels: ['a', 'b'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 2,
                            denPrice: 13,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.9:cl.56:t.147:e.1953704:m.102040078',
                },
                runnerNumber: 1,
            },
        ],
        [
            2,
            {
                eventKey: 1953704,
                marketKey: 102040078,
                selectionKey: 330869442,
                selectionName: 'DANIEL JACOBS -KO OR TKO OR DISQUALIFICATION',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: '-',
                outcomeMeaningMinorCode: '-',
                channels: ['a', 'b'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 1,
                            denPrice: 13,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.9:cl.56:t.147:e.1953704:m.102040078',
                },
                runnerNumber: 1,
            },
        ],
        [
            3,
            {
                eventKey: 1953704,
                marketKey: 102040078,
                selectionKey: 330869807,
                selectionName: 'JOHN RYDER -KO OR TKO OR DISQUALIFICATION',
                selectionStatus: 'Active',
                displayStatus: 'Displayed',
                displayOrder: 0,
                outcomeMeaningMajorCode: '-',
                outcomeMeaningMinorCode: '-',
                channels: ['a', 'b'],
                isResulted: false,
                hidePrice: false,
                hideEntry: false,
                isResultConfirmed: false,
                resultCode: 'Unset',
                isSettled: false,
                suspensionReason: '-',
                prices: {
                    price: [
                        {
                            numPrice: 3,
                            denPrice: 13,
                            selectionPriceType: 'LP',
                        },
                    ],
                },
                meta: {
                    operation: 'create',
                    parents: 'c.9:cl.56:t.147:e.1953704:m.102040078',
                },
                runnerNumber: 1,
            },
        ],
    ]);

    methodOfVictory: SportBookMarketStructured = {
        selections: this.methodOfVictorySelection,
        eventKey: 1953704,
        marketKey: 102040078,
        marketMeaningMajorCode: '-',
        marketMeaningMinorCode: '--',
        marketName: 'METHOD OF VICTORY',
        marketStatus: 'Active',
        displayOrder: 150,
        displayStatus: 'Displayed',
        marketSort: '--',
        marketTypeKey: '-',
        isResulted: false,
        isResultConfirmed: false,
        isCashoutAvailable: true,
        betMinStake: '0.01',
        maxAccumulator: '25',
        minAccumulator: '1',
        hasRestrictedSet: 'N',
        isAntepost: false,
        isPlaceOnlyAvailable: false,
        isEachWayAvailable: 'false',
        isForecastMarket: 'false',
        isGpAvailable: false,
        isHandicapMarket: false,
        isIndexMarket: false,
        isLpAvailable: true,
        isMarketBIR: false,
        isOverUnderMarket: false,
        isSpAvailable: false,
        isStandardFixedOddsMarket: true,
        isTricastMarket: false,
        eachWayWithBet: 'Y',
        marketGroupID: '7568',
        channels: ['a', 'b'],
        meta: {
            operation: 'create',
            parents: 'c.9:cl.56:t.147:e.1953704',
        },
        marketFlags: '',
        eachWayFactorDen: '',
        eachWayFactorNum: '',
        eachWayPlaces: '',
        nCastDividend: new NCastDividend(),
        nCastDividends: [],
        nCastDeleteDividend: undefined,
    };

    markets: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>([
        [0, this.fightBettingMarket],
        [1, this.roundBetting],
        [2, this.groupRoundBetting],
        [3, this.methodOfVictory],
    ]);

    event: SportBookEventStructured = {
        eventKey: 1953704,
        eventName: 'DANIEL JACOBS VS JOHN RYDER',
        eventStatus: 'Active',
        displayStatus: 'Displayed',
        displayOrder: 0,
        hasBIRMarkets: '',
        eventSort: '',
        eventDateTime: new Date(),
        isEventStarted: false,
        isEventFinished: false,
        isEventResulted: false,
        isCashoutAvailable: false,
        channels: ['a', 'R', 'b', 'c', 'd', 'K'],
        flags: [],
        meta: { operation: 'create', parents: 'c.10:cl.58:t.16407' },
        raceStage: '',
        typeName: '',
        typeKey: '',
        typeFlagCode: '',
        offTime: new Date(),
        markets: this.markets,
    };

    eventBoxing: Map<number, SportBookEventStructured> = new Map<number, SportBookEventStructured>([[0, this.event]]);

    sportBookResult: SportBookResult = {
        events: this.eventBoxing,
    };
}
