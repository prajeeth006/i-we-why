import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DslService, IntlService, UtilsService, toBoolean } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-am-tourneytoken-balance',
    templateUrl: 'tourney-token-balance-layout.html',
})
export class TourneyTokenBalanceLayoutComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    balance: any;
    text: string;
    hideIfZero: boolean;
    currencySymbol: string;

    private unsubscribe = new Subject<void>();

    constructor(
        private dslService: DslService,
        private intlService: IntlService,
        private utils: UtilsService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.dslService.evaluateExpression<number>(this.item.parameters['currency']!).subscribe((currencyCode: any) => {
            this.currencySymbol = this.intlService.getCurrencySymbol(currencyCode);
            this.text = this.utils.format(this.item.text, this.currencySymbol);
        });

        this.hideIfZero = !!toBoolean(this.item.parameters['hide-if-zero']);
        this.dslService
            .evaluateExpression<number>(this.item.parameters['formula']!)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((result) => (this.balance = result));
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
