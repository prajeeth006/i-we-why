import { Fixture } from '../../../../common/cds-client/models/fixture.model';

export class Tv2CricketCdsMockData {
    fixture: Fixture = {
        optionMarkets: [
            {
                id: 2505576,
                name: {
                    value: 'Match Betting (incl. super over)',
                    sign: '/7uCNA==',
                },
                status: 'Visible',
                options: [
                    {
                        id: 7636996,
                        status: 'Visible',
                        name: {
                            value: 'Punjab Kings',
                            sign: 'emosSw==',
                        },
                        price: {
                            id: 88898818,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Max'],
                            fixtureParticipant: 376660,
                        },
                    },
                    {
                        id: 7636997,
                        status: 'Visible',
                        name: {
                            value: 'Delhi Capitals',
                            sign: '7D/pZw==',
                        },
                        price: {
                            id: 88898819,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Max'],
                            fixtureParticipant: 376661,
                        },
                    },
                ],
                parameters: [
                    {
                        key: 'Happening',
                        type: 'String',
                        value: 'Run',
                    },
                    {
                        key: 'MarketType',
                        type: 'String',
                        value: '2way',
                    },
                    {
                        key: 'Period',
                        type: 'String',
                        value: 'SuperOver',
                    },
                ],
                grouping: {
                    gridGroups: ['6m055au47'],
                    detailed: [
                        {
                            displayType: 'Regular',
                            marketGroupId: 'dfdea1f6-919e-4163-acb3-f43e6f9faafb',
                            marketGroupItemId: '045dc8a9-4c72-45d2-a560-9adafaeedf6c',
                            orderType: 'None',
                            isFixturePlayerParticipant: false,
                        },
                    ],
                },
                isMain: false,
                templateCategory: {
                    id: 0,
                    category: 'Gridable',
                    dynamicCategories: [],
                },
                comboPrevention: 'NoFixtureCombo',
                minCombo: 1,
                isEachWay: false,
                source: 'V2',
                isBetBuilder: false,
            },
            {
                id: 2505583,
                name: {
                    value: 'Total Match Sixes',
                    sign: '5uDvKA==',
                },
                status: 'Visible',
                options: [
                    {
                        id: 7637014,
                        status: 'Visible',
                        name: {
                            value: 'Over 1.4',
                            sign: 'Ro+IXg==',
                        },
                        price: {
                            id: 88899012,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Over'],
                        },
                    },
                    {
                        id: 7637015,
                        status: 'Visible',
                        name: {
                            value: 'Under 1.4',
                            sign: 'PY7p6g==',
                        },
                        price: {
                            id: 88899013,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Under'],
                        },
                    },
                ],
                parameters: [
                    {
                        key: 'DecimalValue',
                        type: 'Decimal',
                        value: '1.4',
                    },
                    {
                        key: 'Happening',
                        type: 'String',
                        value: 'Six',
                    },
                    {
                        key: 'MarketType',
                        type: 'String',
                        value: 'Over/Under',
                    },
                    {
                        key: 'Period',
                        type: 'String',
                        value: 'FullTime',
                    },
                ],
                grouping: {
                    gridGroups: [],
                    detailed: [
                        {
                            subIndex: 1,
                            displayType: 'OverUnder',
                            marketGroupId: '2667892b-2074-4b8b-aa69-8a00285a2f2a',
                            marketGroupItemId: '8d2ead5b-e0d4-42c9-bc44-be451d6edff1',
                            orderType: 'None',
                            isFixturePlayerParticipant: false,
                        },
                    ],
                },
                attr: '1.4',
                isMain: false,
                templateCategory: {
                    id: 0,
                    category: 'Other',
                    dynamicCategories: [],
                },
                comboPrevention: 'NoFixtureCombo',
                minCombo: 1,
                isEachWay: false,
                source: 'V2',
                isBetBuilder: false,
            },
            {
                id: 2505602,
                name: {
                    value: 'Punjab Kings top batter',
                    sign: 'dJ6e/A==',
                },
                status: 'Visible',
                options: [
                    {
                        id: 7637064,
                        status: 'Visible',
                        name: {
                            value: 'Arshdeep Singh',
                            sign: 'NUUMAQ==',
                        },
                        price: {
                            id: 88899590,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Ranked'],
                            fixtureParticipant: 376670,
                        },
                    },
                    {
                        id: 7637065,
                        status: 'Visible',
                        name: {
                            value: 'Atharwa Taide',
                            sign: 'RImyfg==',
                        },
                        price: {
                            id: 88899591,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Ranked'],
                            fixtureParticipant: 376671,
                        },
                    },
                ],
                parameters: [
                    {
                        key: 'FixtureParticipant',
                        type: 'Long',
                        value: '376660',
                    },
                    {
                        key: 'Happening',
                        type: 'String',
                        value: 'Run',
                    },
                    {
                        key: 'MarketType',
                        type: 'String',
                        value: 'TopScorer',
                    },
                    {
                        key: 'Period',
                        type: 'String',
                        value: 'FullTime',
                    },
                    {
                        key: 'Places',
                        type: 'Integer',
                        value: '1',
                    },
                    {
                        key: 'Position',
                        type: 'String',
                        value: 'First',
                    },
                ],
                grouping: {
                    gridGroups: [],
                    detailed: [
                        {
                            subIndex: 1,
                            displayType: 'Regular',
                            marketGroupId: '2667892b-2074-4b8b-aa69-8a00285a2f2a',
                            marketGroupItemId: '783387a8-6c05-4aba-9061-34c7e23fc850',
                            orderType: 'None',
                            isFixturePlayerParticipant: false,
                        },
                    ],
                },
                isMain: false,
                templateCategory: {
                    id: 0,
                    category: 'Other',
                    dynamicCategories: [],
                },
                comboPrevention: 'NoFixtureCombo',
                minCombo: 1,
                fixtureParticipantId: 376660,
                isEachWay: false,
                source: 'V2',
                isBetBuilder: false,
            },
            {
                id: 2505611,
                name: {
                    value: 'Total Match Sixes',
                    sign: 'kKLhMg==',
                },
                status: 'Visible',
                options: [
                    {
                        id: 7637086,
                        status: 'Visible',
                        name: {
                            value: 'Over 5.5',
                            sign: 'B9FX2g==',
                        },
                        price: {
                            id: 88899832,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Over'],
                        },
                    },
                    {
                        id: 7637087,
                        status: 'Visible',
                        name: {
                            value: 'Under 5.5',
                            sign: 'OR7BDQ==',
                        },
                        price: {
                            id: 88899833,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Under'],
                        },
                    },
                ],
                parameters: [
                    {
                        key: 'DecimalValue',
                        type: 'Decimal',
                        value: '5.5',
                    },
                    {
                        key: 'Happening',
                        type: 'String',
                        value: 'Six',
                    },
                    {
                        key: 'MarketType',
                        type: 'String',
                        value: 'Over/Under',
                    },
                    {
                        key: 'Period',
                        type: 'String',
                        value: 'FullTime',
                    },
                ],
                grouping: {
                    gridGroups: [],
                    detailed: [
                        {
                            subIndex: 6,
                            displayType: 'OverUnder',
                            marketGroupId: '2667892b-2074-4b8b-aa69-8a00285a2f2a',
                            marketGroupItemId: '8d2ead5b-e0d4-42c9-bc44-be451d6edff1',
                            orderType: 'None',
                            isFixturePlayerParticipant: false,
                        },
                    ],
                },
                attr: '5.5',
                isMain: false,
                templateCategory: {
                    id: 0,
                    category: 'Other',
                    dynamicCategories: [],
                },
                comboPrevention: 'NoFixtureCombo',
                minCombo: 1,
                isEachWay: false,
                source: 'V2',
                isBetBuilder: false,
            },
            {
                id: 2505612,
                name: {
                    value: 'Delhi Capitals top batter',
                    sign: '83W7ww==',
                },
                status: 'Visible',
                options: [
                    {
                        id: 7637088,
                        status: 'Visible',
                        name: {
                            value: 'Aniruddha Joshi',
                            sign: 'ibr6lg==',
                        },
                        price: {
                            id: 88899834,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Ranked'],
                            fixtureParticipant: 376674,
                        },
                    },
                    {
                        id: 7637089,
                        status: 'Visible',
                        name: {
                            value: 'Axar Patel',
                            sign: 'lQETug==',
                        },
                        price: {
                            id: 88899835,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Ranked'],
                            fixtureParticipant: 376675,
                        },
                    },
                    {
                        id: 7637090,
                        status: 'Visible',
                        name: {
                            value: 'Chetan Sakariya',
                            sign: 'y1FswQ==',
                        },
                        price: {
                            id: 88899836,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Ranked'],
                            fixtureParticipant: 376676,
                        },
                    },
                    {
                        id: 7637091,
                        status: 'Visible',
                        name: {
                            value: 'Gulbadin Naib',
                            sign: '4JcxEA==',
                        },
                        price: {
                            id: 88899837,
                            odds: 1,
                        },
                        parameters: {
                            optionTypes: ['Ranked'],
                            fixtureParticipant: 376677,
                        },
                    },
                ],
                parameters: [
                    {
                        key: 'FixtureParticipant',
                        type: 'Long',
                        value: '376661',
                    },
                    {
                        key: 'Happening',
                        type: 'String',
                        value: 'Run',
                    },
                    {
                        key: 'MarketType',
                        type: 'String',
                        value: 'TopScorer',
                    },
                    {
                        key: 'Period',
                        type: 'String',
                        value: 'FullTime',
                    },
                    {
                        key: 'Places',
                        type: 'Integer',
                        value: '1',
                    },
                    {
                        key: 'Position',
                        type: 'String',
                        value: 'First',
                    },
                ],
                grouping: {
                    gridGroups: [],
                    detailed: [
                        {
                            subIndex: 1,
                            displayType: 'Regular',
                            marketGroupId: '2667892b-2074-4b8b-aa69-8a00285a2f2a',
                            marketGroupItemId: '2615b25c-15e2-4023-8737-ec9a24df305d',
                            orderType: 'None',
                            isFixturePlayerParticipant: false,
                        },
                    ],
                },
                isMain: false,
                templateCategory: {
                    id: 0,
                    category: 'Other',
                    dynamicCategories: [],
                },
                comboPrevention: 'NoFixtureCombo',
                minCombo: 1,
                fixtureParticipantId: 376661,
                isEachWay: false,
                source: 'V2',
                isBetBuilder: false,
            },
        ],
        games: [],
        participants: [
            {
                id: 376660,
                participantId: 709047,
                name: {
                    value: 'Punjab Kings',
                    sign: '7m0ECw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'HomeTeam',
                },
                options: [],
                source: 'V2',
            },
            {
                id: 376661,
                participantId: 709088,
                name: {
                    value: 'Delhi Capitals',
                    sign: 'eaWg7A==',
                },
                status: 'Unknown',
                properties: {
                    type: 'AwayTeam',
                },
                options: [],
                source: 'V2',
            },
            {
                id: 376670,
                participantId: 709077,
                name: {
                    value: 'Arshdeep Singh',
                    sign: '2WPGGw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 376671,
                participantId: 709079,
                name: {
                    value: 'Atharwa Taide',
                    sign: 'UBhAbg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 376674,
                participantId: 709099,
                name: {
                    value: 'Aniruddha Joshi',
                    sign: 'qPC96g==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 376677,
                participantId: 709097,
                name: {
                    value: 'Gulbadin Naib',
                    sign: '8YsLhg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 376676,
                participantId: 709121,
                name: {
                    value: 'Chetan Sakariya',
                    sign: 'rri0hg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 376675,
                participantId: 709102,
                name: {
                    value: 'Axar Patel',
                    sign: 'NcF0rw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                options: [],
                source: 'V2',
            },
        ],
        id: '5:202691',
        name: {
            value: 'Punjab Kings - Delhi Capitals',
            sign: 'DSs0Lw==',
        },
        sourceId: 202691,
        source: 'V2',
        fixtureType: 'PairGame',
        context: 'v2|en-gb|5:202691_64_any',
        addons: {
            isResulted: false,
            participantDividend: {},
            betBuilderProvider: 'None',
        },
        stage: 'PreMatch',
        liveAlert: false,
        startDate: '2024-10-01T00:00:00Z',
        cutOffDate: '2024-10-01T00:00:00Z',
        sport: {
            type: 'Sport',
            isEsport: false,
            id: 22,
            name: {
                value: 'Cricket',
                sign: '2ZZEzQ==',
            },
        },
        competition: {
            statistics: false,
            sportId: 22,
            compoundId: '5:147999',
            type: 'Competition',
            id: 147999,
            parentId: 6,
            name: {
                value: 'Indian Premier League',
                sign: 'IfVVEw==',
            },
        },
        region: {
            code: 'WRL',
            sportId: 22,
            type: 'Region',
            id: 6,
            parentId: 22,
            name: {
                value: 'World',
                sign: 'pJ/1hw==',
            },
        },
        viewType: 'NotSet',
        isOpenForBetting: true,
        isVirtual: false,
        taggedLocations: [],
        totalMarketsCount: 5,
        conferences: [],
        marketGroups: {
            outrightMarketGroupIds: [],
            specialMarketGroupIds: [],
            type: 'MarketGroups',
            id: 0,
        },
        priceBoostCount: 0,
        linkedTv1EventIds: [],
        contexts: ['v2|en-gb|5:202691_64_any'],
        playerStats: [],
        liveType: '',
    };

    matchBetting = {
        id: 2505576,
        name: {
            value: 'Match Betting (incl. super over)',
            sign: '/7uCNA==',
        },
        status: 'Visible',
        options: [
            {
                id: 7636996,
                status: 'Visible',
                name: {
                    value: 'Punjab Kings',
                    sign: 'emosSw==',
                },
                price: {
                    id: 88898818,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Max'],
                    fixtureParticipant: 376660,
                },
            },
            {
                id: 7636997,
                status: 'Visible',
                name: {
                    value: 'Delhi Capitals',
                    sign: '7D/pZw==',
                },
                price: {
                    id: 88898819,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Max'],
                    fixtureParticipant: 376661,
                },
            },
        ],
        parameters: [
            {
                key: 'Happening',
                type: 'String',
                value: 'Run',
            },
            {
                key: 'MarketType',
                type: 'String',
                value: '2way',
            },
            {
                key: 'Period',
                type: 'String',
                value: 'SuperOver',
            },
        ],
        grouping: {
            gridGroups: ['6m055au47'],
            detailed: [
                {
                    displayType: 'Regular',
                    marketGroupId: 'dfdea1f6-919e-4163-acb3-f43e6f9faafb',
                    marketGroupItemId: '045dc8a9-4c72-45d2-a560-9adafaeedf6c',
                    orderType: 'None',
                    isFixturePlayerParticipant: false,
                },
            ],
        },
        isMain: false,
        templateCategory: {
            id: 0,
            category: 'Gridable',
        },
        comboPrevention: 'NoFixtureCombo',
        minCombo: 1,
        isEachWay: false,
        source: 'V2',
        isBetBuilder: false,
        participants: [
            {
                id: 376660,
                participantId: 709047,
                name: {
                    value: 'Punjab Kings',
                    sign: '7m0ECw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'HomeTeam',
                },
                source: 'V2',
            },
            {
                id: 376661,
                participantId: 709088,
                name: {
                    value: 'Delhi Capitals',
                    sign: 'eaWg7A==',
                },
                status: 'Unknown',
                properties: {
                    type: 'AwayTeam',
                },
                source: 'V2',
            },
            {
                id: 376670,
                participantId: 709077,
                name: {
                    value: 'Arshdeep Singh',
                    sign: '2WPGGw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                source: 'V2',
            },
            {
                id: 376671,
                participantId: 709079,
                name: {
                    value: 'Atharwa Taide',
                    sign: 'UBhAbg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                source: 'V2',
            },
            {
                id: 376674,
                participantId: 709099,
                name: {
                    value: 'Aniruddha Joshi',
                    sign: 'qPC96g==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376677,
                participantId: 709097,
                name: {
                    value: 'Gulbadin Naib',
                    sign: '8YsLhg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376676,
                participantId: 709121,
                name: {
                    value: 'Chetan Sakariya',
                    sign: 'rri0hg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },

                source: 'V2',
            },
            {
                id: 376675,
                participantId: 709102,
                name: {
                    value: 'Axar Patel',
                    sign: 'NcF0rw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },

                source: 'V2',
            },
        ],
    };

    homeTopRunScorer = {
        id: 2505602,
        name: {
            value: 'Punjab Kings top batter',
            sign: 'dJ6e/A==',
        },
        status: 'Visible',
        options: [
            {
                id: 7637064,
                status: 'Visible',
                name: {
                    value: 'Arshdeep Singh',
                    sign: 'NUUMAQ==',
                },
                price: {
                    id: 88899590,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 376670,
                },
            },
            {
                id: 7637065,
                status: 'Visible',
                name: {
                    value: 'Atharwa Taide',
                    sign: 'RImyfg==',
                },
                price: {
                    id: 88899591,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 376671,
                },
            },
        ],
        parameters: [
            {
                key: 'FixtureParticipant',
                type: 'Long',
                value: '376660',
            },
            {
                key: 'Happening',
                type: 'String',
                value: 'Run',
            },
            {
                key: 'MarketType',
                type: 'String',
                value: 'TopScorer',
            },
            {
                key: 'Period',
                type: 'String',
                value: 'FullTime',
            },
            {
                key: 'Places',
                type: 'Integer',
                value: '1',
            },
            {
                key: 'Position',
                type: 'String',
                value: 'First',
            },
        ],
        grouping: {
            detailed: [
                {
                    subIndex: 1,
                    displayType: 'Regular',
                    marketGroupId: '2667892b-2074-4b8b-aa69-8a00285a2f2a',
                    marketGroupItemId: '783387a8-6c05-4aba-9061-34c7e23fc850',
                    orderType: 'None',
                    isFixturePlayerParticipant: false,
                },
            ],
        },
        isMain: false,
        templateCategory: {
            id: 0,
            category: 'Other',
        },
        comboPrevention: 'NoFixtureCombo',
        minCombo: 1,
        fixtureParticipantId: 376660,
        isEachWay: false,
        source: 'V2',
        isBetBuilder: false,
        participants: [
            {
                id: 376660,
                participantId: 709047,
                name: {
                    value: 'Punjab Kings',
                    sign: '7m0ECw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'HomeTeam',
                },
                source: 'V2',
            },
            {
                id: 376661,
                participantId: 709088,
                name: {
                    value: 'Delhi Capitals',
                    sign: 'eaWg7A==',
                },
                status: 'Unknown',
                properties: {
                    type: 'AwayTeam',
                },
                source: 'V2',
            },
            {
                id: 376670,
                participantId: 709077,
                name: {
                    value: 'Arshdeep Singh',
                    sign: '2WPGGw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                source: 'V2',
            },
            {
                id: 376671,
                participantId: 709079,
                name: {
                    value: 'Atharwa Taide',
                    sign: 'UBhAbg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                source: 'V2',
            },
            {
                id: 376674,
                participantId: 709099,
                name: {
                    value: 'Aniruddha Joshi',
                    sign: 'qPC96g==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376677,
                participantId: 709097,
                name: {
                    value: 'Gulbadin Naib',
                    sign: '8YsLhg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376676,
                participantId: 709121,
                name: {
                    value: 'Chetan Sakariya',
                    sign: 'rri0hg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376675,
                participantId: 709102,
                name: {
                    value: 'Axar Patel',
                    sign: 'NcF0rw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
        ],
    };

    awayTopRunScorer = {
        id: 2505612,
        name: {
            value: 'Delhi Capitals top batter',
            sign: '83W7ww==',
        },
        status: 'Visible',
        options: [
            {
                id: 7637088,
                status: 'Visible',
                name: {
                    value: 'Aniruddha Joshi',
                    sign: 'ibr6lg==',
                },
                price: {
                    id: 88899834,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 376674,
                },
            },
            {
                id: 7637089,
                status: 'Visible',
                name: {
                    value: 'Axar Patel',
                    sign: 'lQETug==',
                },
                price: {
                    id: 88899835,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 376675,
                },
            },
            {
                id: 7637090,
                status: 'Visible',
                name: {
                    value: 'Chetan Sakariya',
                    sign: 'y1FswQ==',
                },
                price: {
                    id: 88899836,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 376676,
                },
            },
            {
                id: 7637091,
                status: 'Visible',
                name: {
                    value: 'Gulbadin Naib',
                    sign: '4JcxEA==',
                },
                price: {
                    id: 88899837,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 376677,
                },
            },
        ],
        parameters: [
            {
                key: 'FixtureParticipant',
                type: 'Long',
                value: '376661',
            },
            {
                key: 'Happening',
                type: 'String',
                value: 'Run',
            },
            {
                key: 'MarketType',
                type: 'String',
                value: 'TopScorer',
            },
            {
                key: 'Period',
                type: 'String',
                value: 'FullTime',
            },
            {
                key: 'Places',
                type: 'Integer',
                value: '1',
            },
            {
                key: 'Position',
                type: 'String',
                value: 'First',
            },
        ],
        grouping: {
            detailed: [
                {
                    subIndex: 1,
                    displayType: 'Regular',
                    marketGroupId: '2667892b-2074-4b8b-aa69-8a00285a2f2a',
                    marketGroupItemId: '2615b25c-15e2-4023-8737-ec9a24df305d',
                    orderType: 'None',
                    isFixturePlayerParticipant: false,
                },
            ],
        },
        isMain: false,
        templateCategory: {
            id: 0,
            category: 'Other',
        },
        comboPrevention: 'NoFixtureCombo',
        minCombo: 1,
        fixtureParticipantId: 376661,
        isEachWay: false,
        source: 'V2',
        isBetBuilder: false,
        participants: [
            {
                id: 376660,
                participantId: 709047,
                name: {
                    value: 'Punjab Kings',
                    sign: '7m0ECw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'HomeTeam',
                },
                source: 'V2',
            },
            {
                id: 376661,
                participantId: 709088,
                name: {
                    value: 'Delhi Capitals',
                    sign: 'eaWg7A==',
                },
                status: 'Unknown',
                properties: {
                    type: 'AwayTeam',
                },
                source: 'V2',
            },
            {
                id: 376670,
                participantId: 709077,
                name: {
                    value: 'Arshdeep Singh',
                    sign: '2WPGGw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                source: 'V2',
            },
            {
                id: 376671,
                participantId: 709079,
                name: {
                    value: 'Atharwa Taide',
                    sign: 'UBhAbg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                source: 'V2',
            },
            {
                id: 376674,
                participantId: 709099,
                name: {
                    value: 'Aniruddha Joshi',
                    sign: 'qPC96g==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376677,
                participantId: 709097,
                name: {
                    value: 'Gulbadin Naib',
                    sign: '8YsLhg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376676,
                participantId: 709121,
                name: {
                    value: 'Chetan Sakariya',
                    sign: 'rri0hg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376675,
                participantId: 709102,
                name: {
                    value: 'Axar Patel',
                    sign: 'NcF0rw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
        ],
    };

    totalSixes = {
        id: 2505583,
        name: {
            value: 'Total Match Sixes',
            sign: '5uDvKA==',
        },
        status: 'Visible',
        options: [
            {
                id: 7637014,
                status: 'Visible',
                name: {
                    value: 'Over 1.4',
                    sign: 'Ro+IXg==',
                },
                price: {
                    id: 88899012,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Over'],
                },
            },
            {
                id: 7637015,
                status: 'Visible',
                name: {
                    value: 'Under 1.4',
                    sign: 'PY7p6g==',
                },
                price: {
                    id: 88899013,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Under'],
                },
            },
        ],
        parameters: [
            {
                key: 'DecimalValue',
                type: 'Decimal',
                value: '1.4',
            },
            {
                key: 'Happening',
                type: 'String',
                value: 'Six',
            },
            {
                key: 'MarketType',
                type: 'String',
                value: 'Over/Under',
            },
            {
                key: 'Period',
                type: 'String',
                value: 'FullTime',
            },
        ],
        grouping: {
            detailed: [
                {
                    subIndex: 1,
                    displayType: 'OverUnder',
                    marketGroupId: '2667892b-2074-4b8b-aa69-8a00285a2f2a',
                    marketGroupItemId: '8d2ead5b-e0d4-42c9-bc44-be451d6edff1',
                    orderType: 'None',
                    isFixturePlayerParticipant: false,
                },
            ],
        },
        attr: '1.4',
        isMain: false,
        templateCategory: {
            id: 0,
            category: 'Other',
        },
        comboPrevention: 'NoFixtureCombo',
        minCombo: 1,
        isEachWay: false,
        source: 'V2',
        isBetBuilder: false,
        participants: [
            {
                id: 376660,
                participantId: 709047,
                name: {
                    value: 'Punjab Kings',
                    sign: '7m0ECw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'HomeTeam',
                },
                source: 'V2',
            },
            {
                id: 376661,
                participantId: 709088,
                name: {
                    value: 'Delhi Capitals',
                    sign: 'eaWg7A==',
                },
                status: 'Unknown',
                properties: {
                    type: 'AwayTeam',
                },
                source: 'V2',
            },
            {
                id: 376670,
                participantId: 709077,
                name: {
                    value: 'Arshdeep Singh',
                    sign: '2WPGGw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                source: 'V2',
            },
            {
                id: 376671,
                participantId: 709079,
                name: {
                    value: 'Atharwa Taide',
                    sign: 'UBhAbg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709047,
                },
                source: 'V2',
            },
            {
                id: 376674,
                participantId: 709099,
                name: {
                    value: 'Aniruddha Joshi',
                    sign: 'qPC96g==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376677,
                participantId: 709097,
                name: {
                    value: 'Gulbadin Naib',
                    sign: '8YsLhg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376676,
                participantId: 709121,
                name: {
                    value: 'Chetan Sakariya',
                    sign: 'rri0hg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
            {
                id: 376675,
                participantId: 709102,
                name: {
                    value: 'Axar Patel',
                    sign: 'NcF0rw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709088,
                },
                source: 'V2',
            },
        ],
    };

    testMatchBetting = {
        id: 2447541,
        name: {
            value: 'Match Betting',
            sign: '1tFMqQ==',
        },
        status: 'Visible',
        options: [
            {
                id: 7438720,
                status: 'Visible',
                name: {
                    value: 'Sunrisers Hyderabad',
                    sign: 'zsDJ6Q==',
                },
                price: {
                    id: 86566410,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Max'],
                    fixtureParticipant: 368305,
                },
            },
            {
                id: 7438721,
                status: 'Visible',
                name: {
                    value: 'Draw',
                    sign: '4dryrg==',
                },
                price: {
                    id: 86566411,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Draw'],
                },
            },
            {
                id: 7438722,
                status: 'Visible',
                name: {
                    value: 'Mumbai Indians',
                    sign: 'SU1z2A==',
                },
                price: {
                    id: 86566412,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Max'],
                    fixtureParticipant: 368306,
                },
            },
        ],
        parameters: [
            {
                key: 'Happening',
                type: 'String',
                value: 'Run',
            },
            {
                key: 'MarketType',
                type: 'String',
                value: '3way',
            },
            {
                key: 'Period',
                type: 'String',
                value: 'FullTime',
            },
        ],
        grouping: {
            detailed: [
                {
                    displayType: 'Regular',
                    marketGroupId: '2667892b-2074-4b8b-aa69-8a00285a2f2a',
                    marketGroupItemId: '02cb7a2e-8e6c-4a9e-8895-4cc0bfc95d29',
                    orderType: 'None',
                    isFixturePlayerParticipant: false,
                },
            ],
        },
        isMain: false,
        templateCategory: {
            id: 0,
            category: 'Other',
        },
        comboPrevention: 'NoFixtureCombo',
        minCombo: 1,
        isEachWay: false,
        source: 'V2',
        isBetBuilder: false,
        participants: [
            {
                id: 368305,
                participantId: 709337,
                name: {
                    value: 'Sunrisers Hyderabad',
                    sign: 'GnkraA==',
                },
                status: 'Unknown',
                properties: {
                    type: 'HomeTeam',
                },
                source: 'V2',
            },
            {
                id: 368306,
                participantId: 709302,
                name: {
                    value: 'Mumbai Indians',
                    sign: 'EYl91Q==',
                },
                status: 'Unknown',
                properties: {
                    type: 'AwayTeam',
                },
                source: 'V2',
            },
            {
                id: 368307,
                participantId: 709351,
                name: {
                    value: 'Abdul Samad',
                    sign: 'JpAkOw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368309,
                participantId: 709338,
                name: {
                    value: 'Bhuvneshwar Kumar',
                    sign: 'li7YXw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368313,
                participantId: 709322,
                name: {
                    value: 'Aryan Juyal',
                    sign: 'vcyOlg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368311,
                participantId: 709308,
                name: {
                    value: 'Aditya Tare',
                    sign: 'oRwJ/Q==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368308,
                participantId: 709344,
                name: {
                    value: 'Aiden Markram',
                    sign: 'A6IGFQ==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368312,
                participantId: 709328,
                name: {
                    value: 'Anshul Kamboj',
                    sign: 'rx8E6A==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368310,
                participantId: 709342,
                name: {
                    value: 'Heinrich Klaasen',
                    sign: 'OG+Obg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368314,
                participantId: 714746,
                name: {
                    value: 'David, Tim',
                    sign: 'buz5qQ==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
        ],
    };

    testMatchHomeBatter = {
        id: 2447540,
        name: {
            value: '1st innings - Sunrisers Hyderabad top batter',
            sign: 'c9kEkQ==',
        },
        status: 'Visible',
        options: [
            {
                id: 7438719,
                status: 'Visible',
                name: {
                    value: 'Heinrich Klaasen',
                    sign: '6v1uKg==',
                },
                price: {
                    id: 86566409,
                    numerator: 1,
                    denominator: 40,
                    odds: 1.025,
                    americanOdds: -5000,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 368310,
                },
            },
            {
                id: 7438717,
                status: 'Visible',
                name: {
                    value: 'Aiden Markram',
                    sign: 'OAqIcA==',
                },
                price: {
                    id: 86566407,
                    numerator: 2,
                    denominator: 15,
                    odds: 1.13,
                    americanOdds: -750,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 368308,
                },
            },
            {
                id: 7438718,
                status: 'Visible',
                name: {
                    value: 'Bhuvneshwar Kumar',
                    sign: 'GlykWg==',
                },
                price: {
                    id: 86566408,
                    numerator: 46,
                    denominator: 100,
                    odds: 1.46,
                    americanOdds: -225,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 368309,
                },
            },
            {
                id: 7438716,
                status: 'Visible',
                name: {
                    value: 'Abdul Samad',
                    sign: 'Bk73mA==',
                },
                price: {
                    id: 86566406,
                    numerator: 21,
                    denominator: 20,
                    odds: 2.05,
                    americanOdds: 105,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 368307,
                },
            },
        ],
        parameters: [
            {
                key: 'FixtureParticipant',
                type: 'Long',
                value: '368305',
            },
            {
                key: 'Happening',
                type: 'String',
                value: 'Run',
            },
            {
                key: 'MarketType',
                type: 'String',
                value: 'TopScorer',
            },
            {
                key: 'Period',
                type: 'String',
                value: 'Innings',
            },
            {
                key: 'PeriodNumber',
                type: 'Integer',
                value: '1',
            },
            {
                key: 'Places',
                type: 'Integer',
                value: '1',
            },
            {
                key: 'Position',
                type: 'String',
                value: 'First',
            },
        ],
        grouping: {
            detailed: [
                {
                    subIndex: 1,
                    displayType: 'Regular',
                    marketGroupId: 'ec8952c8-5df0-4658-b061-21737c7d6ba4',
                    marketGroupItemId: '49a52748-21cf-4c7b-bff5-1fef4da375f6',
                    orderType: 'None',
                    isFixturePlayerParticipant: false,
                },
            ],
        },
        isMain: false,
        templateCategory: {
            id: 0,
            category: 'Other',
        },
        comboPrevention: 'NoFixtureCombo',
        minCombo: 1,
        fixtureParticipantId: 368305,
        isEachWay: false,
        source: 'V2',
        isBetBuilder: false,
        participants: [
            {
                id: 368305,
                participantId: 709337,
                name: {
                    value: 'Sunrisers Hyderabad',
                    sign: 'GnkraA==',
                },
                status: 'Unknown',
                properties: {
                    type: 'HomeTeam',
                },
                source: 'V2',
            },
            {
                id: 368306,
                participantId: 709302,
                name: {
                    value: 'Mumbai Indians',
                    sign: 'EYl91Q==',
                },
                status: 'Unknown',
                properties: {
                    type: 'AwayTeam',
                },
                source: 'V2',
            },
            {
                id: 368307,
                participantId: 709351,
                name: {
                    value: 'Abdul Samad',
                    sign: 'JpAkOw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368309,
                participantId: 709338,
                name: {
                    value: 'Bhuvneshwar Kumar',
                    sign: 'li7YXw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368313,
                participantId: 709322,
                name: {
                    value: 'Aryan Juyal',
                    sign: 'vcyOlg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368311,
                participantId: 709308,
                name: {
                    value: 'Aditya Tare',
                    sign: 'oRwJ/Q==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368308,
                participantId: 709344,
                name: {
                    value: 'Aiden Markram',
                    sign: 'A6IGFQ==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368312,
                participantId: 709328,
                name: {
                    value: 'Anshul Kamboj',
                    sign: 'rx8E6A==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368310,
                participantId: 709342,
                name: {
                    value: 'Heinrich Klaasen',
                    sign: 'OG+Obg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368314,
                participantId: 714746,
                name: {
                    value: 'David, Tim',
                    sign: 'buz5qQ==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
        ],
    };

    testMatchAwayBatter = {
        id: 2447539,
        name: {
            value: '1st innings - MUmbai indians top batter',
            sign: '7PHrUw==',
        },
        status: 'Visible',
        options: [
            {
                id: 7438713,
                status: 'Visible',
                name: {
                    value: 'Anshul Kamboj',
                    sign: 'NnJWIw==',
                },
                price: {
                    id: 86566403,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 368312,
                },
            },
            {
                id: 7438714,
                status: 'Visible',
                name: {
                    value: 'Aryan Juyal',
                    sign: 'Uq+elg==',
                },
                price: {
                    id: 86566404,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 368313,
                },
            },
            {
                id: 7438715,
                status: 'Visible',
                name: {
                    value: 'David, Tim',
                    sign: 'AUjQrA==',
                },
                price: {
                    id: 86566405,
                    odds: 1,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 368314,
                },
            },
            {
                id: 7438712,
                status: 'Visible',
                name: {
                    value: 'Aditya Tare',
                    sign: 'gcLaXg==',
                },
                price: {
                    id: 86566402,
                    numerator: 27,
                    denominator: 100,
                    odds: 1.27,
                    americanOdds: -375,
                },
                parameters: {
                    optionTypes: ['Ranked'],
                    fixtureParticipant: 368311,
                },
            },
        ],
        parameters: [
            {
                key: 'FixtureParticipant',
                type: 'Long',
                value: '368306',
            },
            {
                key: 'Happening',
                type: 'String',
                value: 'Run',
            },
            {
                key: 'MarketType',
                type: 'String',
                value: 'TopScorer',
            },
            {
                key: 'Period',
                type: 'String',
                value: 'Innings',
            },
            {
                key: 'PeriodNumber',
                type: 'Integer',
                value: '1',
            },
            {
                key: 'Places',
                type: 'Integer',
                value: '1',
            },
            {
                key: 'Position',
                type: 'String',
                value: 'First',
            },
        ],
        grouping: {
            detailed: [
                {
                    subIndex: 1,
                    displayType: 'Regular',
                    marketGroupId: 'ec8952c8-5df0-4658-b061-21737c7d6ba4',
                    marketGroupItemId: 'e63a56f1-bdac-4cfe-8fc2-68e6dd669357',
                    orderType: 'None',
                    isFixturePlayerParticipant: false,
                },
            ],
        },
        isMain: false,
        templateCategory: {
            id: 0,
            category: 'Other',
        },
        comboPrevention: 'NoFixtureCombo',
        minCombo: 1,
        fixtureParticipantId: 368306,
        isEachWay: false,
        source: 'V2',
        isBetBuilder: false,
        participants: [
            {
                id: 368305,
                participantId: 709337,
                name: {
                    value: 'Sunrisers Hyderabad',
                    sign: 'GnkraA==',
                },
                status: 'Unknown',
                properties: {
                    type: 'HomeTeam',
                },
                source: 'V2',
            },
            {
                id: 368306,
                participantId: 709302,
                name: {
                    value: 'Mumbai Indians',
                    sign: 'EYl91Q==',
                },
                status: 'Unknown',
                properties: {
                    type: 'AwayTeam',
                },
                source: 'V2',
            },
            {
                id: 368307,
                participantId: 709351,
                name: {
                    value: 'Abdul Samad',
                    sign: 'JpAkOw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368309,
                participantId: 709338,
                name: {
                    value: 'Bhuvneshwar Kumar',
                    sign: 'li7YXw==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368313,
                participantId: 709322,
                name: {
                    value: 'Aryan Juyal',
                    sign: 'vcyOlg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368311,
                participantId: 709308,
                name: {
                    value: 'Aditya Tare',
                    sign: 'oRwJ/Q==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368308,
                participantId: 709344,
                name: {
                    value: 'Aiden Markram',
                    sign: 'A6IGFQ==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368312,
                participantId: 709328,
                name: {
                    value: 'Anshul Kamboj',
                    sign: 'rx8E6A==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
            {
                id: 368310,
                participantId: 709342,
                name: {
                    value: 'Heinrich Klaasen',
                    sign: 'OG+Obg==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709337,
                },
                source: 'V2',
            },
            {
                id: 368314,
                participantId: 714746,
                name: {
                    value: 'David, Tim',
                    sign: 'buz5qQ==',
                },
                status: 'Unknown',
                properties: {
                    type: 'Player',
                    team: 709302,
                },
                source: 'V2',
            },
        ],
    };
}
