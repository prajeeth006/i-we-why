import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model"

export class NflCdsContent {
    games?: Game[]
    eventStartDate?: string
    sportName?: string
    title?: string
    competitionName: string
    content: NflContentParams;
    context: string;
}


export interface Game {
    id?:number;
    gameName?: string
    matchBetting?: Selection
  }
  
  export interface Selection {
    homeBettingPrice?: string
    homePlayer?: string
    awayBettingPrice?: string
    awayPlayer?: string
  }
  
  export class NflContentParams extends SportContentParameters{
  }
