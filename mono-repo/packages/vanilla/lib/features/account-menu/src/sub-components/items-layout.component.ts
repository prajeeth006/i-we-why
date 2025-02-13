import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-am-items-layout',
    templateUrl: 'items-layout.html',
})
export class ItemsLayoutComponent extends AccountMenuItemBase {
    constructor() {
        super();
    }
}
