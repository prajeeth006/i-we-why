import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import { Markets } from '../models/gantrymarkets.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GantryMarketsService {
  constructor(
    private httpService: HttpService
) { }


  gantryMarkets$ = this.httpService.get<Array<Markets>>('en/api/getMarkets')
  .pipe(shareReplay());


  hasMarket(sport: string, marketKey: string, marketTitle: string, gantryMarkets: Array<Markets>): string{
	let findedMarket = gantryMarkets?.find(x=> x.sport == sport)?.markets?.find(y => y.name == marketKey)
    marketTitle = marketTitle ? marketTitle.trim().toUpperCase() : marketTitle;

    let hasMatchedMarket = findedMarket?.matches?.some(match => {
      let regExp = new RegExp(match.toUpperCase(), 'i');
      return  regExp.test(marketTitle);
    })

    if(hasMatchedMarket){
      return marketTitle;
    }
    return null;
  }

}
