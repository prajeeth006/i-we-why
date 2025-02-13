export enum footBallCdsTemplateIds {
  FIGHTBETTING = "Match Result",
  BOTHTEAMTOSCORE = "Both teams to score",
  MATCHRESULTBOTHTEAMTOSCORE = "Match Result and Both Teams to Score",
  TOTALGOALSFINISH = "Total Goals",
  FIRSTGOALSCORER = "1st Goalscorer",
  CORRECTSCORE = "Correct Score"
}


export class MarketParameters {
  MarketType?: string;
  Places?: number;
  Position?: string;
  Happening?: string;
  Period?:string;
  DecimalValue?: string;
}
