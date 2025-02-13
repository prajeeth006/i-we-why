import { Injectable, Type } from '@angular/core';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/**
 * @whatItDoes Provides functionality to manipulate the bottom sheet
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
export class BottomSheetService extends LazyServiceProviderBase {
    setItemCounter(itemName: string, count: any, cssClass?: string): void {
        this.inner.setItemCounter(itemName, count, cssClass);
    }
    setBottomSheetComponent(itemType: string, component: Type<any>): void {
        this.inner.setBottomSheetComponent(itemType, component);
    }
    getBottomSheetComponent(itemType: string | undefined): Type<any> | null {
        return this.inner.getBottomSheetComponent(itemType);
    }
}
