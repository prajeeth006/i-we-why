import { SportContentParameters } from '../../../../common/models/sport-content/sport-content-parameters.model';

export class BoxingCdsContent {
    games?: Game[];
    eventStartDate?: string;
    sportName?: string;
    title?: string;
    competitionName: string;
    content: BoxingContentParams;
    context: string;
    homeTeamListDetails: RoundBettingDetails[];
    awayTeamListDetails: RoundBettingDetails[];
    drawDetails: BetDetails;
    marketDisplayTitle: string;
    finalResult: FinalResult;
    methodOfVictory: MethodOfVictory;
    roundGroupBetting: RoundGroupBetting;
    RoundBetting: RoundBetting;
    individualRoundBetting: IndividualBetting;
    drawTitle: string;
}
export class FinalResult {
    id: number | undefined;
    gameName: string;
    selections: Selections[];
}

export interface Selections {
    homePrice: string;
    homeSelectionTitle: string;
    awayPrice: string;
    awaySelectionTitle: string;
    drawTitle: string;
    drawPrice: string;
}
export interface MatchBetting {
    homeBettingPrice: string;
    homePlayer: string;
    awayBettingPrice: string;
    awayPlayer: string;
    drawPlayer: string;
    drawBettingPrice: string;
}

export class IndividualBetting {
    homeTeamListDetails: Array<RoundBettingDetails>;
    awayTeamListDetails: Array<RoundBettingDetails>;
    marketTitle: string;
}

export class RoundGroupBetting {
    id: number | undefined;
    gameName: string;
    selections: BetDetails[];
}

export class MethodOfVictory {
    id: number | undefined;
    gameName: string;
    selections: BetDetails[];
    marketName: string;
    marketDisplayTitle: string;
}
export class RoundBetting {
    selections: BetDetails[];
    marketName: String;
    marketDisplayTitle: String;
}

export interface Game {
    id?: number | undefined;
    gameName?: string;
    matchBetting?: Selection;
    name: Name;
    results: Result[];
}

export interface Selection {
    homeBettingPrice?: string;
    homePlayer?: string;
    awayBettingPrice?: string;
    awayPlayer?: string;
    drawBettingPrice?: string;
    drawPlayer?: string;
}

export class BoxingContentParams extends SportContentParameters {}

export class BetDetails {
    homePrice?: string;
    name?: string;
    awayPrice?: string;
}

export class RoundBettingDetails {
    betName: string;
    betOdds: string;
}

export class Name {
    value: string;
    sign: string;
}

export class Result {
    id: number;
    odds: number;
    name: Name;
    sourceName?: Name;
    visibility: string;
    numerator: number;
    denominator: number;
    americanOdds?: number;
    attr?: string;
    totalsPrefix?: string;
}
export class MultiMarket {
    methodOfVictory: MethodOfVictory;
    individualRoundBetting: IndividualBetting;
    title?: string;
    marketVersesName?: string;
    homeTitle?: string;
    awayTitle?: string;
    trimValue?: boolean = true;
    selections?: Array<MultiMarketSelection>;
}

export class MultiMarketSelection {
    selectionTitle?: string;
    drawTitle?: string;
    homePrice?: string;
    awayPrice?: string;
    drawPrice?: string;
    homeSelectionTitle?: string;
    awaySelectionTitle?: string;
    hideHomePrice?: boolean;
    hideAwayPrice?: boolean;
    hideDrawPrice?: boolean;
    hideHomeTitle?: boolean;
    hideAwayTitle?: boolean;
    hideDrawTitle?: boolean;
    name?: string;
}
