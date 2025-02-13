import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model"

export class OutRightCdsContent {
  games?: Game[]
  eventStartDate?: string
  sportName?: string
  title?: string
  competitionName: string
  content?: OutRightContentParams;
  context: string;
  finalResult: FinalResult;
  correctScore: SeriesCorrectScore;
  typeId? : number
}

export interface Game {
  id?: number;
  gameName?: string;
  name: Name;
  results?: Result[];
  options?: Result[];
  parameters?: any[]
  templateId? : number;
}

export interface Name {
  value: string
  sign: string
}

export interface Result {
  id: number
  odds?: number
  name?: Name
  sourceName?: Name
  visibility?: string
  numerator?: number
  denominator?: number
  americanOdds?: number
  attr?: string
  totalsPrefix?: string
  status?: string,
  price?: Price,

}

export interface FinalResult {
  id: number;
  gameName: string;
  selections: Selections[];
}
export interface SeriesCorrectScore {
  id: number;
  gameName: string;
  selections: Selections[];
}

export interface Selections {
  selectionPrice: string,
  selectionName: string,

}

export interface Price {
  numerator?: number
  denominator?: number

}
export class OutRightContentParams extends SportContentParameters {
}