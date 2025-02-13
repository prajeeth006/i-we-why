import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';

import { AccountMenuItemBase } from '../account-menu-item-base';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-am-cashier-box',
    templateUrl: 'cashier-box.html',
})
export class CashierBoxComponent extends AccountMenuItemBase {
    constructor() {
        super();
    }
}
