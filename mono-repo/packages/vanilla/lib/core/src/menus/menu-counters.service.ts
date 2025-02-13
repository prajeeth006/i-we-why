import { Injectable, InjectionToken } from '@angular/core';

import { MenuItemCounter, MenuItemsService } from './menu-items.service';

/** @stable */
export class MenuCounters {
    sections = new Map<string, Map<string, MenuItemCounter>>();

    set(sectionName: string, itemName: string, count: any, cssClass?: string, type?: string) {
        let section: Map<string, MenuItemCounter>;

        if (this.sections.has(sectionName)) {
            section = this.sections.get(sectionName)!;
        } else {
            section = new Map<string, MenuItemCounter>();
            this.sections.set(sectionName, section);
        }

        section.set(itemName, { count, cssClass, type });
    }
}

/**
 * @whatItDoes Represents a provider of menu counters.
 *
 * @howToUse
 *
 * ```
 * @Injectable
 * export class SportsMenuCountersProvider implements MenuCountersProvider {
 *     get order() { return 100; }
 *
 *     constructor(private betsService: BetsService) {
 *     }
 *
 *     setCounters(counters: MenuCounters) {
 *         counters.set(MenuSection.Header, 'sports', 2, 'badge-info');
 *         counters.set(MenuSection.AccountMenu, 'bets', this.betsService.count);
 *     }
 * }
 *
 * @NgModule()
 * export class SportsCountersModule {
 *     static forRoot(): ModuleWithProviders<SportsCountersModule> {
 *         return {
 *             ngModule: SportsCountersModule,
 *             providers: [
 *                 { provide: MENU_COUNTERS_PROVIDER, useClass: SportsMenuCountersProvider, multi: true }
 *             ]
 *         }
 *     }
 * }
 * ```
 *
 * @description
 *
 * Providers will be called in order specified by `order` (from lowest to highest) when `update` is called on {@link MenuCountersService}.
 *
 * @stable
 */
export interface MenuCountersProvider {
    order: number;

    setCounters(counters: MenuCounters): void;
}

/** @stable */
export const MENU_COUNTERS_PROVIDER = new InjectionToken<MenuCountersProvider[]>('vn-menu-counters-provider');

/**
 * @whatItDoes Manages counter badges for all menu items
 *
 * @description
 *
 * When {@link MENU_COUNTERS_PROVIDER} that implement {@link MenuCountersProvider} are registered by calling registerProvider(provider), applies counters
 * from them to menu items when `update` is called. Anyone can call `update` at any time, so values that the providers
 * use should be cached. Asynchronous refreshing of counters should be done by fetching the value, exposing it as a simple
 * property on a service that the provider consumes and then calling `update`.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class MenuCountersService {
    private providers: MenuCountersProvider[] = [];

    constructor(private menuItemsService: MenuItemsService) {}

    registerProviders(providers: MenuCountersProvider[]) {
        this.providers = this.providers.concat(providers);
    }

    update() {
        const counters = new MenuCounters();
        this.providers.sort((a: MenuCountersProvider, b: MenuCountersProvider) => (a.order > b.order ? 1 : -1));
        this.providers.forEach((p: MenuCountersProvider) => p.setCounters(counters));

        counters.sections.forEach((section: Map<string, MenuItemCounter>, sectionName: string) => {
            section.forEach((counter: MenuItemCounter, itemName: string) => {
                this.menuItemsService.setCounter(sectionName, itemName, counter.count, counter.cssClass, counter.type);
            });
        });
    }
}
