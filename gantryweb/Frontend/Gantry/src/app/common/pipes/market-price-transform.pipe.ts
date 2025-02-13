import { Pipe, PipeTransform } from '@angular/core';
import { SportBookMarketHelper } from '../helpers/sport-book-market.helper';
import { SelectionSuspended } from '../models/general-codes-model';

@Pipe({
  name: 'marketPriceTransform'
})
export class MarketPriceTransformPipe implements PipeTransform {

  transform(price: string, isSuspended?: boolean): string {
    let selectionPrice = '';
    if (isSuspended)
      return SelectionSuspended.selectionAndPrice;
    else
      selectionPrice = price ? price : '';
    return SportBookMarketHelper.prepareEvs(selectionPrice);
  }

}
