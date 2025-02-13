import { Pipe, PipeTransform } from '@angular/core';

import { SportBookMarketHelper } from '../helpers/sport-book-market.helper';

@Pipe({
    name: 'prepareEvsPipe',
})
export class PrepareEvsPipe implements PipeTransform {
    transform(price: string): string {
        if (price) {
            return SportBookMarketHelper.prepareEvs(price);
        }
        return price;
    }
}
