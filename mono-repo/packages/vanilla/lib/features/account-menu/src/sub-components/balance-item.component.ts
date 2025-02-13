import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ArithmeticService, BalanceProperties, CurrencyPipe, DslService, toBoolean } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';
import { NgxFloatUiModule } from 'ngx-float-ui';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../account-menu-item-base';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, PopperContentComponent, NgxFloatUiModule, CurrencyPipe, IconCustomComponent],
    selector: 'vn-am-balance-item',
    templateUrl: 'balance-item.html',
})
export class BalanceItemComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    detailsLinkText: string | undefined;
    tooltipText: string | undefined;
    hideIfZero: boolean;
    hideDetailsIfZero: boolean;
    balance: number;

    private unsubscribe = new Subject<void>();

    constructor(
        private balancePropertiesService: BalancePropertiesService,
        private menuContent: AccountMenuConfig,
        private arithmeticService: ArithmeticService,
        private dslService: DslService,
    ) {
        super();
    }

    ngOnInit() {
        const tooltipTextRef = this.item.parameters['tooltip-text-ref'];
        const detailsTextRef = this.item.parameters['details-text-ref'];
        const formula = this.item.parameters.formula;

        this.hideDetailsIfZero = !!toBoolean(this.item.parameters['hide-details-if-zero']);
        this.hideIfZero = !!toBoolean(this.item.parameters['hide-if-zero']);

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
        });

        if (tooltipTextRef) {
            this.tooltipText = this.menuContent.resources.messages[tooltipTextRef];
        }

        if (detailsTextRef) {
            this.detailsLinkText = this.menuContent.resources.messages[detailsTextRef];
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
