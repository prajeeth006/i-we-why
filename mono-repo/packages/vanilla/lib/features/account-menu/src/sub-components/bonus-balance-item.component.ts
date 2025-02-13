import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ArithmeticService, CurrencyPipe } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { BonusBalanceService } from '@frontend/vanilla/features/bonus-balance';
import { capitalize, mapKeys } from 'lodash-es';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../account-menu-item-base';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, CurrencyPipe],
    selector: 'vn-am-bonus-balance-item',
    templateUrl: 'bonus-balance-item.html',
})
export class BonusBalanceItemComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    balance: number | null = null;

    private unsubscribe = new Subject<void>();

    constructor(
        private bonusBalanceService: BonusBalanceService,
        private balancePropertiesService: BalancePropertiesService,
        private arithmeticService: ArithmeticService,
    ) {
        super();
    }

    ngOnInit() {
        const formula = this.item.parameters['formula'];

        combineLatest([this.balancePropertiesService.balanceProperties, this.bonusBalanceService.bonusBalance])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(([balance, bonusBalance]) => {
                const context = Object.assign(
                    {},
                    balance,
                    mapKeys(bonusBalance, (_, k: string) => `bonus${capitalize(k)}RestrictedBalance`),
                );

                if (formula) {
                    this.balance = this.arithmeticService.solve(formula, context);
                }
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
