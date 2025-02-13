import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective, MenuItemsService, MenuSection } from '@frontend/vanilla/core';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-am-row-layout',
    templateUrl: 'row-layout.html',
})
export class RowLayoutComponent extends AccountMenuItemBase {
    constructor(private menuItemsService: MenuItemsService) {
        super();
    }

    isActive() {
        return this.menuItemsService.isActive(MenuSection.Menu, this.item.name);
    }
}
