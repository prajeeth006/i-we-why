import { Injectable, Type } from '@angular/core';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/**
 * Options for AccountMenuService Toggle method
 *
 * @stable
 */
export interface ToggleMenuOptions {
    /**
     * Adds optional initial virtual route
     */
    route?: string;
    /**
     * Sets menu to be opened in single page mode
     */
    singlePageMode?: boolean;
    /**
     * Sets menu anchor element
     */
    anchorElementKey?: string;
    /**
     * Indicates if the account menu is closed by the close button
     */
    closedWithButton?: boolean;
}

/**
 * @whatItDoes Provides functionality to manipulate the account menu
 *
 * @description
 *
 * # Overview
 *
 * This service provides functionality for manipulating the bottom sheet menu:
 *  - Toggle the menu
 *  - Set counter for menu item
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class AccountMenuService extends LazyServiceProviderBase {
    get version(): number {
        return this.inner.version;
    }

    get routerMode(): number {
        return this.inner.routerMode;
    }

    toggle(show: boolean, toggleOptions?: ToggleMenuOptions): void {
        this.inner.toggle(show, toggleOptions);
    }

    getAccountMenuComponent(itemType: string | undefined): Type<any> | null {
        return this.inner.getAccountMenuComponent(itemType);
    }

    setItemCounter(itemName: string, count: any, cssClass?: string): void {
        this.inner.setItemCounter(itemName, count, cssClass);
    }

    setActiveItem(itemName: string): void {
        this.inner.setActiveItem(itemName);
    }

    updatePokerCashback(): void {
        this.inner.updatePokerCashback();
    }

    updateLoyaltyCashback(): void {
        this.inner.updateLoyaltyCashback();
    }

    updateCoralCashback(): void {
        this.inner.updateCoralCashback();
    }

    updateMLifeProfile(): void {
        this.inner.updateMLifeProfile();
    }

    setAccountMenuComponent(itemType: string, component: Type<any>): void {
        this.inner.setAccountMenuComponent(itemType, component);
    }

    setReturnUrlCookie(url: string): void {
        this.inner.setReturnUrlCookie(url);
    }

    removeReturnUrlCookie(): void {
        this.inner.removeReturnUrlCookie();
    }
}
