import { Injectable } from '@angular/core';

import { MenuCounters, MenuCountersProvider, MenuItemCounter, MenuSection } from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { BadgeConfig } from '@frontend/vanilla/shared/badge';

@Injectable()
export class AvatarMenuCountersProvider implements MenuCountersProvider {
    constructor(
        private badgeConfig: BadgeConfig,
        private accountMenuDataService: AccountMenuDataService,
    ) {}

    get order(): number {
        return 30;
    }

    setCounters(counters: MenuCounters) {
        const menuSection = counters.sections.get(MenuSection.Menu);

        if (menuSection) {
            this.accountMenuDataService.content.subscribe(() => {
                const items = Array.from(menuSection)
                    .filter(
                        ([name, item]) =>
                            Object.keys(this.accountMenuDataService.hierarchy.main.menu).some((key: string) => key == name) && item.count,
                    )
                    .map((params: [string, MenuItemCounter]) => params[1].count);

                if (items.length > 0) {
                    const counterSum = items.reduce((prev, curr) => prev + curr);

                    if (items.length == 1 || counterSum > 9) {
                        AvatarMenuCountersProvider.setCounter(counters, 0, `theme-spot-filled ${this.badgeConfig.cssClass}`);
                    } else {
                        AvatarMenuCountersProvider.setCounter(counters, counterSum);
                    }
                } else {
                    AvatarMenuCountersProvider.setCounter(counters, null);
                }
            });
        } else {
            AvatarMenuCountersProvider.setCounter(counters, null);
        }
    }

    private static setCounter(counters: MenuCounters, count: number | null, cssClass?: string) {
        counters.set(MenuSection.Header, 'avatar', count, cssClass);
        counters.set(MenuSection.Header, 'avatarbalance', count, cssClass);
    }
}
