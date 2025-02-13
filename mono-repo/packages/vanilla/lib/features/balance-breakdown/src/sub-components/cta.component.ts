import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-bb-cta',
    templateUrl: 'cta.html',
})
export class BalanceCtaComponent extends BalanceBreakdownItemBase {
    constructor() {
        super();
    }
}
