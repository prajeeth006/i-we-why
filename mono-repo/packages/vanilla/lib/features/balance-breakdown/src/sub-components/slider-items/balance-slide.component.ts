import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { CurrencyPipe, DslService, IntlService, UtilsService } from '@frontend/vanilla/core';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BalanceBreakdownItemBase } from '../../balance-breakdown-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, CurrencyPipe, ImageComponent],
    selector: 'vn-bb-balance-slide',
    templateUrl: 'balance-slide.html',
    styleUrls: ['../../../../../../../themepark/themes/whitelabel/components/balance-breakdown/bb-balance-slide/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BalanceSlideComponent extends BalanceBreakdownItemBase implements OnInit, OnDestroy {
    balance: number;
    balanceTourneyToken: number;
    currencySymbol: string;
    text: string;
    private unsubscribe = new Subject<void>();

    constructor(
        private dslService: DslService,
        private intlService: IntlService,
        private utils: UtilsService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.dslService
            .evaluateExpression<number>(this.item.parameters['formula']!)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((result) => (this.balance = result));

        this.dslService
            .evaluateExpression<number>(this.item.parameters['formula-tourney-token']!)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((result) => (this.balanceTourneyToken = result));

        this.dslService.evaluateExpression<string>(this.item.parameters['currency']!).subscribe((currencyCode: string) => {
            this.currencySymbol = this.intlService.getCurrencySymbol(currencyCode);
            this.text = this.utils.format(this.item.resources['text-tourney-token']!, this.currencySymbol);
        });
    }

    isNumber(): boolean {
        return typeof this.balanceTourneyToken === 'number';
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
