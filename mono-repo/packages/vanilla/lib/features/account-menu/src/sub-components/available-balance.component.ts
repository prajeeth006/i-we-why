import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ArithmeticService, BalanceProperties, CurrencyPipe, DslService, IntlService } from '@frontend/vanilla/core';
import { BalancePropertiesService, BalanceType } from '@frontend/vanilla/features/balance-properties';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';
import { NgxFloatUiModule } from 'ngx-float-ui';
import { Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../account-menu-item-base';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, PopperContentComponent, NgxFloatUiModule, CurrencyPipe, IconCustomComponent],
    selector: 'vn-am-available-balance',
    templateUrl: 'available-balance.html',
})
export class AvailableBalanceComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    payPalBalanceMessage: string | undefined;
    showPayPalBalanceMessage: boolean;
    balance: number;
    releaseFundsTooltipText: string | undefined;
    releaseFundsText: string | undefined;
    showReleaseFunds: boolean;
    payPalBalance: number;

    private unsubscribe = new Subject<void>();

    constructor(
        private balancePropertiesService: BalancePropertiesService,
        private menuContent: AccountMenuConfig,
        private arithmeticService: ArithmeticService,
        private intlService: IntlService,
        private dslService: DslService,
    ) {
        super();
    }

    ngOnInit() {
        const payPalMessageRef = this.item.parameters['paypal-text-ref'];
        const releaseFundsTooltipTextRef = this.item.parameters['tooltip-text-ref'];
        const formula = this.item.parameters.formula;

        this.balancePropertiesService.balanceProperties.pipe(filter(Boolean), takeUntil(this.unsubscribe)).subscribe((balance: BalanceProperties) => {
            if (formula) {
                if (this.version > 1) {
                    this.dslService.evaluateExpression<number>(formula).subscribe((result: number) => {
                        this.balance = result;
                    });
                } else {
                    this.balance = this.arithmeticService.solve(formula, balance);
                }
            }

            if (payPalMessageRef && balance.payPalBalance && balance.payPalBalance !== 0) {
                this.payPalBalance = balance.payPalBalance;
                this.payPalBalanceMessage = this.menuContent.resources.messages[payPalMessageRef]?.replace(
                    '__AMOUNT__',
                    this.intlService.formatCurrency(balance.payPalBalance),
                );
            }
        });

        combineLatest([
            this.dslService.evaluateExpression<boolean>(this.menuContent.account.isPaypalBalanceMessageEnabled),
            this.dslService.evaluateExpression<boolean>(this.menuContent.account.isPaypalReleaseFundsEnabled),
        ]).subscribe(([messageEnabled, releaseFundsEnabled]) => {
            this.showPayPalBalanceMessage = messageEnabled && !!this.payPalBalanceMessage;
            this.showReleaseFunds = releaseFundsEnabled;

            if (this.showReleaseFunds) {
                this.releaseFundsText = this.menuContent.resources.messages.ReleaseFunds;

                if (releaseFundsTooltipTextRef) {
                    this.releaseFundsTooltipText = this.menuContent.resources.messages[releaseFundsTooltipTextRef];
                }
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    releaseFunds() {
        this.balancePropertiesService
            .transfer({
                amount: this.payPalBalance,
                fromBalanceType: BalanceType.PayPalBal,
                toBalanceType: BalanceType.MainRealBal,
            })
            .subscribe(() => {
                this.payPalBalanceMessage = this.menuContent.resources.messages.ReleaseFundsConfirmation;
                this.showReleaseFunds = false;
                this.balancePropertiesService.refresh();
            });
    }
}
