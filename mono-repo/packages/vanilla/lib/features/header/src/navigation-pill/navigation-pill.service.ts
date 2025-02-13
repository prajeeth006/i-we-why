import { Injectable, signal } from '@angular/core';

import { MenuAction, MenuContentItem, MenuItemsService, MenuSection } from '@frontend/vanilla/core';
import { Observable, Subject } from 'rxjs';

/**
 * @whatItDoes
 *
 * Provides access to the currently active navigation and filter pill.
 * Provides possibility to adjust the counter for items with `badgeType: counter`.
 *
 * @howToUse
 *
 * ```
 * navigationPillService.activeNavigationPill.subscribe((navPill: MenuContentItem | null) => { ... });
 * navigationPillService.setBadgeCounter(itemName, count, cssClass?);
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class NavigationPillService {
    readonly currentNavigationPill = signal<MenuContentItem | null>(null);
    readonly currentFilterPill = signal<MenuContentItem | null>(null);

    get activeNavigationPill(): Observable<MenuContentItem | null> {
        return this.activeNavigationPillSubject;
    }

    get activeFilterPill(): Observable<MenuContentItem | null> {
        return this.activeFilterSubject;
    }

    private activeNavigationPillSubject = new Subject<MenuContentItem | null>();
    private activeFilterSubject = new Subject<MenuContentItem | null>();
    private currentActiveNavPill: MenuContentItem | null;

    constructor(private menuItemsService: MenuItemsService) {}

    /**
     * @description Sets the counter value for items with type: `badgeType: counter`.
     */
    setBadgeCounter(itemName: string, count: any, cssClass?: string) {
        this.menuItemsService.setCounter(MenuSection.HeaderPills, itemName, count, cssClass);
    }

    /**
     * @description Resets the state of navigation pills menu.
     */
    resetActiveItem() {
        this.menuItemsService.setActive(MenuSection.HeaderPills, null);

        this.activeNavigationPillSubject.next(null);
        this.activeFilterSubject.next(null);

        this.currentNavigationPill.set(null);
        this.currentFilterPill.set(null);
    }

    /**
     * @description Toggle navigation pill active state in a breadcrumb-like fashion.
     */
    setActiveItem(item: MenuContentItem) {
        const isNavigationPill = item.clickAction === MenuAction.SELECT_NAVIGATION_PILL;
        const isActive = this.menuItemsService.isActive(MenuSection.HeaderPills, item.name);

        this.menuItemsService.setActive(MenuSection.HeaderPills, isActive ? null : item.name);

        if (isNavigationPill) {
            if (isActive) {
                this.resetActiveItem();
                this.currentActiveNavPill = null;
            } else {
                this.currentActiveNavPill = item;
                this.activeNavigationPillSubject.next(item);
                this.currentNavigationPill.set(item);
            }
        } else {
            if (isActive) {
                this.activeFilterSubject.next(null);
                this.activeNavigationPillSubject.next(this.currentActiveNavPill);

                this.currentFilterPill.set(null);
                this.currentNavigationPill.set(this.currentActiveNavPill);

                this.menuItemsService.setActive(MenuSection.HeaderPills, this.currentActiveNavPill?.name || null);
            } else {
                this.activeFilterSubject.next(item);
                this.currentFilterPill.set(item);
            }
        }
    }
}
