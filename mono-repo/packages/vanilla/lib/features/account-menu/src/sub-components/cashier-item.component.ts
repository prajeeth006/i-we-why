import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrencyPipe, DslService, SolvePipe } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { Observable } from 'rxjs';

import { AccountMenuItemBase } from '../account-menu-item-base';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, SolvePipe, CurrencyPipe],
    selector: 'vn-am-cashier-item',
    templateUrl: 'cashier-item.html',
    host: {
        class: 'd-flex justify-content-between align-items-center',
    },
})
export class CashierItemComponent extends AccountMenuItemBase implements OnInit {
    balanceValue: Observable<number>;
    balanceFormula: string;

    constructor(
        public balancePropertiesService: BalancePropertiesService,
        private dslService: DslService,
    ) {
        super();
    }

    ngOnInit() {
        const balanceDsl = this.item.parameters['balance'];

        if (balanceDsl) {
            this.balanceValue = this.dslService.evaluateExpression<number>(balanceDsl);
        } else {
            // Legacy balance formula. Remove when Sitecore items are updated
            this.balanceFormula = this.item.parameters['formula']!;
        }
    }
}
