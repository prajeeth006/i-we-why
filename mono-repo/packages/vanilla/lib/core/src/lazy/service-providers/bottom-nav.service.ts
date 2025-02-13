import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

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
export class BottomNavService extends LazyServiceProviderBase {
    show(): void {
        this.inner.show();
    }

    hide(): void {
        this.inner.hide();
    }

    setItemCounter(itemName: string, count: any, cssClass?: string): void {
        this.inner.setItemCounter(itemName, count, cssClass);
    }

    setActiveItem(itemName: string): void {
        this.inner.setActiveItem(itemName);
    }

    isEnabled(): Observable<boolean> {
        return this.inner.isEnabled();
    }
}
