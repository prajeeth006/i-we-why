import { Pipe, PipeTransform } from '@angular/core';

import { SportBookMarketHelper } from '../../common/helpers/sport-book-market.helper';
import { SportBookMarketStructured } from '../../common/models/data-feed/sport-bet-models';
import { DisplayStatus, EventStatus, MarketStatus, SelectionSuspended } from '../../common/models/general-codes-model';
import { HorseRacingEntry } from '../models/horse-racing-template.model';

@Pipe({
    name: 'marketPriceTransform',
})
export class MarketPriceTransformPipe implements PipeTransform {
    transform(
        price: string,
        marketName: string,
        horseRacingEntry: HorseRacingEntry,
        isPastPrice?: boolean,
        market?: SportBookMarketStructured,
        isRaceOff?: boolean,
        eventStatus?: string,
        eventDisplayStatus?: string,
        isVirtualEvent?: boolean,
    ): string {
        if (!isVirtualEvent) {
            if (
                (horseRacingEntry?.hideEntry && market && horseRacingEntry.hideEntry[market.marketName]) ||
                (market?.marketStatus?.toUpperCase() == MarketStatus.Suspended &&
                    market?.displayStatus?.toUpperCase() == DisplayStatus.NotDisplayed) ||
                (eventStatus?.toUpperCase() == EventStatus.Suspended && eventDisplayStatus?.toUpperCase() == DisplayStatus.NotDisplayed)
            ) {
                if (horseRacingEntry?.nonRunner && !isPastPrice) {
                    return 'N/R';
                }
                if (horseRacingEntry?.isWithdrawn && !isPastPrice) {
                    return 'W/D';
                }
                return !isPastPrice ? SelectionSuspended.selectionAndPrice : '';
            }

            if (isRaceOff || (eventStatus?.toUpperCase() == EventStatus.Active && market?.marketStatus?.toUpperCase() == MarketStatus.Active)) {
                const nonRunnerPrice = this.checkNRorWD(horseRacingEntry, isPastPrice!, price);
                if (nonRunnerPrice) return nonRunnerPrice;
            }

            if (!(isRaceOff && eventStatus?.toUpperCase() == EventStatus.Suspended && eventDisplayStatus?.toUpperCase() == DisplayStatus.Displayed)) {
                if (isRaceOff && market?.marketStatus?.toUpperCase() == MarketStatus.Suspended) {
                    //Continue...
                } else if (
                    (horseRacingEntry?.hidePrice && market && horseRacingEntry.hidePrice[market.marketName]) ||
                    market?.marketStatus?.toUpperCase() == MarketStatus.Suspended
                ) {
                    if (
                        (horseRacingEntry?.hidePrice && market && horseRacingEntry.hidePrice[market.marketName]) ||
                        eventStatus?.toUpperCase() == EventStatus.Suspended ||
                        market?.marketStatus?.toUpperCase() == MarketStatus.Suspended
                    ) {
                        if (horseRacingEntry?.nonRunner && !isPastPrice) {
                            return 'N/R';
                        }
                        if (horseRacingEntry?.isWithdrawn && !isPastPrice) {
                            return 'W/D';
                        }
                        return !isPastPrice ? SelectionSuspended.selectionAndPrice : '';
                    }
                }
            }
        } else {
            const nonRunnerPrice = this.checkNRorWD(horseRacingEntry, isPastPrice!, price);
            if (nonRunnerPrice) return nonRunnerPrice;
        }

        if (marketName?.toLocaleUpperCase()?.includes('BETTING WITHOUT')) {
            if (!price) {
                return 'W/O';
            }
        }
        return SportBookMarketHelper.prepareEvs(price);
    }

    private checkNRorWD(horseRacingEntry: HorseRacingEntry, isPastPrice: boolean, price: string) {
        if (horseRacingEntry.nonRunner && !isPastPrice) {
            return 'N/R';
        } else if (horseRacingEntry?.nonRunner && isPastPrice) {
            return price;
        }

        if (horseRacingEntry?.isWithdrawn && !isPastPrice) {
            return 'W/D';
        } else if (horseRacingEntry?.isWithdrawn && isPastPrice) {
            return price;
        }

        return null;
    }
}
