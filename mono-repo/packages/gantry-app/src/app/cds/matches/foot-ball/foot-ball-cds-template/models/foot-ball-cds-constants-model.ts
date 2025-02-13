export const footBallCdsTemplate: any = {
    FIGHTBETTING: 'MatchResult',
    BOTHTEAMTOSCORE: 'BothTeamsToScore',
    MATCHRESULTBOTHTEAMTOSCORE: 'MatchResultBothTeamsToScore',
    TOTALGOALSFINISH: 'TotalGoalsFinish',
    FIRSTGOALSCORER: 'FirstGoalScorer',
    CORRECTSCORE: 'CorrectScore',
};
export class MarketParameters {
    MarketType?: string;
    Places?: number;
    Position?: string;
    Happening?: string;
    Period?: string;
    DecimalValue?: string;
}
export const footBallCds: any = {
    MATCHBETTING: 'Match Result',
    FIRSTGOALSCORER: '1st Goalscorer',
    CORRECTSCORE: 'Correct Score',
};

export enum selectionLength {
    CORRECTSCORERECORDS = 8,
    FIRSTGOALSCORERRECORDS = 7,
}

export const goalValueArray: string[] = ['1.5', '2.5', '3.5'];
