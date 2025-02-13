import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-am-side-menu-item',
    templateUrl: 'side-menu-item.html',
})
export class SideMenuItemComponent extends AccountMenuItemBase {
    constructor() {
        super();
    }

    click(event: Event, item: MenuContentItem): void {
        if (!this.item.parameters['disableClick']) {
            this.processClick(event, item, false);
        }
    }
}
