import { BoxingContentParams, Game, Result } from '../models/boxing-cds-content.model';

export class MockBoxingCdsData {
    matchBetting: Game = {
        id: 908471818,
        name: {
            value: 'Fight Result (3-way)',
            sign: 'dXjJYA==',
        },
        results: [
            {
                id: -1621036074,
                odds: 1.28,
                name: {
                    value: 'N. Inoue',
                    sign: 'e6jseA==',
                },
                sourceName: {
                    value: '1',
                    sign: 'NrhYOg==',
                },
                visibility: 'Visible',
                numerator: 2,
                denominator: 7,
                americanOdds: -350,
            },
            {
                id: -1621036073,
                odds: 17,
                name: {
                    value: 'X',
                    sign: 'iaqQiQ==',
                },
                sourceName: {
                    value: 'X',
                    sign: 'iaqQiQ==',
                },
                visibility: 'Visible',
                numerator: 16,
                denominator: 1,
                americanOdds: 1600,
            },
            {
                id: -1621036072,
                odds: 3.75,
                name: {
                    value: 'S. Fulton',
                    sign: '7IQGqg==',
                },
                sourceName: {
                    value: '2',
                    sign: 'GhF14g==',
                },
                visibility: 'Visible',
                numerator: 11,
                denominator: 4,
                americanOdds: 275,
            },
        ],
    };

    roundBetting: Result[] = [
        {
            id: -1621036071,
            odds: 34,
            name: {
                value: 'N. Inoue in round 1',
                sign: 'cVYTQw==',
            },
            visibility: 'Visible',
            numerator: 33,
            denominator: 1,
            americanOdds: 3300,
        },
        {
            id: -1621036070,
            odds: 26,
            name: {
                value: 'N. Inoue in round 2',
                sign: '0jnJUQ==',
            },
            visibility: 'Visible',
            numerator: 25,
            denominator: 1,
            americanOdds: 2500,
        },
        {
            id: -1621036069,
            odds: 21,
            name: {
                value: 'N. Inoue in round 3',
                sign: 'jB5Q6Q==',
            },
            visibility: 'Visible',
            numerator: 20,
            denominator: 1,
            americanOdds: 2000,
        },
        {
            id: -1621036068,
            odds: 17,
            name: {
                value: 'N. Inoue in round 4',
                sign: 'lOZ9dA==',
            },
            visibility: 'Visible',
            numerator: 16,
            denominator: 1,
            americanOdds: 1600,
        },
        {
            id: -1621036067,
            odds: 17,
            name: {
                value: 'N. Inoue in round 5',
                sign: 'ysHkzA==',
            },
            visibility: 'Visible',
            numerator: 16,
            denominator: 1,
            americanOdds: 1600,
        },
        {
            id: -1621036066,
            odds: 15,
            name: {
                value: 'N. Inoue in round 6',
                sign: 'aa4+3g==',
            },
            visibility: 'Visible',
            numerator: 14,
            denominator: 1,
            americanOdds: 1400,
        },
        {
            id: -1621036065,
            odds: 13,
            name: {
                value: 'N. Inoue in round 7',
                sign: 'N4mnZg==',
            },
            visibility: 'Visible',
            numerator: 12,
            denominator: 1,
            americanOdds: 1200,
        },
        {
            id: -1621036064,
            odds: 13,
            name: {
                value: 'N. Inoue in round 8',
                sign: 'xZQa7w==',
            },
            visibility: 'Visible',
            numerator: 12,
            denominator: 1,
            americanOdds: 1200,
        },
        {
            id: -1621036063,
            odds: 13,
            name: {
                value: 'N. Inoue in round 9',
                sign: 'm7ODVw==',
            },
            visibility: 'Visible',
            numerator: 12,
            denominator: 1,
            americanOdds: 1200,
        },
        {
            id: -1621036062,
            odds: 15,
            name: {
                value: 'N. Inoue in round 10',
                sign: 'qOdoPw==',
            },
            visibility: 'Visible',
            numerator: 14,
            denominator: 1,
            americanOdds: 1400,
        },
        {
            id: -1621036061,
            odds: 21,
            name: {
                value: 'N. Inoue in round 11',
                sign: 'qwMf3Q==',
            },
            visibility: 'Visible',
            numerator: 20,
            denominator: 1,
            americanOdds: 2000,
        },
        {
            id: -1621036060,
            odds: 26,
            name: {
                value: 'N. Inoue in round 12',
                sign: 'eHGmGA==',
            },
            visibility: 'Visible',
            numerator: 25,
            denominator: 1,
            americanOdds: 2500,
        },
        {
            id: -1621036059,
            odds: 3.25,
            name: {
                value: 'N. Inoue on points (full distance)',
                sign: 'VLZCRQ==',
            },
            visibility: 'Visible',
            numerator: 9,
            denominator: 4,
            americanOdds: 225,
        },
        {
            id: -1621036058,
            odds: 21,
            name: {
                value: 'Draw',
                sign: 'uxQi1Q==',
            },
            visibility: 'Visible',
            numerator: 20,
            denominator: 1,
            americanOdds: 2000,
        },
        {
            id: -1621036057,
            odds: 5,
            name: {
                value: 'S. Fulton on points (full distance)',
                sign: 'Ix2TmQ==',
            },
            visibility: 'Visible',
            numerator: 4,
            denominator: 1,
            americanOdds: 400,
        },
        {
            id: -1621036056,
            odds: 126,
            name: {
                value: 'S. Fulton in round 1',
                sign: '90fAPA==',
            },
            visibility: 'Visible',
            numerator: 125,
            denominator: 1,
            americanOdds: 12500,
        },
        {
            id: -1621036055,
            odds: 101,
            name: {
                value: 'S. Fulton in round 2',
                sign: '2MK5MA==',
            },
            visibility: 'Visible',
            numerator: 100,
            denominator: 1,
            americanOdds: 10000,
        },
        {
            id: -1621036054,
            odds: 101,
            name: {
                value: 'S. Fulton in round 3',
                sign: 'sIleIw==',
            },
            visibility: 'Visible',
            numerator: 100,
            denominator: 1,
            americanOdds: 10000,
        },
        {
            id: -1621036053,
            odds: 81,
            name: {
                value: 'S. Fulton in round 4',
                sign: 'hshKKA==',
            },
            visibility: 'Visible',
            numerator: 80,
            denominator: 1,
            americanOdds: 8000,
        },
        {
            id: -1621036052,
            odds: 81,
            name: {
                value: 'S. Fulton in round 5',
                sign: 'edv9Aw==',
            },
            visibility: 'Visible',
            numerator: 80,
            denominator: 1,
            americanOdds: 8000,
        },
        {
            id: -1621036051,
            odds: 67,
            name: {
                value: 'S. Fulton in round 6',
                sign: 'Vl6EDw==',
            },
            visibility: 'Visible',
            numerator: 66,
            denominator: 1,
            americanOdds: 6600,
        },
        {
            id: -1621036050,
            odds: 51,
            name: {
                value: 'S. Fulton in round 7',
                sign: 'PhVjHA==',
            },
            visibility: 'Visible',
            numerator: 50,
            denominator: 1,
            americanOdds: 5000,
        },
        {
            id: -1621036049,
            odds: 51,
            name: {
                value: 'S. Fulton in round 8',
                sign: 'OtysGQ==',
            },
            visibility: 'Visible',
            numerator: 50,
            denominator: 1,
            americanOdds: 5000,
        },
        {
            id: -1621036048,
            odds: 67,
            name: {
                value: 'S. Fulton in round 9',
                sign: 'txz6ow==',
            },
            visibility: 'Visible',
            numerator: 66,
            denominator: 1,
            americanOdds: 6600,
        },
        {
            id: -1621036047,
            odds: 81,
            name: {
                value: 'S. Fulton in round 10',
                sign: 'BZ5U6Q==',
            },
            visibility: 'Visible',
            numerator: 80,
            denominator: 1,
            americanOdds: 8000,
        },
        {
            id: -1621036046,
            odds: 81,
            name: {
                value: 'S. Fulton in round 11',
                sign: '85EyxA==',
            },
            visibility: 'Visible',
            numerator: 80,
            denominator: 1,
            americanOdds: 8000,
        },
        {
            id: -1621036045,
            odds: 101,
            name: {
                value: 'S. Fulton in round 12',
                sign: 'VtfL3Q==',
            },
            visibility: 'Visible',
            numerator: 100,
            denominator: 1,
            americanOdds: 10000,
        },
    ];

    roundGroupBetting: Game = {
        id: 908471830,
        name: {
            value: 'Round Group Betting 1',
            sign: 'pi8itA==',
        },
        results: [
            {
                id: -1621036024,
                odds: 10.0,
                name: {
                    value: 'N. Inoue in rounds 1-3',
                    sign: 'DXn49Q==',
                },
                visibility: 'Visible',
                numerator: 9,
                denominator: 1,
                americanOdds: 900,
            },
            {
                id: -1621036023,
                odds: 6.5,
                name: {
                    value: 'N. Inoue in rounds 4-6',
                    sign: 'i7LRDg==',
                },
                visibility: 'Visible',
                numerator: 11,
                denominator: 2,
                americanOdds: 550,
            },
            {
                id: -1621036022,
                odds: 5.0,
                name: {
                    value: 'N. Inoue in rounds 7-9',
                    sign: 'JBHA0Q==',
                },
                visibility: 'Visible',
                numerator: 4,
                denominator: 1,
                americanOdds: 400,
            },
            {
                id: -1621036021,
                odds: 7.5,
                name: {
                    value: 'N. Inoue in rounds 10-12',
                    sign: 'ULdTTQ==',
                },
                visibility: 'Visible',
                numerator: 13,
                denominator: 2,
                americanOdds: 650,
            },
            {
                id: -1621036020,
                odds: 3.0,
                name: {
                    value: 'N. Inoue On points',
                    sign: 'JJhgGA==',
                },
                visibility: 'Visible',
                numerator: 2,
                denominator: 1,
                americanOdds: 200,
            },
            {
                id: -1621036019,
                odds: 41.0,
                name: {
                    value: 'S. Fulton in rounds 1-3',
                    sign: 'U9QkEA==',
                },
                visibility: 'Visible',
                numerator: 40,
                denominator: 1,
                americanOdds: 4000,
            },
            {
                id: -1621036018,
                odds: 29.0,
                name: {
                    value: 'S. Fulton in rounds 4-6',
                    sign: 'zP4etQ==',
                },
                visibility: 'Visible',
                numerator: 28,
                denominator: 1,
                americanOdds: 2800,
            },
            {
                id: -1621036017,
                odds: 21.0,
                name: {
                    value: 'S. Fulton in rounds 7-9',
                    sign: 'rVZuaQ==',
                },
                visibility: 'Visible',
                numerator: 20,
                denominator: 1,
                americanOdds: 2000,
            },
            {
                id: -1621036016,
                odds: 34.0,
                name: {
                    value: 'S. Fulton in rounds 10-12',
                    sign: 'ODeSYg==',
                },
                visibility: 'Visible',
                numerator: 33,
                denominator: 1,
                americanOdds: 3300,
            },
            {
                id: -1621036015,
                odds: 5.5,
                name: {
                    value: 'S. Fulton On points',
                    sign: 'TQQGDg==',
                },
                visibility: 'Visible',
                numerator: 9,
                denominator: 2,
                americanOdds: 450,
            },
            {
                id: -1621036014,
                odds: 21.0,
                name: {
                    value: 'Draw',
                    sign: 'vW/CdQ==',
                },
                visibility: 'Visible',
                numerator: 20,
                denominator: 1,
                americanOdds: 2000,
            },
        ],
    };

    methodOfVictory: Game = {
        id: 908471833,
        name: {
            value: 'Method of Victory',
            sign: 'pGs7Vg==',
        },
        results: [
            {
                id: -1621035997,
                odds: 2.0,
                name: {
                    value: 'N. Inoue by KO/TKO/Technical Decision or DQ',
                    sign: 'VOPPsQ==',
                },
                visibility: 'Visible',
                numerator: 1,
                denominator: 1,
                americanOdds: 100,
            },
            {
                id: -1621035996,
                odds: 3.0,
                name: {
                    value: 'N. Inoue On points',
                    sign: 'kyRvrA==',
                },
                visibility: 'Visible',
                numerator: 2,
                denominator: 1,
                americanOdds: 200,
            },
            {
                id: -1621035995,
                odds: 9.0,
                name: {
                    value: 'S. Fulton by KO/TKO/Technical Decision or DQ',
                    sign: 'qJBDRg==',
                },
                visibility: 'Visible',
                numerator: 8,
                denominator: 1,
                americanOdds: 800,
            },
            {
                id: -1621035994,
                odds: 5.5,
                name: {
                    value: 'S. Fulton On points',
                    sign: 'K6VB3Q==',
                },
                visibility: 'Visible',
                numerator: 9,
                denominator: 2,
                americanOdds: 450,
            },
            {
                id: -1621035993,
                odds: 21.0,
                name: {
                    value: 'Draw',
                    sign: 'jERypA==',
                },
                visibility: 'Visible',
                numerator: 20,
                denominator: 1,
                americanOdds: 2000,
            },
        ],
    };

    boxingContent: BoxingContentParams = {
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
            TwentyOneNumber: '21',
            LeftStipulatedLine: 'ALL PRICES FROM BETSTATION AND SUBJECT TO FLUCTUATION',
            BetStationPricesFluctuation: 'BetStation prices - subject to change',
            Abbreviations: 'ko,tko,dq',
            MethodOfVictoryList: '["On Points", "KO/TKO/Technical Decision or DQ"]',
            OnPoints: 'On Points',
            OnPointsValue: '(FULL DISTANCE)',
            NewDesignOnPointsValue: '(Full Distance)',
        },
    };
}
