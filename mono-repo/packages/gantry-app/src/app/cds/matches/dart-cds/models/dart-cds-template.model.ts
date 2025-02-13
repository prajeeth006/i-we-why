import { SportContentParameters } from '../../../../common/models/sport-content/sport-content-parameters.model';

export class DartCdsTemplateResult {
    games?: Game[];
    eventStartDate?: string;
    sportName?: string;
    title?: string;
    competitionName: string;
    content: DartContentParams;
    frameBetting: CorrectScorer;
    context: string;
    marketVersesName?: string;
    homeName: string;
    awayName: string;
    drawTitle?: string;
}

export interface Game {
    id?: number;
    gameName?: string;
    marketName?: string;
    frameBetting?: NewSelection[];
    matchBetting?: Selection;
    correctScore?: CorrectScorer;
    totalFrames?: Selection;
    matchHandicap?: Selection;
    isMatchBetting?: boolean;
    isFrameBetting?: boolean;
    isHomeScorer?: boolean;
    isAwayScorer?: boolean;
    isTotalFrames?: boolean;
    isMatchHandicap?: boolean;
}

export interface Selection {
    homePrice?: string;
    homePlayer?: string;
    awayPrice?: string;
    awayPlayer?: string;
    drawPrice?: string;
    drawPlayer?: string;
    drawSuspended?: boolean;
}

export interface NewSelection {
    homeBettingPrice?: string;
    homePlayer?: string;
    awayBettingPrice?: string;
    awayPlayer?: string;
    scorePoint?: string;
    isMatchedPair?: boolean;
    difference?: Number;
}
export class CorrectScorer {
    homeTeamScorerList: Array<BetDetails>;
    awayTeamScorerList: Array<BetDetails>;
}

export class DartContentParams extends SportContentParameters {}

export class BetDetails {
    betName: string;
    betOdds: string;
}
