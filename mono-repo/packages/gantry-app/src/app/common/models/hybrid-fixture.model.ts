import { SportContentParameters } from './sport-content/sport-content-parameters.model';

export class HybridContent {
    games?: Game[];
    optionMarkets?: optionMarkets[];
    eventStartDate?: string;
    sportName?: string;
    title?: string;
    competitionName: string;
    content: gantryCommonContent;
    context: string;
}

export interface Game {
    id?: number;
    gameName?: string;
    matchBetting?: Selection;
}

export class optionMarkets {
    tempvalue?: number;
    id?: number;
    gameName?: string;
    marketName?: string;
    status?: string;
    matchBetting?: Selection;
    results?: Result[];
    options: Option[];
    name?: Name;
    parameters: any[];
    participants?: Participant[];
}

export interface Selection {
    homeBettingPrice?: string;
    homePlayer?: string;
    awayBettingPrice?: string;
    awayPlayer?: string;
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

export class Option {
    id: number;
    status: string;
    name: Name;
    price: Price;
    numerator?: number;
    denominator?: number;
    participantId?: number;
    parameters?: parameter;
    sourceName?: {
        [attr: string]: string;
    };
}
export interface Name {
    value: string;
}

export class Price {
    id: number;
    numerator: number;
    denominator: number;
    odds: number;
    americanOdds: number;
}

export class parameter {
    fixtureParticipant: number;
    optionTypes?: any;
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

export class gantryCommonContent extends SportContentParameters {}
