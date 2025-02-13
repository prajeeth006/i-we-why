import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CurrencyPipe, DslService, toBoolean } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { NgxFloatUiModule } from 'ngx-float-ui';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BalanceBreakdownItemBase } from '../balance-breakdown-item-base';
import { BalanceBreakdownTrackingService } from '../balance-breakdown-tracking.service';
import { BalanceBreakdownContent } from '../balance-breakdown.client-config';

@Component({
    standalone: true,
    imports: [CommonModule, PopperContentComponent, NgxFloatUiModule, CurrencyPipe, IconCustomComponent],
    selector: 'vn-bb-balance',
    templateUrl: 'balance-layout.html',
})
export class BalanceLayoutComponent extends BalanceBreakdownItemBase implements OnInit, OnDestroy {
    hideIfZero: boolean;
    hideDetailsIfZero: boolean;
    balance: number;
    skipProductTracking: boolean;
    tooltipText: string | undefined;
    private unsubscribe = new Subject<void>();

    constructor(
        public balanceContent: BalanceBreakdownContent,
        private dslService: DslService,
        private balanceTrackingService: BalanceBreakdownTrackingService,
    ) {
        super();
    }

    ngOnInit() {
        this.hideDetailsIfZero = !!toBoolean(this.item.parameters['hide-details-if-zero']);
        this.hideIfZero = !!toBoolean(this.item.parameters['hide-if-zero']);
        this.skipProductTracking = !!toBoolean(this.item.parameters['skip-product-tracking']);

        if (this.item.parameters.formula) {
            this.dslService
                .evaluateExpression<number>(this.item.parameters.formula)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe((result: number) => (this.balance = result));
        }
        this.tooltipText = this.item.resources.TooltipText;
        this.balanceTrackingService.trackBalanceItemLoad(this.item.text);
    }

    trackTooltip() {
        this.balanceTrackingService.trackInfoClick(
            this.item.name,
            'information icon',
            this.skipProductTracking ? 'not applicable' : this.balanceBreakdownService.slide()?.name,
        );
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
