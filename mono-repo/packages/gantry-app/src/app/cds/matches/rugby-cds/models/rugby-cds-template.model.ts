import { SportContentParameters } from '../../../../common/models/sport-content/sport-content-parameters.model';

export class RugbyCdsTemplateResult {
    games?: Game[];
    eventStartDate?: string;
    sportName?: string;
    title?: string;
    competitionName: string;
    content: RugbyContentParams;
    leftBetList: Array<BetDetails> = [];
    rightBetList: Array<BetDetails> = [];
    context: string;
    marketVersesName?: string;
    homeName?: string;
    awayName?: string;
    drawTitle?: string;
}

export interface Game {
    id?: number;
    gameName?: string;
    marketName?: string;
    matchBetting?: Selection;
    handicapBetting?: Selection;
    totalPointsBetting?: Selection;
    firstHanicapBetting?: Selection;
    halfFullBetting?: Array<BetDetails>;
    isMatchBetting?: boolean;
    isFirstHanicapBetting?: boolean;
    isHalfFullBetting?: boolean;
    isTotalPointsBetting?: boolean;
    isHandicapBetting?: boolean;
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

export class HalfFullBetting {
    allScorerList?: Array<BetDetails>;
}

export class RugbyContentParams extends SportContentParameters {}

export class BetDetails {
    betName: string;
    betOdds: string;
}
