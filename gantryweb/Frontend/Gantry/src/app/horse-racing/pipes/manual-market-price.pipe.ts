import { Pipe, PipeTransform } from '@angular/core';
import { ManualHorseRacingEntry } from '../models/horse-racing-manual-template.model';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { PriceType } from 'src/app/common/models/general-codes-model';

@Pipe({
  name: 'manualMarketPrice'
})
export class ManualMarketPricePipe implements PipeTransform {

  transform(price: string, horseRacingEntry: ManualHorseRacingEntry): string {
    let _price = price?.toString().toUpperCase();
    if(horseRacingEntry.nonRunner){
      return PriceType.nonRunner;
    }else if(horseRacingEntry.isStartPrice){
      return PriceType.startPrice;
    } else if (_price === PriceType.forecast || _price === PriceType.tricast) {
      return price.toUpperCase();
    }

    let evsText = SportBookMarketHelper.prepareEvs(price.toString());
    if(evsText == PriceType.evs){
      return evsText;
    }else{
      if(horseRacingEntry?.fractionPrice && horseRacingEntry?.fractionPrice.endsWith('/1')){
        return horseRacingEntry.fractionPrice.split('/')[0];
      }
      return horseRacingEntry.fractionPrice;
    }
  }

}
