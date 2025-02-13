import { Component } from '@angular/core';

import { MenuItemComponent as vnMenuItemComponent } from '@frontend/vanilla/features/menus';

import { ProductMenuService as LocalProductMenuService } from '../product-menu.service';
import { ProductMenuItemBase } from './product-menu-item-base';

@Component({
    standalone: true,
    imports: [vnMenuItemComponent],
    selector: 'vn-pm-menu-item',
    templateUrl: 'menu-item.html',
})
export class MenuItemComponent extends ProductMenuItemBase {
    constructor(private localProductMenuService: LocalProductMenuService) {
        super();
    }

    click() {
        if (this.productMenuService.isTab(this.item) && this.item.children) {
            this.productMenuService.openTab(this.item.name);
        } else if (!this.productMenuService.routerMode) {
            this.localProductMenuService.toggle();
        }
    }
}
