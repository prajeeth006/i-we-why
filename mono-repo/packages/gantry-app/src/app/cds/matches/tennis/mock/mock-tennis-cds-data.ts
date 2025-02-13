import { Fixture } from '../../../../common/cds-client/models/fixture.model';
import { Game, TennisContentParams } from '../models/tennis-cds-content.model';

export class MockTennisCdsData {
    fixture: Fixture = {
        optionMarkets: [],
        games: [
            {
                id: 68565695,
                name: {
                    value: 'Set bet',
                    sign: 'IPu9fQ==',
                },
                results: [
                    {
                        id: -2088979607,
                        odds: 33.0,
                        name: {
                            value: '3:0',
                            sign: 'TdcCmA==',
                        },
                        visibility: 'Visible',
                        numerator: 33,
                        denominator: 1,
                        americanOdds: 3300,
                    },
                    {
                        id: -2088979606,
                        odds: 55.0,
                        name: {
                            value: '3:1',
                            sign: 'cmFTTA==',
                        },
                        visibility: 'Visible',
                        numerator: 55,
                        denominator: 1,
                        americanOdds: 5500,
                    },
                    {
                        id: -2088979605,
                        odds: 66.0,
                        name: {
                            value: '3:2',
                            sign: 'kLC4Ag==',
                        },
                        visibility: 'Visible',
                        numerator: 66,
                        denominator: 1,
                        americanOdds: 6600,
                    },
                    {
                        id: -2088979604,
                        odds: 7.0,
                        name: {
                            value: '2:3',
                            sign: 'emFDPg==',
                        },
                        visibility: 'Visible',
                        numerator: 6,
                        denominator: 1,
                        americanOdds: 600,
                    },
                    {
                        id: -2088979603,
                        odds: 8.0,
                        name: {
                            value: '1:3',
                            sign: 'e1/n6w==',
                        },
                        visibility: 'Visible',
                        numerator: 7,
                        denominator: 1,
                        americanOdds: 700,
                    },
                    {
                        id: -2088979602,
                        odds: 9.0,
                        name: {
                            value: '0:3',
                            sign: '5bNzSQ==',
                        },
                        visibility: 'Visible',
                        numerator: 8,
                        denominator: 1,
                        americanOdds: 800,
                    },
                ],
                templateId: 79,
                categoryId: 35,
                resultOrder: 'Default',
                combo1: 'NoCombo',
                combo2: 'Single',
                visibility: 'Visible',
                category: 'Other',
                templateCategory: {
                    id: 35,
                    name: {
                        value: 'Set related bets',
                        sign: 'PiPCvQ==',
                    },
                    category: 'Other',
                },
                isMain: false,
                grouping: {
                    gridGroups: [],
                    detailed: [
                        {
                            displayType: 'Regular',
                            marketGroupId: '6e97222e-c303-4375-a779-15bd7ef44d7e',
                            marketGroupItemId: '9120b288-e2a5-4ac5-a47d-c5fab9baf967',
                        },
                    ],
                },
            },
            {
                id: 68565696,
                name: {
                    value: '2Way - Who will win?',
                    sign: 'fLK9Ag==',
                },
                results: [
                    {
                        id: -2088979601,
                        odds: 5.0,
                        name: {
                            value: 'A. Bogdanvic / J. Goodall',
                            sign: 'D5h9dA==',
                        },
                        sourceName: {
                            value: '1',
                            sign: 'lDE+uw==',
                        },
                        visibility: 'Visible',
                        numerator: 4,
                        denominator: 1,
                        americanOdds: 400,
                        playerId: 21266,
                    },
                    {
                        id: -2088979600,
                        odds: 64.0,
                        name: {
                            value: 'A. Brianti/A-L. Groenefeld',
                            sign: 'd1VNVw==',
                        },
                        sourceName: {
                            value: '2',
                            sign: 'hsrk8w==',
                        },
                        visibility: 'Visible',
                        numerator: 60,
                        denominator: 1,
                        americanOdds: 6000,
                        playerId: 24860,
                    },
                ],
                templateId: 62,
                categoryId: 33,
                resultOrder: 'Default',
                combo1: 'NoEventCombo',
                combo2: 'Single',
                visibility: 'Visible',
                category: 'Gridable',
                templateCategory: {
                    id: 33,
                    name: {
                        value: '2Way - Who will win?',
                        sign: 'fLK9Ag==',
                    },
                    category: 'Gridable',
                },
                isMain: true,
                grouping: {
                    gridGroups: ['33ucep4lc'],
                    detailed: [
                        {
                            displayType: 'Regular',
                            marketGroupId: '6e97222e-c303-4375-a779-15bd7ef44d7e',
                            marketGroupItemId: '0a7ff3ec-6ddf-4bd8-adb0-899f48ebff9b',
                        },
                    ],
                },
            },
        ],
        id: '45550899',
        name: {
            value: 'A. Bogdanvic / J. Goodall - A. Brianti/A-L. Groenefeld',
            sign: 'OS5agw==',
        },
        sourceId: 45550899,
        source: 'V1',
        fixtureType: 'Standard',
        context: 'v1|en-gb|45550899',
        addons: {
            participantDividend: {},
        },
        stage: 'PreMatch',
        liveType: 'NotSet',
        liveAlert: true,
        startDate: '2024-08-30T05:00:00Z',
        cutOffDate: '2024-08-30T05:00:00Z',
        sport: {
            type: 'Sport',
            id: 5,
            name: {
                value: 'Tennis',
                sign: 'LtiLkw==',
            },
        },
        competition: {
            parentLeagueId: 15122,

            statistics: false,
            sportId: 5,
            compoundId: '1:15122',
            type: 'Competition',
            id: 15122,
            parentId: 6,
            name: {
                value: 'US Open',
                sign: 'uoSj9g==',
            },
        },
        region: {
            code: 'WRL',
            sportId: 5,
            type: 'Region',
            id: 6,
            parentId: 5,
            name: {
                value: 'World',
                sign: 'pJ/1hw==',
            },
        },
        tournament: {
            type: 'Tournament',
            id: 5,
            parentId: 5,
            name: {
                value: 'Grand Slam Tournaments',
                sign: 'HRWJOg==',
            },
        },
        viewType: 'European',
        isOpenForBetting: true,
        isVirtual: false,
        taggedLocations: [],
        totalMarketsCount: 2,
        conferences: [],
        marketGroups: {
            outrightMarketGroupIds: [],
            specialMarketGroupIds: [],
            type: 'MarketGroups',
            id: 0,
        },
        priceBoostCount: 0,
        linkedTv1EventIds: [],
    };
    matchBetting: Game = {
        id: 68565696,
        gameName: 'MATCH BETTING',
        isMatchBetting: true,
        matchBetting: {
            homeBettingPrice: '4/1',
            homePlayer: 'A. Bogdanvic / J. Goodall',
            awayBettingPrice: '1/1',
            awayPlayer: 'A. Brianti/A-L. Groenefeld',
            scorePoint: '',
        },
        setBetting: [],
    };
    setBetting: Game = {
        id: 68565695,
        gameName: 'SET BETTING',
        isSetBetting: true,
        setBetting: [
            {
                homeBettingPrice: '33/1',
                awayBettingPrice: '8/1',
                scorePoint: '3-0',
                isMatchedPair: true,
            },
            {
                homeBettingPrice: '55/1',
                awayBettingPrice: '7/1',
                scorePoint: '3-1',
                isMatchedPair: true,
            },
            {
                homeBettingPrice: '66/1',
                awayBettingPrice: '6/1',
                scorePoint: '3-2',
                isMatchedPair: true,
            },
        ],
    };
    tennisContent: TennisContentParams = {
        contentParameters: {
            LeftStipulatedLine: 'ALL PRICES FROM BETSTATION AND SUBJECT TO FLUCTUATION',
            MatchandSetBetting: 'MATCH & SET BETTING',
            MatchBetting: 'MATCH BETTING',
            RightStipulatedLine: 'MORE MARKETS AVAILABLE ON BETSTATION',
            SetBetting: 'SET BETTING',
            Today: 'TODAY',
            Tomorrow: 'TOMORROW',
            TwentyOneNumber: '21',
            V: 'V',
            WomensTennis: "WOMEN'S TENNIS",
            BetStationPricesFluctuation: 'BetStation prices - subject to change',
            MaxSelectionsperPage: '8',
            Abbreviations: 'atp,wta',
        },
        tennisImage: {
            src: 'https://dev.coralracingclub.coral.co.uk/-/media/Vanilla,-d-,Mobile/Gantry/SportsLogos/TennisImage.png?rev=d7767b5a984949cc9f26add54272a4c9',
            alt: 'coral.co.uk_boxing_image',
            width: 124,
            height: 124,
        },
    };
}
