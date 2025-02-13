import { Pipe, PipeTransform } from '@angular/core';

import { SportBookMarketHelper } from '../helpers/sport-book-market.helper';
import { StringHelper } from '../helpers/string.helper';
import { SelectionSuspended } from '../models/general-codes-model';

@Pipe({
    name: 'marketPriceTransform',
})
export class MarketPriceTransformPipe implements PipeTransform {
    transform(price: string, isSuspended?: boolean): string {
        let selectionPrice = '';
        if (isSuspended) {
            return SelectionSuspended.selectionAndPrice;
        } else {
            price = StringHelper?.setSelectionPrice(price);
            if (Number.isNaN(parseInt(price))) {
                selectionPrice = price;
            } else {
                selectionPrice = price ? (price?.includes('/') ? price : price + '/1') : '';
            }
        }
        return SportBookMarketHelper.prepareEvs(selectionPrice);
    }
}
