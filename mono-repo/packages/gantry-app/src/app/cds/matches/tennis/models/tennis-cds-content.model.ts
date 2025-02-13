import { SportContentParameters } from '../../../../common/models/sport-content/sport-content-parameters.model';

export class TennisCdsContent {
    games: Game[];
    eventStartDate?: string;
    sportName?: string;
    title?: string;
    competitionName: string;
    content: TennisContentParams;
    context: string;
}

export interface Game {
    id?: number;
    gameName?: string;
    matchBetting?: Selection;
    setBetting?: Selection[];
    isMatchBetting?: boolean;
    isSetBetting?: boolean;
}

export interface Selection {
    homeBettingPrice?: string;
    homePlayer?: string;
    awayBettingPrice?: string;
    awayPlayer?: string;
    scorePoint?: string;
    isMatchedPair?: boolean;
}

export class TennisContentParams extends SportContentParameters {}
