import { Injectable } from '@angular/core';

/**
 * @stable
 */
export interface MenuItemCounter {
    count: any;
    cssClass?: string | undefined; // Optional undefined
    type?: string | undefined; // Optional undefined
}

/**
 * @stable
 */
export enum MenuSection {
    BalanceBreakdown = 'BalanceBreakdown',
    BottomNav = 'BottomNav',
    BottomSheet = 'BottomSheet',
    DropdownHeader = 'DropdownHeader',
    Footer = 'Footer',
    Header = 'Header',
    HeaderPills = 'HeaderPills',
    Login = 'Login',
    Menu = 'Menu',
    NewVisitorPage = 'NewVisitorPage',
    PageMatrix = 'PageMatrix',
    ProductMenu = 'ProductMenu',
    ProductMenuApps = 'ProductMenu_Apps',
    ProductMenuTop = 'ProductMenu_Top',
    ProfilePageCommonActions = 'ProfilePage_CommonActions',
}

/**
 * @whatItDoes Controls the counter and active state of `MenuItemComponent`
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class MenuItemsService {
    private itemCounters: Map<string, Map<string, MenuItemCounter>> = new Map();
    private activeItems: Map<string, string | null> = new Map();
    private descriptions: Map<string, string | null> = new Map();
    private descriptionCssClasses: Map<string, string | null> = new Map();

    setCounter(section: string, itemName: string, count: any, cssClass?: string, type?: string) {
        const item = this.getCounter(section, itemName);

        if (item) {
            item.count = count;
            item.cssClass = cssClass;
            item.type = type;
        }
    }

    getCounter(section: string, itemName: string): MenuItemCounter | null {
        this.ensureItemCounter(section, itemName);

        return this.itemCounters.get(section)?.get(itemName) || null;
    }

    setActive(section: string, itemName: string | null) {
        this.activeItems.set(section, itemName);
    }

    isActive(section: string, itemName: string): boolean {
        return this.activeItems.get(section) === itemName;
    }

    setDescription(section: string, itemName: string, description: string | null) {
        this.descriptions.set(section + itemName, description);
    }

    getDescription(section: string, itemName: string): string | null {
        return this.descriptions.get(section + itemName) || null;
    }

    setDescriptionCssClass(section: string, itemName: string, cssClass: string | null) {
        this.descriptionCssClasses.set(section + itemName, cssClass);
    }

    getDescriptionCssClass(section: string, itemName: string): string | null {
        return this.descriptionCssClasses.get(section + itemName) || null;
    }

    private ensureItemCounter(section: string, itemName: string) {
        if (!this.itemCounters.has(section)) {
            this.itemCounters.set(section, new Map());
        }

        const sectionMap = this.itemCounters.get(section)!;
        if (!sectionMap.has(itemName)) {
            sectionMap.set(itemName, { count: undefined, cssClass: undefined });
        }
    }
}
