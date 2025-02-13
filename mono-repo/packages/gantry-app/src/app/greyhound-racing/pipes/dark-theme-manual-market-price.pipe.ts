import { Pipe, PipeTransform } from '@angular/core';

import { SportBookMarketHelper } from '../../common/helpers/sport-book-market.helper';
import { PriceType } from '../../common/models/general-codes-model';
import { ManualGreyhoundRacingEntry } from '../models/greyhound-racing-manual-template.model';

@Pipe({
    name: 'darkThemeManualMarketPrice',
})
export class DarkThemeManualMarketPricePipe implements PipeTransform {
    transform(price: string, greyhoundRacingEntry: ManualGreyhoundRacingEntry): string {
        const _price = price?.toString().toUpperCase();

        if (greyhoundRacingEntry?.isVacant) {
            return '';
        } else if (greyhoundRacingEntry?.isStartPrice) {
            return PriceType.startPrice;
        } else if (_price === PriceType.forecast || _price === PriceType.tricast) {
            return price?.toUpperCase();
        }

        const evsText = SportBookMarketHelper.prepareEvs(price?.toString());
        if (evsText == PriceType.evs) {
            return evsText;
        } else {
            if (!greyhoundRacingEntry?.currentPrice?.includes('/')) {
                return greyhoundRacingEntry?.currentPrice + '/1';
            }
            return greyhoundRacingEntry?.currentPrice;
        }
    }
}
