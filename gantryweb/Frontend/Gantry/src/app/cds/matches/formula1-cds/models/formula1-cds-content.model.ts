import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model";

export class Formula1CdsContent {
  eventStartDate?: string
  sportName?: string
  title?: string
  competitionName?: string
  content?: Formula1ContentParams;
  context?: string;
  racerList?: Array<Racers> = [];
  racerBetNameList?: Array<RacerBetName> = [];
  tradingBetNameList?: Array<RacerBetName> = [];
  winOrEachWayTextList?: Array<EachWayText> = []; 
}
export class Racers {
  driverName: string;
  selectionDetails: Array<BetDetails> = [];
  hideEntry?: boolean = false;
}


export interface Selection {
  homeBettingPrice?: string
  homePlayer?: string
  awayBettingPrice?: string
  awayPlayer?: string
  scorePoint?: string
  isMatchedPair?: boolean
}

export class Formula1ContentParams extends SportContentParameters {
}

export class RacerBetName {
  betName: string;
}

export class EachWayText {
  winOrEachWayText: string | null | undefined;
}

export class BetDetails {
  betName: string;
  betOdds: string;
  order: number;
  constructor(order: number, betName: string, betOdds: string) {
    this.order = order;
    this.betName = betName;
    this.betOdds = betOdds;
  }
}

