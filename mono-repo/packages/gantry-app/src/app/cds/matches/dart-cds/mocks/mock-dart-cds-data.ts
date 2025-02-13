import { Fixture, Game } from '../../../../common/cds-client/models/fixture.model';

export class MockDartCdsData {
    matchBetting: Game = {
        id: 61315653,
        name: {
            value: '2Way - Who will win?',
            sign: 'xNejeQ==',
        },
        results: [
            {
                id: -2108425069,
                odds: 15.0,
                name: {
                    value: 'Turner',
                    sign: 'Xstehw==',
                },
                sourceName: {
                    value: '1',
                    sign: '69HIEQ==',
                },
                visibility: 'Visible',
                numerator: 14,
                denominator: 1,
                americanOdds: 1400,
            },
            {
                id: -2108425068,
                odds: 16.0,
                name: {
                    value: 'Lewis',
                    sign: 'PBAyjQ==',
                },
                sourceName: {
                    value: '2',
                    sign: 'GvxTqA==',
                },
                visibility: 'Visible',
                numerator: 15,
                denominator: 1,
                americanOdds: 1500,
            },
        ],
        templateId: 6367,
        categoryId: 160,
        resultOrder: 'Default',
        combo1: 'NoEventCombo',
        combo2: 'Single',
        visibility: 'Visible',
        category: 'Gridable',
        templateCategory: {
            id: 160,
            name: {
                value: '2Way - Who will win?',
                sign: 'xNejeQ==',
            },
            category: 'Gridable',
        },
        isMain: true,
        grouping: {
            gridGroups: ['0cc4atga9'],
            detailed: [
                {
                    displayType: 'Regular',
                    marketGroupId: '0345d714-e945-47f3-8d85-0103b12d22d3',
                    marketGroupItemId: '74eba74b-d8a3-42a6-99a2-f1b812e315ac',
                },
            ],
        },
    };

    matchHandicap: Game = {
        id: 965067506,
        name: {
            value: 'Match Handicap',
            sign: '1Nr2GA==',
        },
        results: [
            {
                id: -1475036271,
                odds: 1.15,
                name: {
                    value: 'Asjad Iqbal (PAK) +4,5',
                    sign: 'sGVC4w==',
                },
                visibility: 'Visible',
                numerator: 3,
                denominator: 20,
                americanOdds: -650,
            },
            {
                id: -1475036270,
                odds: 4.75,
                name: {
                    value: 'Thepchaiya Un-nooh (THA) -4,5',
                    sign: 'K0xQCg==',
                },
                visibility: 'Visible',
                numerator: 15,
                denominator: 4,
                americanOdds: 375,
            },
        ],
        templateId: 5034,
        categoryId: 381,
        resultOrder: 'Default',
        combo1: 'NoEventCombo',
        combo2: 'Single',
        visibility: 'Visible',
        balanced: 1,
        attr: '+4,5',
        spread: 3.6,
        category: 'Gridable',
        templateCategory: {
            id: 381,
            name: {
                value: 'Handicap (two way)',
                sign: 'GgVwjg==',
            },
            category: 'Gridable',
        },
        isMain: false,
        grouping: {
            gridGroups: ['s7r13kq48'],
            detailed: [
                {
                    subIndex: 0,
                    displayType: 'Spread',
                    marketGroupId: '2ba6299d-bc85-4c21-a60a-b4bf1a59bdc5',
                    marketGroupItemId: '0e77bf3c-4b71-4fd0-be0a-1b6f80cfb7f9',
                },
            ],
        },
    };

    legHandicap: Game = {
        id: 61369265,
        name: {
            value: 'Leg Handicap',
            sign: 'OvVxiA==',
        },
        results: [
            {
                id: -2108279847,
                odds: 11.0,
                name: {
                    value: 'Dick Van Dijk (NED) -3,5',
                    sign: 'EfOwMw==',
                },
                visibility: 'Visible',
                numerator: 10,
                denominator: 1,
                americanOdds: 1000,
            },
            {
                id: -2108279846,
                odds: 12.0,
                name: {
                    value: 'Mario Robbe (NED) +3,5',
                    sign: 'J7bW7w==',
                },
                visibility: 'Visible',
                numerator: 11,
                denominator: 1,
                americanOdds: 1100,
            },
        ],
        templateId: 11710,
        categoryId: 286,
        resultOrder: 'Default',
        combo1: 'NoEventCombo',
        combo2: 'Single',
        visibility: 'Visible',
        balanced: 1,
        spread: 1.0,
        category: 'Gridable',
        templateCategory: {
            id: 286,
            name: {
                value: 'Leg Handicap',
                sign: 'OvVxiA==',
            },
            category: 'Gridable',
        },
        isMain: false,
        grouping: {
            gridGroups: ['hd93yvc09'],
            detailed: [
                {
                    subIndex: 0,
                    displayType: 'Regular',
                    marketGroupId: '0345d714-e945-47f3-8d85-0103b12d22d3',
                    marketGroupItemId: '6396056d-7533-429b-9511-632c977c56c5',
                },
                {
                    subIndex: 0,
                    displayType: 'Regular',
                    marketGroupId: 'fd890863-f774-49c9-bf29-c346542bda39',
                    marketGroupItemId: '4d67c2e8-7aa7-436b-b0f8-8557ec526f05',
                },
            ],
        },
    };

    totalFrameBetting: Game = {
        id: 61315658,
        name: {
            value: 'How many 180´s will be score in the match?',
            sign: 'dwuN+g==',
        },
        results: [
            {
                id: -2108425054,
                odds: 6.0,
                name: {
                    value: 'Over 4,5',
                    sign: 'k5NqdQ==',
                },
                visibility: 'Visible',
                numerator: 5,
                denominator: 1,
                americanOdds: 500,
            },
            {
                id: -2108425053,
                odds: 5.0,
                name: {
                    value: 'Under 4,5',
                    sign: 'mM/Acg==',
                },
                visibility: 'Visible',
                numerator: 4,
                denominator: 1,
                americanOdds: 400,
            },
        ],
        templateId: 6057,
        categoryId: 133,
        resultOrder: 'Default',
        combo1: 'NoEventCombo',
        combo2: 'Single',
        visibility: 'Visible',
        balanced: 1,
        spread: 1.0,
        category: 'Gridable',
        templateCategory: {
            id: 133,
            name: {
                value: 'Misc',
                sign: 'yIvKEw==',
            },
            category: 'Gridable',
        },
        isMain: false,
        grouping: {
            gridGroups: ['2jf153e5u'],
            detailed: [
                {
                    subIndex: 0,
                    displayType: 'OverUnder',
                    marketGroupId: '0345d714-e945-47f3-8d85-0103b12d22d3',
                    marketGroupItemId: '89f0c7d3-c65b-46ac-a084-f0bbc74c3321',
                },
                {
                    subIndex: 0,
                    displayType: 'OverUnder',
                    marketGroupId: 'd416d0b9-9a45-4a7c-84e4-c8004643caa0',
                    marketGroupItemId: '4e4c47cb-9bef-431b-a931-b391b421fbb2',
                },
            ],
        },
    };

    matchBetting3Way: Game = {
        id: 61369264,
        name: {
            value: '3Way - result EN',
            sign: '5ArJCg==',
        },
        results: [
            {
                id: -2108279850,
                odds: 2.0,
                name: {
                    value: 'Van Dijk ',
                    sign: 'jSZPCw==',
                },
                visibility: 'Visible',
                numerator: 1,
                denominator: 1,
                americanOdds: 100,
            },
            {
                id: -2108279849,
                odds: 3.0,
                name: {
                    value: 'Draw',
                    sign: 'aYIQ5Q==',
                },
                visibility: 'Visible',
                numerator: 2,
                denominator: 1,
                americanOdds: 200,
            },
            {
                id: -2108279848,
                odds: 2.0,
                name: {
                    value: 'Robbe',
                    sign: 'J4lk7w==',
                },
                visibility: 'Visible',
                numerator: 1,
                denominator: 1,
                americanOdds: 100,
            },
        ],
        templateId: 7111,
        categoryId: 440,
        resultOrder: 'Default',
        combo1: 'NoEventCombo',
        combo2: 'Single',
        visibility: 'Visible',
        category: 'Other',
        templateCategory: {
            id: 440,
            name: {
                value: '3Way - result EN',
                sign: '5ArJCg==',
            },
            category: 'Other',
        },
        isMain: false,
        grouping: {
            gridGroups: [],
            detailed: [
                {
                    displayType: 'Regular',
                    marketGroupId: '0345d714-e945-47f3-8d85-0103b12d22d3',
                    marketGroupItemId: 'cbd02989-4a99-4c32-9728-8164fe3ff60c',
                },
            ],
        },
    };

    frameBetting: Fixture = {
        optionMarkets: [],
        games: [
            {
                id: 64536488,
                name: {
                    value: 'Correct Score (Best of 7 legs)',
                    sign: 'D/dW5Q==',
                },
                results: [
                    {
                        id: -2099589376,
                        odds: 22,
                        name: {
                            value: '4:0',
                            sign: '4PRgYA==',
                        },
                        visibility: 'Visible',
                        numerator: 20,
                        denominator: 1,
                        americanOdds: 2000,
                    },
                    {
                        id: -2099589375,
                        odds: 88,
                        name: {
                            value: '4:1',
                            sign: 'LkSFwA==',
                        },
                        visibility: 'Visible',
                        numerator: 90,
                        denominator: 1,
                        americanOdds: 9000,
                    },
                    {
                        id: -2099589374,
                        odds: 65,
                        name: {
                            value: '4:2',
                            sign: 'PZPa+g==',
                        },
                        visibility: 'Visible',
                        numerator: 66,
                        denominator: 1,
                        americanOdds: 6600,
                    },
                    {
                        id: -2099589373,
                        odds: 5,
                        name: {
                            value: '4:3',
                            sign: '8yM/Wg==',
                        },
                        visibility: 'Visible',
                        numerator: 4,
                        denominator: 1,
                        americanOdds: 400,
                    },
                    {
                        id: -2099589372,
                        odds: 4,
                        name: {
                            value: '0:4',
                            sign: 'x5VsiQ==',
                        },
                        visibility: 'Visible',
                        numerator: 3,
                        denominator: 1,
                        americanOdds: 300,
                    },
                    {
                        id: -2099589371,
                        odds: 7,
                        name: {
                            value: '1:4',
                            sign: 'qH9MXw==',
                        },
                        visibility: 'Visible',
                        numerator: 6,
                        denominator: 1,
                        americanOdds: 600,
                    },
                    {
                        id: -2099589370,
                        odds: 8,
                        name: {
                            value: '2:4',
                            sign: 'WEdc/g==',
                        },
                        visibility: 'Visible',
                        numerator: 7,
                        denominator: 1,
                        americanOdds: 700,
                    },
                    {
                        id: -2099589369,
                        odds: 53,
                        name: {
                            value: '3:4',
                            sign: 'N618KA==',
                        },
                        visibility: 'Visible',
                        numerator: 50,
                        denominator: 1,
                        americanOdds: 5000,
                    },
                ],
                templateId: 33569,
                categoryId: 843,
                resultOrder: 'Default',
                combo1: 'NoEventCombo',
                combo2: 'Single',
                visibility: 'Visible',
                category: 'Other',
                templateCategory: {
                    id: 843,
                    name: {
                        value: 'Correct score',
                        sign: 'YNN5Uw==',
                    },
                    category: 'Other',
                },
                isMain: false,
                grouping: {
                    gridGroups: [],
                    detailed: [
                        {
                            displayType: 'Regular',
                            marketGroupId: 'e4cb99ca-ef83-4de9-b76b-63a853c601a1',
                            marketGroupItemId: 'ba53c6c8-8eaa-488b-9fe2-2a6499630380',
                        },
                    ],
                },
                isFrameBetting: true,
            },
        ],

        id: '42787594',
        name: {
            value: 'Mark Hylton (ENG) - Peter Manley (ENG)',
            sign: 'm5hvGg==',
        },
        sourceId: 42787594,
        source: 'V1',
        fixtureType: 'Standard',
        context: 'v1|en-gb|42787594',
        addons: {
            participantDividend: {},
        },
        stage: 'PreMatch',
        liveType: 'NotSet',
        liveAlert: false,
        startDate: '2024-06-29T22:00:00Z',
        cutOffDate: '2024-06-29T22:00:00Z',
        sport: {
            type: 'Sport',
            id: 34,
            name: {
                value: 'Darts',
                sign: 'ODmTxA==',
            },
        },
        competition: {
            parentLeagueId: 9855,
            statistics: false,
            sportId: 34,
            compoundId: '1:9855',
            type: 'Competition',
            id: 9855,
            parentId: 6,
            name: {
                value: 'International Darts League',
                sign: '61Bo0A==',
            },
        },
        region: {
            code: 'WRL',
            sportId: 34,
            type: 'Region',
            id: 6,
            parentId: 34,
            name: {
                value: 'World',
                sign: 'pJ/1hw==',
            },
        },
        viewType: 'European',
        isOpenForBetting: true,
        isVirtual: false,
        taggedLocations: [],
        totalMarketsCount: 4,
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
}
