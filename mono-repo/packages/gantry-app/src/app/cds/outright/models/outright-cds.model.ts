import { SportContentParameters } from '../../../common/models/sport-content/sport-content-parameters.model';

export class OutRightCdsContent {
    games?: Game[];
    eventStartDate?: string;
    sportName?: string;
    title?: string;
    competitionName: string;
    content?: OutRightContentParams;
    context: string;
    finalResult: FinalResult;
    correctScore: SeriesCorrectScore;
    typeId: number;
    eachWayTerms?: string;
}

export interface Game {
    id?: number;
    gameName?: string;
    name: Name;
    results?: Result[];
    options: Result[];
    parameters?: GameParameters[];
    templateId?: number;
}
export interface GameParameters {
    key: string;
    type: string;
    value: string;
}

export interface Name {
    value: string;
    sign: string;
}

export interface Result {
    id: number;
    odds?: number;
    name?: Name;
    sourceName?: Name;
    visibility?: string;
    numerator?: number;
    denominator?: number;
    americanOdds?: number;
    attr?: string;
    totalsPrefix?: string;
    status: string;
    price?: Price;
}

export interface FinalResult {
    id: number | string | undefined;
    gameName: string;
    selections: Selections[];
}
export interface SeriesCorrectScore {
    id: number | undefined;
    gameName: string;
    selections: Selections[];
}

export interface Selections {
    selectionPrice: string;
    selectionName: string;
}

export interface Price {
    numerator: number;
    denominator: number;
}

export enum GameType {
    boxing = 'boxing',
    cricket = 'cricket',
    darts = 'darts',
    football = 'football',
    formulaRacing = 'formula 1',
    golf = 'golf',
    nfl = 'american football',
    rugbyleague = 'rugby league',
    rugbyunion = 'rugby union',
    snooker = 'snooker',
    tennis = 'tennis',
}

export interface EachWayTerms {
    numerator: number;
    denominator: number;
    places: number;
}
export class OutRightContentParams extends SportContentParameters {}
