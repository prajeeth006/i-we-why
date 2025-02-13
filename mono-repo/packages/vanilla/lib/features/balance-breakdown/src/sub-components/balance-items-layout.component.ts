import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';
import { BalanceBreakdownContent } from '../balance-breakdown.client-config';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-bb-items-layout',
    templateUrl: 'balance-items-layout.html',
})
export class BalanceItemsLayoutComponent extends BalanceBreakdownItemBase {
    constructor(public balanceContent: BalanceBreakdownContent) {
        super();
    }
}
