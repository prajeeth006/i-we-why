import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model"

export class CricketCdsTemplateResult {
  games?: Game[]
  eventStartDate?: string
  sportName?: string
  title?: string
  competitionName: string
  content: CricketContentParams;
  topScore100List?: Array<BetDetails>;
  context: string;
  marketVersesName?: string;
  totalSixes: Selection;
  isTestMatch?: boolean = false;
  isSuperOver?: boolean = false;
}

export interface Game {
  id?: number;
  gameName?: string
  marketName?: string
  matchBetting?: Selection
  topRunScorer?: TopRunScorer
  totalSixes?: Selection;
  topScore100in1stInns?: BetDetails;
  isMatchBetting?: boolean
  isSuperOverBetting?: boolean
  isTestMatchBetting?: boolean
  isHomeTopRunscorer?: boolean
  isAwayTopRunscorer?: boolean
  isTotalSixes?: boolean
  isTopScore100?: boolean
}

export interface Selection {
  homeBettingPrice?: string
  homePlayer?: string
  awayBettingPrice?: string
  awayPlayer?: string
  drawBettingPrice?: string
  drawPlayer?: string
}

export class TopRunScorer {
  homeTeamTopRunScorerList?: Array<BetDetails>;
  awayTeamTopRunScorerList?: Array<BetDetails>;
  order?: number;
}

export class CricketContentParams extends SportContentParameters {
}

export class BetDetails {
  betName?: string;
  betOdds?: string;
}
