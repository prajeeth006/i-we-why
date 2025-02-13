import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-bb-bonus-balance-items',
    templateUrl: 'bonus-balance-items-layout.html',
})
export class BonusBalanceItemsLayoutComponent extends BalanceBreakdownItemBase {
    constructor() {
        super();
    }
}
