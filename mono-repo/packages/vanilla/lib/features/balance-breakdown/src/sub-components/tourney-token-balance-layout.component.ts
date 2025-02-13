import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DslService, IntlService, UtilsService, toBoolean } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';
import { BalanceBreakdownContent } from '../balance-breakdown.client-config';

@Component({
    standalone: true,
    imports: [CommonModule, IconCustomComponent],
    selector: 'vn-tourneytoken-balance',
    templateUrl: 'tourney-token-balance-layout.html',
})
export class TourneyTokenBalanceLayoutComponent extends BalanceBreakdownItemBase implements OnInit, OnDestroy {
    balance: any;
    text: string;
    hideIfZero: boolean;
    hideDetailsIfZero: boolean;
    currencySymbol: string;

    private unsubscribe = new Subject<void>();

    constructor(
        public balanceContent: BalanceBreakdownContent,
        private dslService: DslService,
        private intlService: IntlService,
        private utils: UtilsService,
    ) {
        super();
    }

    ngOnInit() {
        if (this.item.parameters.currency) {
            this.dslService.evaluateExpression<number>(this.item.parameters.currency).subscribe((currencyCode: number) => {
                this.currencySymbol = this.intlService.getCurrencySymbol(currencyCode.toString());
                this.text = this.utils.format(this.item.text, this.currencySymbol);
            });
        }

        if (this.item.parameters.formula) {
            this.dslService
                .evaluateExpression<number>(this.item.parameters.formula)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe((result: number) => (this.balance = result));
        }

        this.hideIfZero = !!toBoolean(this.item.parameters['hide-if-zero']);
        this.hideDetailsIfZero = !!toBoolean(this.item.parameters['hide-details-if-zero']);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
