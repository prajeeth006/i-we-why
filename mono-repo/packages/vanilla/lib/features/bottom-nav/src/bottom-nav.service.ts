import { Injectable } from '@angular/core';

import { DslService, MenuItemsService, MenuSection, NavigationService } from '@frontend/vanilla/core';
import { MenuItemHighlightService } from '@frontend/vanilla/shared/menu-item';
import { BehaviorSubject, Observable, skipUntil } from 'rxjs';

import { BottomNavConfig } from './bottom-nav.client-config';

export interface BottomNavControlEvent {
    state: 'show' | 'hide';
}

/**
 * @whatItDoes Provides functionality to manipulate the bottom nav
 *
 * @description
 *
 * # Overview
 *
 * This service provides functionality for manipulating the bottom nav:
 *  - Show and hide (once, until the state is set by scrolling)
 *  - Set counter for an item
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class BottomNavService {
    currentHighlightedProductName: string | null = null;

    private controlEvents = new BehaviorSubject<BottomNavControlEvent>({ state: 'show' });

    constructor(
        private menuItemsService: MenuItemsService,
        private bottomNavConfig: BottomNavConfig,
        private dslService: DslService,
        private navigationService: NavigationService,
        private menuItemHighlightingService: MenuItemHighlightService,
    ) {}

    /** @internal */
    get inputEvents(): Observable<BottomNavControlEvent> {
        return this.controlEvents;
    }

    initProductHighlighting() {
        this.menuItemHighlightingService.initHighlighting(this.bottomNavConfig.items);
        this.navigationService.locationChange.subscribe(() => this.setHighlightedProduct());
    }

    /** Shows the bottom nav if it is currently hidden. */
    show() {
        this.controlEvents.next({ state: 'show' });
    }

    /** Hides the bottom nav if it is currently shown. */
    hide() {
        this.controlEvents.next({ state: 'hide' });
    }

    /** Sets and item in the bottom nav to active state. */
    setActiveItem(itemName: string) {
        this.menuItemsService.setActive(MenuSection.BottomNav, itemName);
    }

    /** Assigns a number to be shown as a counter for a bottom nav item. */
    setItemCounter(itemName: string, count: any, cssClass?: string) {
        this.menuItemsService.setCounter(MenuSection.BottomNav, itemName, count, cssClass);
    }

    /** Gets the enablement status of the bottom nav. */
    isEnabled(): Observable<boolean> {
        return this.dslService.evaluateExpression<boolean>(this.bottomNavConfig.isEnabledCondition).pipe(skipUntil(this.bottomNavConfig.whenReady));
    }

    setHighlightedProduct() {
        const product = this.menuItemHighlightingService.setHighlightedProduct(this.bottomNavConfig.items, this.currentHighlightedProductName);

        if (product?.name) {
            this.menuItemHighlightingService.setActiveItem(MenuSection.BottomNav, product.name);
        }
    }
}
