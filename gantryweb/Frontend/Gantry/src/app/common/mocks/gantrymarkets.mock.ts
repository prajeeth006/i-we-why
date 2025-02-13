import { Markets } from "../models/gantrymarkets.model";

export class GantryMock {

    Data:Array<Markets> = [
        {
          "sport": "FootBall",
          "markets": [
            {
              "name": "HalfTimeFullTime",
              "matches": [
                "HALF-TIME/FULL-TIME",
                "HALF-TIME / FULL-TIME",
                "HALF TIME/FULL TIME",
                "HALF TIME / FULL TIME",
                "HALFTIME/FULLTIME",
                "HALFTIME / FULLTIME"
              ]
            },
            {
              "name": "MatchResult",
              "matches": [
                "^MATCH RESULT$",
                "^MATCH BETTING$"
              ]
            },
            {
              "name": "FirstGoalScorer",
              "matches": [
                "FIRST GOAL SCORER",
                "FIRST GOALSCORER",
                "FIRST PLAYER TO SCORE"
              ]
            },
            {
              "name": "CorrectScore",
              "matches": [
                "CORRECT SCORE"
              ]
            },
            {
              "name": "BothTeamsToScore",
              "matches": [
                "^BOTH TEAMS TO SCORE$"
              ]
            },
            {
              "name": "MatchResultBothTeamsToScore",
              "matches": [
                "MATCH ODDS AND BOTH TEAMS TO SCORE",
                "MATCH RESULT & BOTH TEAMS TO SCORE"
              ]
            },
            {
              "name": "TotalGoalsInTheMatch",
              "matches": [
                "OVER/UNDER TOTAL GOALS ([0-9]+).([0-9]+)"
              ]
            }
          ]
        },
        {
          "sport": "Nfl",
          "markets": [
            {
              "name": "MoneyLine",
              "matches": [
                "MONEY LINE"
              ]
            },
            {
              "name": "HandicapBetting",
              "matches": [
                "SPREAD -1.5"
              ]
            },
            {
              "name": "WinningMargin",
              "matches": [
                "WINNING MARGIN"
              ]
            },
            {
              "name": "FirstTDScorer",
              "matches": [
                "FIRST TD SCORER"
              ]
            }
          ]
        },
        {
          "sport": "Rugby",
          "markets": [
            {
              "name": "MatchBetting",
              "matches": [
                "MATCH BETTING"
              ]
            },
            {
              "name": "HandicapBetting",
              "matches": [
                "HANDICAP BETTING",
                "1ST HALF HANDICAP"
              ]
            },
            {
              "name": "WinningMargin",
              "matches": [
                "WINNING MARGIN",
                "WINNING MARGINS \\(([0-9]+) POINTS\\)",
                "([0-9]+) POINT WINNING MARGINS"
              ]
            },
            {
              "name": "HalfTimeFullTime",
              "matches": [
                "HALF-TIME/FULL-TIME",
                "HALF-TIME / FULL-TIME",
                "HALF TIME/FULL TIME",
                "HALF TIME / FULL TIME",
                "HALFTIME/FULLTIME",
                "HALFTIME / FULLTIME"
              ]
            },
            {
              "name": "TotalMatchPoints",
              "matches": [
                "TOTAL MATCH POINTS"
              ]
            }
          ]
        },
        {
          "sport": "Cricket",
          "markets": [
            {
              "name": "MatchBetting",
              "matches": [
                "MATCH BETTING"
              ]
            },
            {
              "name": "TopRunscorer",
              "matches": [
                "([A-Z]+) TOP RUNSCORER"
              ]
            },
            {
              "name": "Top1stInningsRunscorer",
              "matches": [
                "([A-Z]+) TOP 1ST INNINGS RUNSCORER"
              ]
            },
            {
              "name": "ToWinTheToss",
              "matches": [
                "TO WIN THE TOSS"
              ]
            },
            {
              "name": "TotalSixes",
              "matches": [
                "TOTAL SIXES"
              ]
            },
            {
              "name": "ToScore100In1stInns",
              "matches": [
                "TO SCORE 100 IN 1ST INNS - ([A-Z]+)"
              ]
            },
            {
              "name": "FirstInningsLead",
              "matches": [
                "INNINGS LEAD",
                "1ST INNINGS LEAD",
                "1ST INNINGS LEAD - NEW"
              ]
            },
            {
              "name": "ManOfTheMatch",
              "matches": [
                "MAN OF THE MATCH"
              ]
            }
          ]
        },
        {
          "sport": "Boxing",
          "markets": [
            {
              "name": "FightBetting",
              "matches": [
                "FIGHT BETTING",
                "MATCH BETTING"
              ]
            },
            {
              "name": "RoundBetting",
              "matches": [
                "ROUND BETTING"
              ]
            },
            {
              "name": "RoundGroupBetting",
              "matches": [
                "ROUND GROUP BETTING",
                "FIGHT END GROUPED"
              ]
            },
            {
              "name": "MethodOfVictory",
              "matches": [
                "METHOD OF VICTORY"
              ]
            }
          ]
        },
        {
          "sport": "Tennis",
          "markets": [
            {
              "name": "MatchBetting",
              "matches": [
                "MATCH BETTING"
              ]
            },
            {
              "name": "SetBetting",
              "matches": [
                "SET BETTING",
                "CORRECT SCORE"
              ]
            }
          ]
        },
        {
          "sport": "Darts",
          "markets": [
            {
              "name": "MatchBetting",
              "matches": [
                "MATCH BETTING"
              ]
            },
            {
              "name": "MatchHandicap",
              "matches": [
                "MATCH HANDICAP",
                "HANDICAP",
                "MATCH ABC",
                "LEG HANDICAP",
                "MATCH SET HANDICAP"
              ]
            },
            {
              "name": "CorrectScore",
              "matches": [
                "CORRECT SCORE"
              ]
            },
            {
              "name": "Most180S",
              "matches": [
                "MOST 180S",
                "TOTAL 180S"
              ]
            },
            {
              "name": "SelectedCorrectScores",
              "matches": [
                "SELECTED CORRECT SCORES"
              ]
            }
          ]
        },
        {
          "sport": "Snooker",
          "markets": [
            {
              "name": "MatchBetting",
              "matches": [
                "MATCH BETTING"
              ]
            },
            {
              "name": "CorrectScore",
              "matches": [
                "CORRECT SCORE"
              ]
            },
            {
              "name": "MatchHandicap",
              "matches": [
                "MATCH HANDICAP"
              ]
            },
            {
              "name": "TotalFrames",
              "matches": [
                "TOTAL FRAMES",
                "TOTAL FRAMES OVER/UNDER"
              ]
            },
            {
              "name": "1StFrameWinner",
              "matches": [
                "1ST FRAME WINNER",
                "FRAME 1 WINNER"
              ]
            }
          ]
        },
        {
          "sport": "Formula1",
          "markets": [
            {
              "name": "RaceWinner",
              "matches": [
                "RACE WINNER"
              ]
            },
            {
              "name": "FastestLap",
              "matches": [
                "FASTEST LAP"
              ]
            },
            {
              "name": "PodiumFinish",
              "matches": [
                "PODIUM FINISH"
              ]
            },
            {
              "name": "PointsFinish",
              "matches": [
                "POINTS FINISH"
              ]
            }
          ]
        },
        {
          "sport": "Greyhounds",
          "markets": [
            {
              "name": "OddsVEvens",
              "matches": [
                "Odds v Evens"
              ]
            },
            {
              "name": "InsideVsOuside",
              "matches": [
                "Inside vs Ouside"
              ]
            }
          ]
        }
      ]

}