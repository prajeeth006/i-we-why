import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrencyPipe, DynamicComponentDirective, TrackingService } from '@frontend/vanilla/core';
import { isNumber, toNumber } from 'lodash-es';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuResourceService } from '../../account-menu-resource.service';
import { ProfitLoss, ProfitLossModel } from '../../account-menu.models';
import { AccountMenuWidgetComponent } from './widget.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent, CurrencyPipe, DynamicComponentDirective],
    selector: 'vn-am-profit-loss-widget',
    templateUrl: 'profit-loss-widget.html',
})
export class ProfitLossWidgetComponent extends AccountMenuItemBase implements OnInit {
    model: ProfitLossModel;
    profitLossData: ProfitLoss;
    errorText: string;
    hideSkeleton: boolean = false;

    constructor(
        private accountMenuResourceService: AccountMenuResourceService,
        private trackingService: TrackingService,
    ) {
        super();
    }

    ngOnInit() {
        this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');

        const range = toNumber(this.item.parameters['range-in-days']);

        if (range && isNumber(range)) {
            this.accountMenuResourceService.getProfitLoss(range).subscribe({
                next: (d: ProfitLoss) => {
                    this.profitLossData = {
                        totalReturn: d.totalReturn,
                        totalStake: d.totalStake,
                        weeklyAverage: d.weeklyAverage,
                        monthlyAverage: d.monthlyAverage,
                        yearlyAverage: d.yearlyAverage,
                    };
                    const balance = d.totalReturn - d.totalStake;
                    this.model = {
                        rangeText: this.item.resources['RangeText']?.replace('_RANGE_', range.toString()) || '',
                        totalReturn: d.totalReturn,
                        totalStake: d.totalStake,
                        balance: Math.abs(balance),
                        arrowClass: balance > 0 ? 'arrow-value--up' : balance < 0 ? 'arrow-value--down' : null,
                    };
                    this.hideSkeleton = true;
                },
                error: () => {
                    this.hideSkeleton = true;
                    this.errorText = this.item.resources['ErrorText']!;
                },
            });
        }
    }
}
