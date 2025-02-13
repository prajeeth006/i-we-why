import { Injectable, Type, signal } from '@angular/core';

import { MenuContentItem } from '@frontend/vanilla/core';

/**
 * @whatItDoes Provides utility functions for balance breakdown page
 *
 * @stable
 */
@Injectable({ providedIn: 'root' })
export class BalanceBreakdownService {
    readonly slide = signal<MenuContentItem | null>(null);
    readonly isSingleProduct = signal<boolean>(false);

    private balanceBreakdownComponents = new Map<string, Type<any>>();

    /** Set a component type for balance breakdown item type. */
    setBalanceBreakdownComponent(itemType: string, component: Type<any>) {
        this.balanceBreakdownComponents.set(itemType, component);
    }

    /** Gets a component type for balance breakdown item type. */
    getBalanceBreakdownComponent(itemType: string | undefined): Type<any> | null {
        return this.balanceBreakdownComponents.get(itemType || 'button') || null;
    }
}
