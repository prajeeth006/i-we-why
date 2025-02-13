import { Injectable, Type } from '@angular/core';

import { MenuItemsService, MenuSection } from '@frontend/vanilla/core';

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
@Injectable()
export class BottomSheetService {
    private bottomSheetComponents = new Map<string, Type<any>>();

    constructor(private menuItemsService: MenuItemsService) {}

    setItemCounter(itemName: string, count: any, cssClass?: string) {
        this.menuItemsService.setCounter(MenuSection.BottomSheet, itemName, count, cssClass);
    }

    /** Set a component type for menu item type. */
    setBottomSheetComponent(itemType: string, component: Type<any>) {
        this.bottomSheetComponents.set(itemType, component);
    }

    /** Gets a component type for menu item type. */
    getBottomSheetComponent(itemType: string | undefined) {
        itemType = itemType || 'default';

        return this.bottomSheetComponents.get(itemType) || null;
    }
}
