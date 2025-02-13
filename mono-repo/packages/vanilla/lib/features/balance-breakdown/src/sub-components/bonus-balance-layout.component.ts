import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrencyPipe, DslService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, CurrencyPipe],
    selector: 'vn-bb-bonus-balance',
    templateUrl: 'bonus-balance-layout.html',
})
export class BonusBalanceLayoutComponent extends BalanceBreakdownItemBase implements OnInit {
    balance: Observable<number>;

    constructor(private dslService: DslService) {
        super();
    }

    ngOnInit() {
        this.balance = this.dslService.evaluateExpression<number>(this.item.parameters['formula']!);
    }
}
