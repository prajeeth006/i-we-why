import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'marketName',
})
export class MarketNamePipe implements PipeTransform {
    transform(value: string): unknown {
        const bettingWithoutMarket = 'BETTING WITHOUT';
        const marketName = value?.toLocaleUpperCase();
        return marketName?.includes(bettingWithoutMarket) ? 'BETTING W/O' : marketName;
    }
}
