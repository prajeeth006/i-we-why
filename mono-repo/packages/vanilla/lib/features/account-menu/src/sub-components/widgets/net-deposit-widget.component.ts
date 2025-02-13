import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CurrencyPipe, DynamicComponentDirective, DynamicHtmlDirective, TrackingService, toBoolean } from '@frontend/vanilla/core';
import { isNumber, toNumber } from 'lodash-es';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuResourceService } from '../../account-menu-resource.service';
import { NetDeposit, NetDepositModel } from '../../account-menu.models';
import { AccountMenuWidgetComponent } from './widget.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent, DynamicHtmlDirective, CurrencyPipe, DynamicComponentDirective],
    selector: 'vn-am-net-deposit-widget',
    templateUrl: 'net-deposit-widget.html',
})
export class NetDepositWidgetComponent extends AccountMenuItemBase implements OnInit {
    model: NetDepositModel;
    showFooterText: boolean;
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
        const level = this.item.parameters.level;
        this.showFooterText = !!toBoolean(this.item.parameters['show-footer-text']);

        if (level && range && isNumber(range)) {
            this.model = {
                rangeText: this.item.resources.RangeText?.replace('_RANGE_', range.toString()) || '',
            };
            this.accountMenuResourceService.getNetDeposit(level, range).subscribe((d: NetDeposit) => {
                this.model.totalDeposit = d.netDeposit;
                this.model.totalWithdrawals = d.netWithdrawal;
                this.model.balance = Math.abs(d.netLoss);
                this.model.arrowClass = d.netLoss > 0 ? 'arrow-value--down' : d.netLoss < 0 ? 'arrow-value--up' : null;
                this.hideSkeleton = true;
            });
        }
    }
}
