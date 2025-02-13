import { Pipe, PipeTransform } from '@angular/core';
import { SportBookMarketHelper } from '../helpers/sport-book-market.helper';
import { SelectionSuspended } from '../models/general-codes-model';

@Pipe({
  name: 'hideEntry'
})
export class HideEntryPipe implements PipeTransform {

  transform(price: string, isSuspended: boolean, hideEntry: boolean): string {
    let selectionPrice = '';
    if (isSuspended && hideEntry)
      return "";
    else if (isSuspended && !hideEntry)
      return SelectionSuspended.selectionAndPrice;
    else
      selectionPrice = price ? price : '';
    return SportBookMarketHelper.prepareEvs(selectionPrice);
  }

}
