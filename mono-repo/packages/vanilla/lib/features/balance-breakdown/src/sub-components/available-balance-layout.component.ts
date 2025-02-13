import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { BalanceProperties, CurrencyPipe, DslService, IntlService } from '@frontend/vanilla/core';
import { BalancePropertiesService, BalanceType } from '@frontend/vanilla/features/balance-properties';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { NgxFloatUiModule } from 'ngx-float-ui';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';
import { BalanceBreakdownContent } from '../balance-breakdown.client-config';

@Component({
    standalone: true,
    imports: [CommonModule, PopperContentComponent, NgxFloatUiModule, CurrencyPipe, IconCustomComponent],
    selector: 'vn-bb-available-balance',
    templateUrl: 'available-balance-layout.html',
})
export class AvailableBalanceLayoutComponent extends BalanceBreakdownItemBase implements OnInit, OnDestroy {
    payPalBalanceMessage: string | undefined;
    showPayPalBalanceMessage: boolean;
    balance: Observable<number>;
    releaseFundsTooltipText: string | undefined;
    releaseFundsText: string | undefined;
    showReleaseFunds: boolean;
    payPalBalance: number;

    private unsubscribe = new Subject<void>();

    constructor(
        private balancePropertiesService: BalancePropertiesService,
        private balanceContent: BalanceBreakdownContent,
        private intlService: IntlService,
        private dslService: DslService,
    ) {
        super();
    }

    ngOnInit() {
        this.balance = this.dslService.evaluateExpression<number>(this.item.parameters['formula']!);

        this.balancePropertiesService.balanceProperties.pipe(filter(Boolean), takeUntil(this.unsubscribe)).subscribe((balance: BalanceProperties) => {
            if (balance.payPalBalance && balance.payPalBalance !== 0) {
                this.payPalBalance = balance.payPalBalance;
                this.payPalBalanceMessage = this.item.resources.PayPalAmountInfo?.replace(
                    '__AMOUNT__',
                    this.intlService.formatCurrency(balance.payPalBalance),
                );
            }
        });

        combineLatest([
            this.dslService.evaluateExpression<boolean>(this.balanceContent.isPaypalBalanceMessageEnabled),
            this.dslService.evaluateExpression<boolean>(this.balanceContent.isPaypalReleaseFundsEnabled),
        ]).subscribe(([messageEnabled, releaseFundsEnabled]) => {
            this.showPayPalBalanceMessage = messageEnabled && !!this.payPalBalanceMessage;
            this.showReleaseFunds = releaseFundsEnabled;

            if (this.showReleaseFunds) {
                this.releaseFundsText = this.item.resources.ReleaseFunds;
                this.releaseFundsTooltipText = this.item.resources.TooltipText;
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
                this.payPalBalanceMessage = this.item.resources.ReleaseFundsConfirmation;
                this.showReleaseFunds = false;
                this.balancePropertiesService.refresh();
            });
    }
}
