import { Pipe, PipeTransform } from '@angular/core';

import { SportBookMarketHelper } from '../../common/helpers/sport-book-market.helper';
import { PriceType } from '../../common/models/general-codes-model';
import { ManualHorseRacingEntry } from '../models/horse-racing-manual-template.model';

@Pipe({
    name: 'manualMarketPrice',
})
export class ManualMarketPricePipe implements PipeTransform {
    transform(price: string, horseRacingEntry: ManualHorseRacingEntry): string {
        const _price = price?.toString()?.toUpperCase();
        if (horseRacingEntry.nonRunner) {
            return PriceType.nonRunner;
        } else if (horseRacingEntry.isStartPrice) {
            return PriceType.startPrice;
        } else if (_price === PriceType.forecast || _price === PriceType.tricast) {
            return price.toUpperCase();
        }

        const evsText = SportBookMarketHelper.prepareEvs(price.toString());
        if (evsText == PriceType.evs) {
            return evsText;
        } else {
            if (horseRacingEntry?.fractionPrice && horseRacingEntry?.fractionPrice.endsWith('/1')) {
                return horseRacingEntry.fractionPrice.split('/')[0];
            }
            return horseRacingEntry.fractionPrice;
        }
    }
}
