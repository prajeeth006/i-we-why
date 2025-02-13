import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-bb-container',
    templateUrl: 'balance-container.html',
})
export class BalanceContainerComponent extends BalanceBreakdownItemBase {
    constructor() {
        super();
    }
}
