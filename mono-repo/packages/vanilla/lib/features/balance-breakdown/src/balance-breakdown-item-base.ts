import { Directive, Input, Type, inject } from '@angular/core';

import { MenuActionOrigin, MenuActionsService, MenuContentItem, MenuSection } from '@frontend/vanilla/core';

import { BalanceBreakdownService } from './balance-breakdown.service';

/** @stable */
@Directive()
export abstract class BalanceBreakdownItemBase {
    @Input() item: MenuContentItem;
    readonly trackByItem = (_: number, item: MenuContentItem) => item;

    protected balanceBreakdownService = inject(BalanceBreakdownService);
    protected menuActionsService = inject(MenuActionsService);

    MenuSection = MenuSection;

    getItemComponent(type: string): Type<any> | null {
        return this.balanceBreakdownService.getBalanceBreakdownComponent(type);
    }

    processClick(event: Event, item: MenuContentItem) {
        this.menuActionsService.processClick(event, item, MenuActionOrigin.BalanceBreakdown);
    }
}
