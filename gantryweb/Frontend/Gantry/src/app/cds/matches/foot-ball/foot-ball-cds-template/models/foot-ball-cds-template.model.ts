import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model";
import { FootBallDataContent } from "./foot-ball-model";

export class FootBallCdsTemplateResult {
  title?: string
  content: FootBallContentParams;
  finalResult: FinalResult;
  bothTeamScore: BothTeamToScore;
  matchResultBothTeamScore: MatchResultBothTeamToScore;
  marketResult: any;
  totalGoals: TotalGoalsFinish;
  footBallContent: FootBallDataContent;
  eventStartDate?: string;
  firstGoalScorer: FirstGoalScorer;
  correctScore: CorrectScore;
}

export class FinalResult {
  selections: MatchSelection[];
}

export interface Selections {
  homePrice: string,
  homeSelectionTitle: string,
  awayPrice: string,
  awaySelectionTitle: string,
}

export interface BothTeamToScore {
  gameName: string;
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
  gameName: string;
  selections: Selection[];
}

export interface TotalGoalsFinish {
  selections: BetDetails[],
}
export interface Selection {
  homePrice: string,
  homeSelectionTitle: string,
  awayPrice: string,
  awaySelectionTitle: string,

}

export class MatchSelection {
  homePrice: string;
  homeSelectionTitle: string;
  awayPrice: string;
  awaySelectionTitle: string;
  drawPrice: string;
  drawSelectionTitle?: string
}

export class OptionalMarket {
  id?: number;
  gameName?: string
  marketName?: string
  matchBetting?: Selection
  results?: Result[];
  options?: Option[];
  name?: Name;
  parameters?: any[]
}
export interface Name {
  value: string
}

export interface Result {
  status?: any
  visibility: string
  numerator?: number
  denominator?: number
  americanOdds?: number
  attr?: string
  totalsPrefix?: string
  odds?: string
}


export class BetDetails {
  homePrice?: string;
  name?: string;
  awayPrice?: string;
}

export class FootBallContentParams extends SportContentParameters {
}



export class Option {
  id: number
  status: string
  name: Name
  price: Price
  sourceName? : {
    [attr:string]: string
  }

}

export class Name {
  value: string
  sign: string
}

export class Price {
  id: number
  numerator: number
  denominator: number
  odds: number
  americanOdds: number
}
