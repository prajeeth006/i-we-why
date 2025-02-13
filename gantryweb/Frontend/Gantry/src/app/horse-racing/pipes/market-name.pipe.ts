import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketName'
})
export class MarketNamePipe implements PipeTransform {

  transform(value: string): unknown {
    let bettingWithoutMarket = 'BETTING WITHOUT';
    let marketName = value?.toLocaleUpperCase();
    return marketName?.includes(bettingWithoutMarket) ? 'BETTING W/O' : marketName;
  }

}
