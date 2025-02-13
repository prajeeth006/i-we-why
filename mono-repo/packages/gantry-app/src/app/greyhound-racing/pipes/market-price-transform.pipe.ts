import { Pipe, PipeTransform } from '@angular/core';

import { SportBookMarketHelper } from '../../common/helpers/sport-book-market.helper';
import { SportBookMarketStructured } from '../../common/models/data-feed/sport-bet-models';
import { DisplayStatus, EventStatus, MarketStatus, SelectionSuspended } from '../../common/models/general-codes-model';
import { GreyhoundRacingEntry } from '../models/greyhound-racing-template.model';

@Pipe({
    name: 'marketPriceTransform',
})
export class MarketPriceTransformPipe implements PipeTransform {
    transform(
        price: string,
        isSuspended?: boolean,
        greyhoundRacingEntry?: GreyhoundRacingEntry,
        market?: SportBookMarketStructured,
        isRaceOff?: boolean,
        eventStatus?: string,
        eventDisplayStatus?: string,
        isVirtualEvent?: boolean,
        isPastPrice?: boolean,
    ): string {
        if (greyhoundRacingEntry?.nonRunner) {
            return ' ';
        }
        if (isSuspended) {
            return SelectionSuspended.selectionAndPrice;
        }
        if (!isVirtualEvent) {
            if (
                (greyhoundRacingEntry?.hideEntry && market && greyhoundRacingEntry?.hideEntry[market.marketName]) ||
                (market?.marketStatus?.toUpperCase() == MarketStatus.Suspended &&
                    market?.displayStatus?.toUpperCase() == DisplayStatus.NotDisplayed) ||
                (eventStatus?.toUpperCase() == EventStatus.Suspended && eventDisplayStatus?.toUpperCase() == DisplayStatus.NotDisplayed)
            ) {
                return !isPastPrice ? SelectionSuspended.selectionAndPrice : '';
            }

            if (!(isRaceOff && eventStatus?.toUpperCase() == EventStatus.Suspended && eventDisplayStatus?.toUpperCase() == DisplayStatus.Displayed)) {
                if (isRaceOff && market?.marketStatus?.toUpperCase() == MarketStatus.Suspended) {
                    //Continue...
                } else if (
                    (greyhoundRacingEntry?.hidePrice && market && greyhoundRacingEntry?.hidePrice[market.marketName]) ||
                    market?.marketStatus?.toUpperCase() == MarketStatus.Suspended
                ) {
                    if (
                        (greyhoundRacingEntry?.hidePrice && market && greyhoundRacingEntry?.hidePrice[market.marketName]) ||
                        eventStatus?.toUpperCase() == EventStatus.Suspended ||
                        market?.marketStatus?.toUpperCase() == MarketStatus.Suspended
                    ) {
                        return !isPastPrice ? SelectionSuspended.selectionAndPrice : '';
                    }
                }
            }
        }
        return SportBookMarketHelper.prepareEvs(price);
    }
}
