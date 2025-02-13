import { SportContentParameters } from '../../../../../common/models/sport-content/sport-content-parameters.model';
import { FootBallDataContent } from './foot-ball-model';

export class FootBallCdsTemplateResult {
    title?: string;
    content: FootBallContentParams;
    finalResult: FinalResult;
    bothTeamScore: BothTeamToScore;
    matchResultBothTeamScore: MatchResultBothTeamToScore;
    marketResult: MarketResultModel;
    totalGoals: TotalGoalsFinish;
    footBallContent: FootBallDataContent;
    eventStartDate?: string;
    firstGoalScorer: FirstGoalScorer;
    correctScore: CorrectScore;
    drawTitle: string;
    hasCorrectScoreAndfirstGoalScorer?: boolean = false;
}

export class MarketResultModel {
    eventName: string;
    eventStartDate: string;
    competition: string;
}

export class FinalResult {
    selections: MatchSelection[];
}

export interface Selections {
    homePrice: string;
    homeSelectionTitle: string;
    awayPrice: string;
    awaySelectionTitle: string;
}

export interface BothTeamToScore {
    gameName?: string;
    selections: Selection[];
}

export interface FirstGoalScorer {
    selections: Selection[];
}

export class CorrectScore {
    selections: HomeDrawAwaySelection[];
}
export class HomeDrawAwaySelection {
    homePrice: string;
    homeSelectionTitle: string;
    awayPrice: string;
    awaySelectionTitle: string;
    drawPrice: string;
    drawSelectionTitle: string;
}

export interface MatchResultBothTeamToScore {
    gameName?: string;
    selections: Selection[];
}

export interface TotalGoalsFinish {
    selections: BetDetails[];
}
export interface Selection {
    homePrice: string;
    homeSelectionTitle: string;
    awayPrice: string;
    awaySelectionTitle: string;
}
export class MatchSelection {
    homePrice: string;
    homeSelectionTitle: string;
    awayPrice: string;
    awaySelectionTitle: string;
    drawPrice: string;
    drawSelectionTitle?: string;
}

export class OptionalMarket {
    id?: number;
    gameName?: string;
    marketName?: string;
    status?: string;
    matchBetting?: Selection;
    results?: Result[];
    options: Option[];
    name?: Name;
    parameters?: any[];
    participants?: Participant[];
}
export interface Participant {
    id?: number;
    participantId?: number;
    name?: Name;
    status?: string;
    properties?: {
        type?: string;
        team?: number;
    };
    options?: any;
    source?: string;
}
export interface Result {
    status?: any;
    visibility: string;
    numerator?: number;
    denominator?: number;
    americanOdds?: number;
    attr?: string;
    totalsPrefix?: string;
    odds?: string;
}

export class BetDetails {
    homePrice?: string;
    name?: string;
    awayPrice?: string;
}

export class FootBallContentParams extends SportContentParameters {}

export class Option {
    id: number;
    status: string;
    name: Name;
    price: Price;
    participantId?: number;
    parameters?: parameter;
    sourceName?: {
        [attr: string]: string;
    };
}

export class parameter {
    fixtureParticipant: number;
    optionTypes?: any;
}

export class Name {
    value: string;
    sign: string;
}

export class Price {
    id: number;
    numerator: number;
    denominator: number;
    odds: number;
    americanOdds: number;
}

export class PlayerInfo {
    price: string;
    title: string;
}
