import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { CurrencyPipe, DynamicHtmlDirective, IntlService, TrackingService, UserService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { toNumber } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuResourceService } from '../../account-menu-resource.service';
import { AccountMenuTrackingService } from '../../account-menu-tracking.service';
import { LimitType, LossLimit, LossLimitModel } from '../../account-menu.models';
import { AccountMenuWidgetComponent } from './widget.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent, DynamicHtmlDirective, TrustAsHtmlPipe, CurrencyPipe, IconCustomComponent],
    selector: 'vn-am-loss-limit-widget',
    templateUrl: 'loss-limit-widget.html',
})
export class LossLimitWidgetComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    model: LossLimitModel;
    hideSkeleton: boolean = false;

    private limitType: LimitType;
    private triggerReorderPercentage: number;
    private isFirstNotification: boolean = true;
    private unsubscribe: Subject<void> = new Subject();

    constructor(
        private accountMenuResourceService: AccountMenuResourceService,
        private intlService: IntlService,
        private accountMenuDataService: AccountMenuDataService,
        private accountMenuTrackingService: AccountMenuTrackingService,
        private trackingService: TrackingService,
        private userService: UserService,
    ) {
        super();
    }

    ngOnInit() {
        // There is a chance for this init after logout if no redirect
        if (!this.userService.isAuthenticated) {
            return;
        }

        this.triggerReorderPercentage = toNumber(this.item.parameters['trigger-reorder-percentage']);
        this.accountMenuResourceService
            .getLossLimit()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((d: LossLimit) => {
                const isDepositHigherThanWithdrawal = d.totalNetDeposit >= 0;
                const totalNetDeposit = Math.abs(d.totalNetDeposit);
                const percentageElapsed = isDepositHigherThanWithdrawal ? (Math.abs(d.totalNetDeposit) / d.totalLossLimit) * 100 : 0;
                const remainingDeposit = d.totalLossLimit - d.totalNetDeposit;
                const totalLossLimitWithCurrency = this.intlService.formatCurrency(d.totalLossLimit);
                const totalNetDepositWithCurrency = this.intlService.formatCurrency(isDepositHigherThanWithdrawal ? totalNetDeposit : 0);
                const limitText = this.item.resources.LimitText?.replace('_GLOBAL_LOSS_LIMIT_', totalNetDepositWithCurrency).replace(
                    '_TOTAL_LOSS_LIMIT_',
                    totalLossLimitWithCurrency,
                );

                /* if percentage is met and widget is not already reorder */
                if (percentageElapsed >= this.triggerReorderPercentage && toNumber(this.item.parameters['order']) > 1) {
                    const order = 1;
                    this.item.parameters['order'] = order.toString();
                    this.accountMenuDataService.refreshWidgets();
                }

                if (this.limitType !== d.limitType) {
                    this.limitType = d.limitType;
                    this.item.text = this.item.resources[`${this.limitType}Title`]?.replace('_TOTAL_LOSS_LIMIT_', totalLossLimitWithCurrency) || '';
                }

                const placeholders = {
                    'component.PositionEvent': d.totalNetDeposit > 0 ? 'negative value' : d.totalNetDeposit < 0 ? 'positive value' : 'zero value',
                };
                this.accountMenuTrackingService.replacePlaceholders(this.item, placeholders);

                if (this.isFirstNotification) {
                    this.isFirstNotification = false;
                    this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
                }

                this.model = {
                    totalLossLimit: d.totalLossLimit,
                    totalNetDeposit,
                    arrowClass: d.totalNetDeposit > 0 ? 'arrow-value--down' : d.totalNetDeposit < 0 ? 'arrow-value--up' : null,
                    percentageElapsed,
                    limitText: limitText || '',
                    remainingDeposit,
                    description: this.item.resources[`${this.limitType}Description`]!,
                    limitReachedText: remainingDeposit <= 0 ? this.item.resources[`${this.limitType}LimitReachedText`]! : '',
                    limitNotReachedText:
                        remainingDeposit > 0
                            ? this.item.resources.LimitNotReachedText?.replace(
                                  '_REMAINNING_DEPOSIT_',
                                  this.intlService.formatCurrency(remainingDeposit),
                              ) || ''
                            : '',
                };
                this.hideSkeleton = true;
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
