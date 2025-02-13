import { OptionalMarket } from '../models/foot-ball-cds-template.model';

export class MockFootBallCdsData {
    finalResult: OptionalMarket = {
        id: 61148888,
        name: {
            value: 'Match Result',
            sign: 'NY5olg==',
        },
        options: [
            {
                id: 281303098,
                status: 'Visible',
                name: {
                    value: 'GANDHINAGAR FC',
                    sign: '2MJI6Q==',
                },
                sourceName: {
                    value: '1',
                },
                price: {
                    id: 851176907,
                    numerator: 27,
                    denominator: 4,
                    odds: 7.75,
                    americanOdds: 675,
                },
            },
            {
                id: 281303099,
                status: 'Visible',
                name: {
                    value: 'X',
                    sign: 'JaqqrQ==',
                },
                price: {
                    id: 851176913,
                    numerator: 78,
                    denominator: 100,
                    odds: 1.78,
                    americanOdds: -130,
                },
            },
            {
                id: 281303100,
                status: 'Visible',
                name: {
                    value: 'FC Legnago Salus SSD',
                    sign: 'SymoFw==',
                },
                sourceName: {
                    value: '2',
                },
                price: {
                    id: 851176919,
                    numerator: 7,
                    denominator: 10,
                    odds: 1.7,
                    americanOdds: -145,
                },
            },
        ],
    };

    bothTeamsToScore: OptionalMarket = {
        id: 60439248,
        name: {
            value: 'Both teams to score',
            sign: 'GQYHHA==',
        },
        options: [
            {
                id: 278388749,
                status: 'visible',
                name: {
                    value: 'Yes',
                    sign: 'sr0lNA==',
                },
                price: {
                    id: 836824730,
                    numerator: 68,
                    denominator: 100,
                    odds: 1.68,
                    americanOdds: -145,
                },
            },
            {
                id: 278388750,
                status: 'visible',
                name: {
                    value: 'no ',
                    sign: 'yiDavg==',
                },
                price: {
                    id: 836824733,
                    numerator: 1,
                    denominator: 1,
                    odds: 2,
                    americanOdds: 100,
                },
            },
        ],
    };

    matchResultBothTeamtoScore: OptionalMarket = {
        name: {
            value: 'Match Result and Both Teams to Score',
            sign: 'fIrDyQ==',
        },
        options: [
            {
                id: 296690750,
                status: 'Visible',
                name: {
                    value: 'Nagoya Grampus to win and both teams to score',
                    sign: 'lkseUw==',
                },
                price: {
                    id: 914613276,
                    numerator: 13,
                    denominator: 5,
                    odds: 3.6,
                    americanOdds: 260,
                },
                parameters: {
                    fixtureParticipant: 21273168,
                },
            },
            {
                id: 296690751,
                status: 'Visible',
                name: {
                    value: 'Stevenage FC to win and both teams to score',
                    sign: 'rND3Ag==',
                },
                price: {
                    id: 914613277,
                    numerator: 87,
                    denominator: 100,
                    odds: 1.87,
                    americanOdds: -115,
                },
                parameters: {
                    fixtureParticipant: 21273167,
                },
            },
            {
                id: 296690752,
                status: 'Visible',
                name: {
                    value: 'Nagoya Grampus to win and Stevenage FC not to score',
                    sign: 'Fj9gSA==',
                },
                price: {
                    id: 914613278,
                    numerator: 14,
                    denominator: 5,
                    odds: 3.8,
                    americanOdds: 280,
                },
                parameters: {
                    fixtureParticipant: 21273168,
                },
            },
            {
                id: 296690753,
                status: 'Visible',
                name: {
                    value: 'Stevenage FC to win and Nagoya Grampus not to score',
                    sign: 'nwdczg==',
                },
                price: {
                    id: 914613279,
                    numerator: 78,
                    denominator: 100,
                    odds: 1.78,
                    americanOdds: -130,
                },
                parameters: {
                    fixtureParticipant: 21273167,
                },
            },
            {
                id: 296690754,
                status: 'Visible',
                name: {
                    value: 'Both teams to score and the match to end in a draw',
                    sign: 'i/UWuA==',
                },
                price: {
                    id: 914613280,
                    numerator: 33,
                    denominator: 20,
                    odds: 2.65,
                    americanOdds: 165,
                },
                parameters: {
                    fixtureParticipant: 21273168,
                },
            },
            {
                id: 296690755,
                status: 'Visible',
                name: {
                    value: 'Both teams not to score',
                    sign: '6Ssauw==',
                },
                price: {
                    id: 914613281,
                    numerator: 18,
                    denominator: 5,
                    odds: 4.6,
                    americanOdds: 360,
                },
                parameters: {
                    fixtureParticipant: 21273168,
                },
            },
        ],

        participants: [
            {
                id: 21273167,
                participantId: 234871,
                name: {
                    value: 'Nagoya Grampus',
                    sign: 'mukQvA==',
                },
                properties: {
                    type: 'HomeTeam',
                },
            },
            {
                id: 21273168,
                participantId: 245994,
                name: {
                    value: 'Stevenage FC',
                    sign: 'U+z0JQ==',
                },

                properties: {
                    type: 'AwayTeam',
                },
            },
            {
                id: 21276405,
                participantId: 225015,
                name: {
                    value: 'Kabak, Ozan',
                    sign: 'gYvG/Q==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276404,
                participantId: 225045,
                name: {
                    value: 'Griezmann, Antoine',
                    sign: 'dBT8DQ==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276402,
                participantId: 224989,
                name: {
                    value: 'Bolat, Sinan',
                    sign: 'H/62+Q==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276406,
                participantId: 225019,
                name: {
                    value: 'Sangare, Nazim',
                    sign: 'nj0fVw==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276401,
                participantId: 224991,
                name: {
                    value: 'Kaldirim, Hasan Ali',
                    sign: '5EDrJg==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276398,
                participantId: 225004,
                name: {
                    value: 'Yazici, Yusuf',
                    sign: 'MBxUGA==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276407,
                participantId: 225051,
                name: {
                    value: 'South Tulsa County',
                    sign: 'CJgP0w==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276403,
                participantId: 224990,
                name: {
                    value: 'Celik, Zeki',
                    sign: 'l2mm/Q==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276395,
                participantId: 225043,
                name: {
                    value: 'Busquets, Sergio',
                    sign: 'nJVY4g==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276408,
                participantId: 225024,
                name: {
                    value: 'Tokoz, Dorukhan',
                    sign: 'Qkd22Q==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276397,
                participantId: 225011,
                name: {
                    value: 'Ünal, Enes',
                    sign: 'IqrLGQ==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276399,
                participantId: 224993,
                name: {
                    value: 'Soyuncu, Caglar',
                    sign: '0bZETQ==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276400,
                participantId: 225007,
                name: {
                    value: 'Meras, Cengiz Umut',
                    sign: '+pDzfQ==',
                },

                properties: {
                    type: 'Player',
                },
            },
            {
                id: 21276396,
                participantId: 225001,
                name: {
                    value: 'Tosun, Cenk',
                    sign: 'UBhXlw==',
                },

                properties: {
                    type: 'Player',
                },
            },
        ],
    };

    TotalScore1: OptionalMarket = {
        id: 60439537,
        name: {
            value: 'Total Goals',
            sign: 'ok/ILw==',
        },
        options: [
            {
                id: 278390994,
                status: 'visible',
                name: {
                    value: 'Over 1,5',
                    sign: 'HRZVYQ==',
                },
                price: {
                    id: 836831525,
                    numerator: 19,
                    denominator: 100,
                    odds: 1.19,
                    americanOdds: -550,
                },
            },
            {
                id: 278390995,
                status: 'visible',
                name: {
                    value: 'Under 1,5',
                    sign: '42zBSQ==',
                },
                price: {
                    id: 836831528,
                    numerator: 3,
                    denominator: 1,
                    odds: 4,
                    americanOdds: 300,
                },
            },
        ],
    };

    totalScore2: OptionalMarket = {
        id: 60439538,
        name: {
            value: 'Total Goals',
            sign: 'YWJcnA==',
        },
        options: [
            {
                id: 278390996,
                status: 'visible',
                name: {
                    value: 'Over 2,5',
                    sign: 'FPou0w==',
                },
                price: {
                    id: 836831531,
                    numerator: 3,
                    denominator: 5,
                    odds: 1.6,
                    americanOdds: -165,
                },
            },
            {
                id: 278390997,
                status: 'visible',
                name: {
                    value: 'Under 2,5',
                    sign: 'HL5cIA==',
                },
                price: {
                    id: 836831534,
                    numerator: 11,
                    denominator: 10,
                    odds: 2.1,
                    americanOdds: 110,
                },
            },
        ],
    };
    totlaScore3: OptionalMarket = {
        id: 60439539,
        name: {
            value: 'Total Goals',
            sign: 'IHnQ8g==',
        },
        options: [
            {
                id: 278390998,
                status: 'visible',
                name: {
                    value: 'Over 3,5',
                    sign: 'LFzXCw==',
                },
                price: {
                    id: 836831537,
                    numerator: 29,
                    denominator: 20,
                    odds: 2.45,
                    americanOdds: 145,
                },
            },
            {
                id: 278390999,
                status: 'visible',
                name: {
                    value: 'Under 3,5',
                    sign: 'dvL4sQ==',
                },
                price: {
                    id: 836831540,
                    numerator: 4,
                    denominator: 9,
                    odds: 1.44,
                    americanOdds: -225,
                },
            },
        ],
    };

    goalScorer: OptionalMarket = {
        id: 65425513,
        name: {
            value: '1st Goalscorer',
            sign: 'SbCP8A==',
        },
        status: 'Visible',
        options: [
            {
                id: 300955295,
                status: 'Visible',
                name: {
                    value: 'Alfie Williams',
                    sign: '2TUm9g==',
                },
                price: {
                    id: 933382911,
                    numerator: 2,
                    denominator: 1,
                    odds: 3,
                    americanOdds: 200,
                },
                participantId: 21705602,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21705602,
                },
            },
            {
                id: 300955297,
                status: 'Suspended',
                name: {
                    value: 'Marcus Dinanga',
                    sign: '91Jz3w==',
                },
                price: {
                    id: 933382923,
                    numerator: 4,
                    denominator: 1,
                    odds: 5,
                    americanOdds: 400,
                },
                participantId: 21707761,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707761,
                },
            },
            {
                id: 300955298,
                status: 'Visible',
                name: {
                    value: 'Battocchio, Cristian',
                    sign: 'iXRdFA==',
                },
                price: {
                    id: 933382929,
                    numerator: 5,
                    denominator: 1,
                    odds: 6,
                    americanOdds: 500,
                },
                participantId: 21707762,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707762,
                },
            },
            {
                id: 300955299,
                status: 'Visible',
                name: {
                    value: 'Luther Wildin',
                    sign: 'yN5yZw==',
                },
                price: {
                    id: 933382935,
                    numerator: 6,
                    denominator: 1,
                    odds: 7,
                    americanOdds: 600,
                },
                participantId: 21707763,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707763,
                },
            },
            {
                id: 300955300,
                status: 'Visible',
                name: {
                    value: 'Fujita, Joel Chima',
                    sign: 'ES40bA==',
                },
                price: {
                    id: 933382941,
                    numerator: 7,
                    denominator: 1,
                    odds: 8,
                    americanOdds: 700,
                },
                participantId: 21707764,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707764,
                },
            },
            {
                id: 300955301,
                status: 'Visible',
                name: {
                    value: 'Ben Coker',
                    sign: '/6C++A==',
                },
                price: {
                    id: 933382947,
                    numerator: 8,
                    denominator: 1,
                    odds: 9,
                    americanOdds: 800,
                },
                participantId: 21705605,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21705605,
                },
            },
            {
                id: 300955302,
                status: 'Visible',
                name: {
                    value: 'Cvetinovic, Dusan',
                    sign: 'UhoGzw==',
                },
                price: {
                    id: 933382953,
                    numerator: 9,
                    denominator: 1,
                    odds: 10,
                    americanOdds: 900,
                },
                participantId: 21707765,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707765,
                },
            },
            {
                id: 300955303,
                status: 'Visible',
                name: {
                    value: 'Jamie Cumming',
                    sign: 'XF7eMQ==',
                },
                price: {
                    id: 933382959,
                    numerator: 10,
                    denominator: 1,
                    odds: 11,
                    americanOdds: 1000,
                },
                participantId: 21707766,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707766,
                },
            },
            {
                id: 300955304,
                status: 'Visible',
                name: {
                    value: 'Caca',
                    sign: 'BonAPQ==',
                },
                price: {
                    id: 933382965,
                    numerator: 11,
                    denominator: 1,
                    odds: 12,
                    americanOdds: 1100,
                },
                participantId: 21707767,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707767,
                },
            },
            {
                id: 300955305,
                status: 'Suspended',
                name: {
                    value: 'Romain Vincelot',
                    sign: '45BbAg==',
                },
                price: {
                    id: 933382971,
                    numerator: 12,
                    denominator: 1,
                    odds: 13,
                    americanOdds: 1200,
                },
                participantId: 21707768,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707768,
                },
            },
            {
                id: 300955307,
                status: 'Visible',
                name: {
                    value: 'Edoojon Kawakami, Chie',
                    sign: 'ZNS3CA==',
                },
                price: {
                    id: 933382983,
                    numerator: 14,
                    denominator: 1,
                    odds: 15,
                    americanOdds: 1400,
                },
                participantId: 21707770,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707770,
                },
            },
            {
                id: 300955308,
                status: 'Visible',
                name: {
                    value: 'Fujiwara, Shiryu',
                    sign: 'pvrE+w==',
                },
                price: {
                    id: 933382989,
                    numerator: 15,
                    denominator: 1,
                    odds: 16,
                    americanOdds: 1500,
                },
                participantId: 21707771,
                parameters: {
                    optionTypes: ['ToHappen'],
                    fixtureParticipant: 21707771,
                },
            },
        ],
        parameters: [
            {
                key: 'Happening',
                type: 'String',
                value: 'Goal',
            },
            {
                key: 'MarketType',
                type: 'String',
                value: 'Scorer',
            },
            {
                key: 'Period',
                type: 'String',
                value: 'RegularTime',
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
        // "grouping": {
        //     "gridGroups": [
        //         "nvlaka0r7"
        //     ],
        //     "detailed": [
        //         {
        //             "marketTabId": 5,
        //             "optionColumnId": 1,
        //             "marketHelpPath": "Football/Goalscorer (Single tab)",
        //             "name": "Goalscorers",
        //             "displayType": "GoalScorer",
        //             "marketGroupId": "a4d05744-299a-4b5b-8dc9-bbc8c291d801",
        //             "marketGroupItemId": "46d246ee-aec5-4402-95f6-0d4cf6cdac45",
        //             "orderType": "None"
        //         }
        //     ]
        // },
        // "isMain": false,
        // "templateCategory": {
        //     "id": 0,
        //     "category": "Gridable"
        // },
        // "comboPrevention": "NoFixtureCombo",
        // "minCombo": 1,
        // "isEachWay": false,
        // "source": "V2",
        // "isBetBuilder": false,
        participants: [
            {
                id: 21705432,
                participantId: 245994,
                name: {
                    value: 'Stevenage FC',
                    sign: '6gwSnw==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'HomeTeam',
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705433,
                participantId: 234498,
                name: {
                    value: 'Tokushima Vortis',
                    sign: 'oFoFiA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'AwayTeam',
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705610,
                participantId: 246003,
                name: {
                    value: 'Danny Newton',
                    sign: 'QBgq7w==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705605,
                participantId: 245997,
                name: {
                    value: 'Ben Coker',
                    sign: 'tZ0bdw==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705611,
                participantId: 246039,
                name: {
                    value: 'David Stockdale',
                    sign: 'Qdqmpw==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705602,
                participantId: 246026,
                name: {
                    value: 'Alfie Williams',
                    sign: 'bXst4Q==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705613,
                participantId: 246002,
                name: {
                    value: 'Elliot Osborne',
                    sign: '+hXEBA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705609,
                participantId: 246046,
                name: {
                    value: 'Chris Lines',
                    sign: 'y+WgFg==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705614,
                participantId: 246017,
                name: {
                    value: 'Femi Akinwande',
                    sign: 'CZT96w==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705615,
                participantId: 246047,
                name: {
                    value: 'Finlay Johnson',
                    sign: 'ZrCKNA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705604,
                participantId: 246008,
                name: {
                    value: 'Arthur Iontton',
                    sign: '1b/7AA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705606,
                participantId: 246005,
                name: {
                    value: 'Billy Johnson',
                    sign: 'fnQeiQ==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705612,
                participantId: 246010,
                name: {
                    value: 'Elliot List',
                    sign: '/ynN5w==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705603,
                participantId: 246015,
                name: {
                    value: 'Arthur Read',
                    sign: 'PwL+bA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705608,
                participantId: 255218,
                name: {
                    value: 'Charlie Carter',
                    sign: 'siUczQ==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21705607,
                participantId: 246001,
                name: {
                    value: 'Carter, Charlie',
                    sign: 'QRqniA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707769,
                participantId: 246000,
                name: {
                    value: 'Luke Prosser',
                    sign: 'Vbp86A==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707770,
                participantId: 234558,
                name: {
                    value: 'Edoojon Kawakami, Chie',
                    sign: 'mNQXfQ==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 234498,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707767,
                participantId: 234522,
                name: {
                    value: 'Caca',
                    sign: 'kYpClA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 234498,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707771,
                participantId: 234556,
                name: {
                    value: 'Fujiwara, Shiryu',
                    sign: '6y6CMw==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 234498,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707766,
                participantId: 245995,
                name: {
                    value: 'Jamie Cumming',
                    sign: 'jtiCDw==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707761,
                participantId: 245299,
                name: {
                    value: 'Marcus Dinanga',
                    sign: 'gV7wiw==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707760,
                participantId: 234543,
                name: {
                    value: 'Abe, Takashi',
                    sign: 'uiCq0A==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 234498,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707768,
                participantId: 245998,
                name: {
                    value: 'Romain Vincelot',
                    sign: 'Ny+OtQ==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707763,
                participantId: 245996,
                name: {
                    value: 'Luther Wildin',
                    sign: 'PoEpOg==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 245994,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707764,
                participantId: 234520,
                name: {
                    value: 'Fujita, Joel Chima',
                    sign: 'UHbSVw==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 234498,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707762,
                participantId: 234562,
                name: {
                    value: 'Battocchio, Cristian',
                    sign: '7eiPmA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 234498,
                },
                options: [],
                source: 'V2',
            },
            {
                id: 21707765,
                participantId: 234503,
                name: {
                    value: 'Cvetinovic, Dusan',
                    sign: 'ZyJpHA==',
                },
                status: 'NotDefined',
                properties: {
                    type: 'Player',
                    team: 234498,
                },
                options: [],
                source: 'V2',
            },
        ],
    };

    correctScore: OptionalMarket = {
        id: 60442011,
        name: {
            value: 'Correct Score',
            sign: 'szKGjA==',
        },
        options: [
            {
                id: 278399137,
                status: 'visible',
                name: {
                    value: '0:0',
                    sign: 'hxH6ZQ==',
                },
                price: {
                    id: 836883823,
                    numerator: 19,
                    denominator: 1,
                    odds: 20,
                    americanOdds: 1900,
                },
            },
            {
                id: 278399138,
                status: 'visible',
                name: {
                    value: '1:0',
                    sign: 'Gf1uxw==',
                },
                price: {
                    id: 836883826,
                    numerator: 23,
                    denominator: 2,
                    odds: 12.5,
                    americanOdds: 1150,
                },
            },
            {
                id: 278399139,
                status: 'visible',
                name: {
                    value: '1:1',
                    sign: '102LZw==',
                },
                price: {
                    id: 836883829,
                    numerator: 25,
                    denominator: 4,
                    odds: 7.25,
                    americanOdds: 625,
                },
            },
            {
                id: 278399140,
                status: 'visible',
                name: {
                    value: '0:1',
                    sign: 'q6x3LA==',
                },
                price: {
                    id: 836883832,
                    numerator: 6,
                    denominator: 1,
                    odds: 7,
                    americanOdds: 600,
                },
            },
            {
                id: 278399141,
                status: 'visible',
                name: {
                    value: '2:0',
                    sign: 'C8gWjw==',
                },
                price: {
                    id: 836883835,
                    numerator: 19,
                    denominator: 1,
                    odds: 20,
                    americanOdds: 1900,
                },
            },
            {
                id: 278399142,
                status: 'visible',
                name: {
                    value: '2:1',
                    sign: 'NH5HWw==',
                },
                price: {
                    id: 836883838,
                    numerator: 23,
                    denominator: 2,
                    odds: 12.5,
                    americanOdds: 1150,
                },
            },
            {
                id: 278399143,
                status: 'visible',
                name: {
                    value: '2:2',
                    sign: '1q+sFQ==',
                },
                price: {
                    id: 836883841,
                    numerator: 11,
                    denominator: 1,
                    odds: 12,
                    americanOdds: 1100,
                },
            },
            {
                id: 278399144,
                status: 'visible',
                name: {
                    value: '1:2',
                    sign: 'QYd1VA==',
                },
                price: {
                    id: 836883844,
                    numerator: 6,
                    denominator: 1,
                    odds: 7,
                    americanOdds: 600,
                },
            },
            {
                id: 278399145,
                status: 'visible',
                name: {
                    value: '0:2',
                    sign: 'Lm1Vgg==',
                },
                price: {
                    id: 836883847,
                    numerator: 13,
                    denominator: 2,
                    odds: 7.5,
                    americanOdds: 650,
                },
            },
            {
                id: 278399146,
                status: 'visible',
                name: {
                    value: '3:0',
                    sign: '8jRLzQ==',
                },
                price: {
                    id: 836883850,
                    numerator: 35,
                    denominator: 1,
                    odds: 36,
                    americanOdds: 3500,
                },
            },
            {
                id: 278399147,
                status: 'visible',
                name: {
                    value: '3:1',
                    sign: 'PISubQ==',
                },
                price: {
                    id: 836883853,
                    numerator: 25,
                    denominator: 1,
                    odds: 26,
                    americanOdds: 2500,
                },
            },
            {
                id: 278399148,
                status: 'visible',
                name: {
                    value: '3:2',
                    sign: 'zV6Zvg==',
                },
                price: {
                    id: 836883856,
                    numerator: 25,
                    denominator: 1,
                    odds: 26,
                    americanOdds: 2500,
                },
            },
            {
                id: 278399149,
                status: 'visible',
                name: {
                    value: '3:3',
                    sign: 'A+58Hg==',
                },
                price: {
                    id: 836883859,
                    numerator: 30,
                    denominator: 1,
                    odds: 31,
                    americanOdds: 3000,
                },
            },
            {
                id: 278399150,
                status: 'visible',
                name: {
                    value: '2:3',
                    sign: 'nQLovA==',
                },
                price: {
                    id: 836883862,
                    numerator: 15,
                    denominator: 1,
                    odds: 16,
                    americanOdds: 1500,
                },
            },
            {
                id: 278399151,
                status: 'visible',
                name: {
                    value: '1:3',
                    sign: 'nDxMaQ==',
                },
                price: {
                    id: 836883865,
                    numerator: 9,
                    denominator: 1,
                    odds: 10,
                    americanOdds: 900,
                },
            },
            {
                id: 278399152,
                status: 'visible',
                name: {
                    value: '0:3',
                    sign: 'b/tTOA==',
                },
                price: {
                    id: 836883868,
                    numerator: 19,
                    denominator: 2,
                    odds: 10.5,
                    americanOdds: 950,
                },
            },
            {
                id: 278399153,
                status: 'visible',
                name: {
                    value: '4:0',
                    sign: 'UYKxcQ==',
                },
                price: {
                    id: 836883871,
                    numerator: 66,
                    denominator: 1,
                    odds: 67,
                    americanOdds: 6600,
                },
            },
            {
                id: 278399154,
                status: 'visible',
                name: {
                    value: '4:1',
                    sign: 'bjTgpQ==',
                },
                price: {
                    id: 836883874,
                    numerator: 45,
                    denominator: 1,
                    odds: 46,
                    americanOdds: 4500,
                },
            },
            {
                id: 278399155,
                status: 'visible',
                name: {
                    value: '4:2',
                    sign: 'jOUL6w==',
                },
                price: {
                    id: 836883877,
                    numerator: 45,
                    denominator: 1,
                    odds: 46,
                    americanOdds: 4500,
                },
            },
            {
                id: 278399156,
                status: 'visible',
                name: {
                    value: '4:3',
                    sign: 'UV4y1g==',
                },
                price: {
                    id: 836883880,
                    numerator: 60,
                    denominator: 1,
                    odds: 61,
                    americanOdds: 6000,
                },
            },
            {
                id: 278399157,
                status: 'visible',
                name: {
                    value: '4:4',
                    sign: 'qku0nw==',
                },
                price: {
                    id: 836883883,
                    numerator: 80,
                    denominator: 1,
                    odds: 81,
                    americanOdds: 8000,
                },
            },
            {
                id: 278399158,
                status: 'visible',
                name: {
                    value: '3:4',
                    sign: 'htutOQ==',
                },
                price: {
                    id: 836883886,
                    numerator: 40,
                    denominator: 1,
                    odds: 41,
                    americanOdds: 4000,
                },
            },
            {
                id: 278399159,
                status: 'visible',
                name: {
                    value: '2:4',
                    sign: '6TGN7w==',
                },
                price: {
                    id: 836883889,
                    numerator: 22,
                    denominator: 1,
                    odds: 23,
                    americanOdds: 2200,
                },
            },
            {
                id: 278399160,
                status: 'visible',
                name: {
                    value: '1:4',
                    sign: 'fhlUrg==',
                },
                price: {
                    id: 836883892,
                    numerator: 15,
                    denominator: 1,
                    odds: 16,
                    americanOdds: 1500,
                },
            },
            {
                id: 278399161,
                status: 'visible',
                name: {
                    value: '0:4',
                    sign: 'EfN0eA==',
                },
                price: {
                    id: 836883895,
                    numerator: 15,
                    denominator: 1,
                    odds: 16,
                    americanOdds: 1500,
                },
            },
            {
                id: 278399162,
                status: 'visible',
                name: {
                    value: 'Any other score',
                    sign: 'Jbr28w==',
                },
                price: {
                    id: 836883898,
                    numerator: 19,
                    denominator: 2,
                    odds: 10.5,
                    americanOdds: 950,
                },
            },
        ],
    };
}
