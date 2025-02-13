import { Pipe, PipeTransform } from '@angular/core';
import { ManualGreyhoundRacingEntry } from '../models/greyhound-racing-manual-template.model';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { PriceType } from 'src/app/common/models/general-codes-model';

@Pipe({
  name: 'manualMarketPrice'
})
export class ManualMarketPricePipe implements PipeTransform {

  transform(price: string, greyhoundRacingEntry: ManualGreyhoundRacingEntry): string {
    let _price = price?.toString().toUpperCase();
    
    if (greyhoundRacingEntry?.isVacant) {
      return '';
    } else if (greyhoundRacingEntry?.isStartPrice) {
      return PriceType.startPrice;
    } else if (_price === PriceType.forecast || _price === PriceType.tricast) {
      return price.toUpperCase();
    }

    let evsText = SportBookMarketHelper.prepareEvs(price.toString());
    if(evsText == PriceType.evs){
      return evsText;
    }else{
      if(greyhoundRacingEntry?.currentPrice && greyhoundRacingEntry?.currentPrice.endsWith('/1')){
        return greyhoundRacingEntry?.currentPrice.split('/')[0];
      }
      return greyhoundRacingEntry?.currentPrice;
    }
  }

}
