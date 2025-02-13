import { Markets } from '../../../common/models/gantrymarkets.model';

export class GetMarketsMock {
    markets: Array<Markets> = [
        {
            sport: 'FootBall',
            markets: [
                {
                    name: 'HalfTimeFullTime',
                    matches: [
                        'HALF-TIME/FULL-TIME',
                        'HALF-TIME / FULL-TIME',
                        'HALF TIME/FULL TIME',
                        'HALF TIME / FULL TIME',
                        'HALFTIME/FULLTIME',
                        'HALFTIME / FULLTIME',
                    ],
                },
                {
                    name: 'MatchResult',
                    matches: ['^MATCH RESULT$', '^MATCH BETTING$'],
                },
                {
                    name: 'FirstGoalScorer',
                    matches: ['FIRST GOAL SCORER', 'FIRST GOALSCORER', 'FIRST PLAYER TO SCORE'],
                },
                {
                    name: 'CorrectScore',
                    matches: ['CORRECT SCORE'],
                },
                {
                    name: 'BothTeamsToScore',
                    matches: ['^BOTH TEAMS TO SCORE$'],
                },
                {
                    name: 'MatchResultBothTeamsToScore',
                    matches: ['MATCH ODDS AND BOTH TEAMS TO SCORE', 'MATCH RESULT & BOTH TEAMS TO SCORE'],
                },
                {
                    name: 'TotalGoalsInTheMatch',
                    matches: ['OVER/UNDER TOTAL GOALS ([0-9]+).([0-9]+)'],
                },
            ],
        },
        {
            sport: 'CdsFootBall',
            markets: [
                {
                    name: 'MatchResult',
                    matches: ['^Match Result$'],
                },
                {
                    name: 'FirstGoalScorer',
                    matches: ['1st Goalscorer'],
                },
                {
                    name: 'CorrectScore',
                    matches: ['Correct Score'],
                },
                {
                    name: 'BothTeamsToScore',
                    matches: ['^Both teams to score$'],
                },
                {
                    name: 'MatchResultBothTeamsToScore',
                    matches: ['Match Result and Both Teams to Score'],
                },
                {
                    name: 'TotalGoalsFinish',
                    matches: ['Total Goals'],
                },
            ],
        },
        {
            sport: 'Nfl',
            markets: [
                {
                    name: 'MoneyLine',
                    matches: ['MONEY LINE'],
                },
                {
                    name: 'HandicapBetting',
                    matches: ['SPREAD -1.5'],
                },
                {
                    name: 'WinningMargin',
                    matches: ['WINNING MARGIN'],
                },
                {
                    name: 'FirstTDScorer',
                    matches: ['FIRST TD SCORER'],
                },
            ],
        },
        {
            sport: 'CdsNfl',
            markets: [
                {
                    name: 'MoneyLine',
                    matches: ['262'],
                },
                {
                    name: 'Spread',
                    matches: ['103'],
                },
                {
                    name: 'TotalPoints',
                    matches: ['104'],
                },
                {
                    name: 'FirstHalfMoneyLine',
                    matches: ['11304'],
                },
                {
                    name: 'FirstHalfSpread',
                    matches: ['364'],
                },
            ],
        },
        {
            sport: 'Rugby',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['MATCH BETTING'],
                },
                {
                    name: 'HandicapBetting',
                    matches: ['HANDICAP BETTING', '1ST HALF HANDICAP'],
                },
                {
                    name: 'WinningMargin',
                    matches: ['WINNING MARGIN', 'WINNING MARGINS \\(([0-9]+) POINTS\\)', '([0-9]+) POINT WINNING MARGINS'],
                },
                {
                    name: 'HalfTimeFullTime',
                    matches: [
                        'HALF-TIME/FULL-TIME',
                        'HALF-TIME / FULL-TIME',
                        'HALF TIME/FULL TIME',
                        'HALF TIME / FULL TIME',
                        'HALFTIME/FULLTIME',
                        'HALFTIME / FULLTIME',
                    ],
                },
                {
                    name: 'TotalMatchPoints',
                    matches: ['TOTAL MATCH POINTS'],
                },
            ],
        },
        {
            sport: 'CdsRugby',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['3153', '3191'],
                },
                {
                    name: 'HandicapBetting',
                    matches: ['3212', '7383'],
                },
                {
                    name: '1stHandicapBetting',
                    matches: ['7380', '7382'],
                },
                {
                    name: 'HalfTimeFullTime',
                    matches: ['12532', '12531'],
                },
                {
                    name: 'TotalMatchPoints',
                    matches: ['5819', '7259'],
                },
            ],
        },
        {
            sport: 'Cricket',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['MATCH BETTING'],
                },
                {
                    name: 'TopRunscorer',
                    matches: ['([A-Z]+) TOP RUNSCORER'],
                },
                {
                    name: 'Top1stInningsRunscorer',
                    matches: ['([A-Z]+) TOP 1ST INNINGS RUNSCORER'],
                },
                {
                    name: 'ToWinTheToss',
                    matches: ['TO WIN THE TOSS'],
                },
                {
                    name: 'TotalSixes',
                    matches: ['TOTAL SIXES'],
                },
                {
                    name: 'ToScore100In1stInns',
                    matches: ['TO SCORE 100 IN 1ST INNS - ([A-Z]+)'],
                },
                {
                    name: 'FirstInningsLead',
                    matches: ['INNINGS LEAD', '1ST INNINGS LEAD', '1ST INNINGS LEAD - NEW'],
                },
                {
                    name: 'ManOfTheMatch',
                    matches: ['MAN OF THE MATCH'],
                },
            ],
        },
        {
            sport: 'CdsCricket',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['7817'],
                },
                {
                    name: 'SuperOver',
                    matches: ['17951'],
                },
                {
                    name: 'TopHomeRunscorer',
                    matches: ['2449'],
                },
                {
                    name: 'TopAwayRunscorer',
                    matches: ['2450'],
                },
                {
                    name: 'TotalMatchSixes',
                    matches: ['17984', '30744', '17984'],
                },
                {
                    name: '3WayMatchBetting',
                    matches: ['11755'],
                },
                {
                    name: 'ToScore100in1stInns',
                    matches: ['37505'],
                },
            ],
        },
        {
            sport: 'Boxing',
            markets: [
                {
                    name: 'FightBetting',
                    matches: ['FIGHT BETTING', 'MATCH BETTING'],
                },
                {
                    name: 'RoundBetting',
                    matches: ['ROUND BETTING'],
                },
                {
                    name: 'RoundGroupBetting',
                    matches: ['ROUND GROUP BETTING', 'FIGHT END GROUPED'],
                },
                {
                    name: 'MethodOfVictory',
                    matches: ['METHOD OF VICTORY'],
                },
            ],
        },
        {
            sport: 'Tennis',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['MATCH BETTING'],
                },
                {
                    name: 'SetBetting',
                    matches: ['SET BETTING', 'CORRECT SCORE'],
                },
            ],
        },
        {
            sport: 'Darts',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['MATCH BETTING'],
                },
                {
                    name: 'MatchHandicap',
                    matches: ['MATCH HANDICAP', 'HANDICAP', 'MATCH ABC', 'LEG HANDICAP', 'MATCH SET HANDICAP'],
                },
                {
                    name: 'CorrectScore',
                    matches: ['CORRECT SCORE'],
                },
                {
                    name: 'Most180S',
                    matches: ['MOST 180S', 'TOTAL 180S'],
                },
                {
                    name: 'SelectedCorrectScores',
                    matches: ['SELECTED CORRECT SCORES'],
                },
            ],
        },
        {
            sport: 'CdsDarts',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['6367', '7111'],
                },
                {
                    name: 'MatchHandicap',
                    matches: ['5034', '11710'],
                },
                {
                    name: 'Most180S',
                    matches: ['6057'],
                },
                {
                    name: 'SelectedCorrectScores',
                    matches: [
                        '33569',
                        '16396',
                        '26329',
                        '31206',
                        '27546',
                        '24323',
                        '24124',
                        '24471',
                        '16432',
                        '32082',
                        '24469',
                        '5033',
                        '24474',
                        '31213',
                        '24473',
                        '24354',
                        '31205',
                        '16434',
                        '33644',
                        '37613',
                        '24326',
                        '24472',
                        '24350',
                        '12538',
                        '16431',
                        '24470',
                        '37611',
                        '23467',
                        '24352',
                        '33130',
                    ],
                },
            ],
        },
        {
            sport: 'Snooker',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['MATCH BETTING'],
                },
                {
                    name: 'CorrectScore',
                    matches: ['CORRECT SCORE'],
                },
                {
                    name: 'MatchHandicap',
                    matches: ['MATCH HANDICAP'],
                },
                {
                    name: 'TotalFrames',
                    matches: ['TOTAL FRAMES', 'TOTAL FRAMES OVER/UNDER'],
                },
                {
                    name: '1StFrameWinner',
                    matches: ['1ST FRAME WINNER', 'FRAME 1 WINNER'],
                },
            ],
        },
        {
            sport: 'CdsSnooker',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['11893', '7042'],
                },
                {
                    name: 'FrameBetting',
                    matches: ['5678', '36785', '7043', '26277', '5677', '5678', '5679', '4217', '4302', '4383', '4210'],
                },
                {
                    name: 'TotalFrames',
                    matches: ['8015'],
                },
                {
                    name: 'MatchHandicap',
                    matches: ['11718'],
                },
            ],
        },
        {
            sport: 'Formula1',
            markets: [
                {
                    name: 'RaceWinner',
                    matches: ['RACE WINNER'],
                },
                {
                    name: 'FastestLap',
                    matches: ['FASTEST LAP'],
                },
                {
                    name: 'PodiumFinish',
                    matches: ['PODIUM FINISH'],
                },
                {
                    name: 'PointsFinish',
                    matches: ['POINTS FINISH'],
                },
            ],
        },
        {
            sport: 'CdsFormula1',
            markets: [
                {
                    name: 'RaceWinner',
                    matches: ['2091'],
                },
                {
                    name: 'FastestLap',
                    matches: ['216'],
                },
                {
                    name: 'PodiumFinish',
                    matches: ['3266'],
                },
                {
                    name: 'PointsFinish',
                    matches: ['24520'],
                },
            ],
        },
        {
            sport: 'CdsBoxing',
            markets: [
                {
                    name: 'FightBetting',
                    matches: ['108'],
                },
                {
                    name: 'RoundBetting',
                    matches: ['11380', '36718', '1369', '12230', '36717', '11382'],
                },
                {
                    name: 'RoundGroupBetting',
                    matches: ['31367'],
                },
                {
                    name: 'MethodOfVictory',
                    matches: ['23458'],
                },
            ],
        },
        {
            sport: 'Greyhounds',
            markets: [
                {
                    name: 'OddsVsEvens',
                    matches: ['Odds v Evens', 'Odds vs Evens'],
                },
                {
                    name: 'InsideVsOutside',
                    matches: ['Inside vs Outside', 'Inside v Outside'],
                },
            ],
        },
        {
            sport: 'CdsTennis',
            markets: [
                {
                    name: 'MatchBetting',
                    matches: ['62'],
                },
                {
                    name: 'SetBetting',
                    matches: ['79', '80'],
                },
            ],
        },
    ];
}
