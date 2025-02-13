import { Injectable } from '@angular/core';

import { MenuCounters, MenuCountersProvider, MenuSection } from '@frontend/vanilla/core';
import { OffersService } from '@frontend/vanilla/shared/offers';

@Injectable()
export class OffersMenuCountersProvider implements MenuCountersProvider {
    get order() {
        return 10;
    }

    constructor(private offersService: OffersService) {}

    setCounters(counters: MenuCounters): void {
        const count = this.offersService.getCount('ALL') || null;

        counters.set(MenuSection.Header, 'promo', count);
        counters.set(MenuSection.Menu, 'offers', count);
        counters.set(MenuSection.Menu, 'myrewards', count); // because we can and sitecore has enough space :)
        counters.set(MenuSection.BottomNav, 'myoffers', count);
    }
}
