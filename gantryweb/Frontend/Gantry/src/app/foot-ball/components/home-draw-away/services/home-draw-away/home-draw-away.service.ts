import { Injectable } from "@angular/core";
import { GantryCommonContent } from "src/app/common/models/gantry-commom-content.model";
import { EventDatetimePipe } from "src/app/common/pipes/event-datetime.pipe";
import { HomeDrawAway } from "../../models/home-draw-away.model";
import { HomeAway } from "src/app/cds/matches/tennis/models/multi-match-model";


@Injectable({
    providedIn: 'root'
})
export class HomeDrawAwayService{
    constructor(
        private eventDatetimePipe: EventDatetimePipe
    )
    {}

  getEventTimeDateFromPipe(homeDrawAway: HomeDrawAway[],eventTimeInfo:string,gantryCommonContent:GantryCommonContent):string
  {
    if(homeDrawAway?.length >1)
    {
       if (new Date(homeDrawAway[0]?.eventDateTime).getDate() != new Date(homeDrawAway[homeDrawAway?.length-1].eventDateTime).getDate()
          || new Date(homeDrawAway[0]?.eventDateTime).getMonth() !=new Date(homeDrawAway[homeDrawAway?.length-1].eventDateTime).getMonth()
          || new Date(homeDrawAway[0]?.eventDateTime).getFullYear() !=new Date(homeDrawAway[homeDrawAway?.length-1].eventDateTime).getFullYear())
       {
          return `${this.eventDatetimePipe.transform(eventTimeInfo,homeDrawAway[0]?.eventDateTime,gantryCommonContent)} - ${this.eventDatetimePipe.transform(eventTimeInfo,homeDrawAway.slice(-1)[0]?.eventDateTime,gantryCommonContent)}`;
       }
       else
       {
        return `${this.eventDatetimePipe.transform(eventTimeInfo,homeDrawAway[0]?.eventDateTime,gantryCommonContent)}`;
       }
    }
    else
    {
      return `${this.eventDatetimePipe.transform(eventTimeInfo,homeDrawAway[0]?.eventDateTime,gantryCommonContent)}`;
    }
  }

   getTennisCouponEventTimeDateFromPipe(homeAway: HomeAway[], eventTimeInfo: string, gantryCommonContent: GantryCommonContent): string {
      if (homeAway?.length > 1) {
         if (new Date(homeAway[0]?.eventDateTime).getDate() != new Date(homeAway[homeAway?.length - 1].eventDateTime).getDate()
            || new Date(homeAway[0]?.eventDateTime).getMonth() != new Date(homeAway[homeAway?.length - 1].eventDateTime).getMonth()
            || new Date(homeAway[0]?.eventDateTime).getFullYear() != new Date(homeAway[homeAway?.length - 1].eventDateTime).getFullYear()) {
            return `${this.eventDatetimePipe.transform(eventTimeInfo, homeAway[0]?.eventDateTime, gantryCommonContent)} - ${this.eventDatetimePipe.transform(eventTimeInfo, homeAway.slice(-1)[0]?.eventDateTime, gantryCommonContent)}`;
         }
         else {
            return `${this.eventDatetimePipe.transform(eventTimeInfo, homeAway[0]?.eventDateTime, gantryCommonContent)}`;
         }
      }
      else {
         return `${this.eventDatetimePipe.transform(eventTimeInfo, homeAway[0]?.eventDateTime, gantryCommonContent)}`;
      }
   }

}