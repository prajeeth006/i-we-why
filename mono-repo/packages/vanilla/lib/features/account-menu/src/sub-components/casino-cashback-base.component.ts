import { Directive, OnDestroy, OnInit, inject } from '@angular/core';

import { IntlService, TrackingService } from '@frontend/vanilla/core';
import { filter, takeUntil } from 'rxjs';

import { AccountMenuTrackingService } from '../account-menu-tracking.service';
import { LoyaltyCashback } from '../account-menu.models';
import { CashbackBaseComponent } from './cashback-base.component';

@Directive()
export abstract class CasinoCashbackBaseComponent extends CashbackBaseComponent implements OnInit, OnDestroy {
    private intlService = inject(IntlService);
    private accountMenuTrackingService = inject(AccountMenuTrackingService);
    private trackingService = inject(TrackingService);

    constructor() {
        super();
    }

    override ngOnInit() {
        this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
        this.accountMenuService.loyaltyCashbackEvents
            .pipe(
                filter((d): d is LoyaltyCashback => d != null),
                takeUntil(this.unsubscribe),
            )
            .subscribe((data) => {
                let positionEvent = 'no opt-in';
                if (!data.optinStatus) {
                    this.description = this.accountMenuService.resources.messages['CasinoCashbackDescriptionOptin']!;
                    this.descriptionV3 = this.accountMenuService.resources.messages['CasinoCashbackOptedInV3']!;
                } else if (data.cashbackAmount >= 0 && data.cashbackCurrency && data.minEligibleAmount >= 0 && data.minEligibleAmountCurrency) {
                    this.text = data.cashbackAmount.toString();
                    this.chartSegments = [{ percent: Math.min((data.cashbackAmount / data.minEligibleAmount) * 100, 100) }];
                    this.cashbackAmount = this.intlService.formatCurrency(data.cashbackAmount, data.cashbackCurrency);
                    this.minCollection =
                        this.accountMenuService.resources.messages['CashbackMinimumCollection']?.replace(
                            '{MIN_COLLECTION}',
                            this.intlService.formatCurrency(data.minEligibleAmount, data.minEligibleAmountCurrency),
                        ) ?? '';

                    if ((data.minEligibleAmount || 0) > (data.cashbackAmount || 0)) {
                        positionEvent = 'no collectable cash';
                        this.description = this.accountMenuService.resources.messages['CasinoCashbackDescriptionMinimum']!.replace(
                            '{MINIMUM_CASHBACK_AMOUNT}',
                            this.intlService.formatCurrency(data.minEligibleAmount, data.minEligibleAmountCurrency),
                        );
                        this.left =
                            this.accountMenuService.resources.messages['CashbackLeft']?.replace(
                                '{LEFT}',
                                this.intlService.formatCurrency(data.minEligibleAmount - data.cashbackAmount, data.minEligibleAmountCurrency),
                            ) ?? '';
                    } else {
                        this.isCompleted = true;
                        this.description = this.accountMenuService.resources.messages['CasinoCashbackDescriptionAvailable']!;
                        positionEvent = 'collectable cash';
                    }
                }
                const placeholders = { 'component.PositionEvent': positionEvent };
                this.accountMenuTrackingService.replacePlaceholders(this.item, placeholders);
                if (this.isFirstNotification) {
                    this.isFirstNotification = false;
                    this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
                }
                this.hideSkeleton = true;
            });
        this.accountMenuService.updateLoyaltyCashback();
    }
}
