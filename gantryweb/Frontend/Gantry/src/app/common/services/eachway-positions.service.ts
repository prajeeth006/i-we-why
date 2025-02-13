import { Injectable } from '@angular/core';
import { HorseRacingMarkets } from 'src/app/horse-racing/models/common.model';

@Injectable({
  providedIn: 'root'
})
export class EachwayPositionsService {
  private positions: Array<string> = [];

  setEachWay(eachWays: string, winOnly: string, odds: string, places: string): string {
    let eachWayPositions = eachWays?.trim()?.split(" "); // Split eachWay term to find the positions which we want to show in results page : EACH WAY 1/4 1-2-3-4
    if (!!eachWayPositions && (eachWayPositions[1] === '1/1' || eachWays?.toLocaleUpperCase() === HorseRacingMarkets.WinOnly) || !eachWays) {
      return eachWays = winOnly;
    }
    if (eachWayPositions?.length == 3) {
      eachWays = eachWayPositions[0] + ": " + eachWayPositions[1] + " " + odds + ", ";
      this.positions = eachWayPositions[2]?.split("-");
      if (this.positions?.length > 0) {
        eachWays += this.positions[this.positions.length - 1] + " " + places;
      }
      return eachWays;
    }
    else {
      return eachWays;
    }
  }

  constructor() { }
}
