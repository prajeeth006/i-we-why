import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DynamicComponentDirective } from '@frontend/vanilla/core';
import { BonusBalanceService } from '@frontend/vanilla/features/bonus-balance';
import { Subject } from 'rxjs';

import { AccountMenuItemBase } from '../account-menu-item-base';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-am-bonus-balance',
    templateUrl: 'bonus-balance.html',
})
export class BonusBalanceComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    private unsubscribe = new Subject();

    constructor(private bonusBalanceService: BonusBalanceService) {
        super();
    }

    ngOnInit() {
        this.bonusBalanceService.refresh();
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }
}
