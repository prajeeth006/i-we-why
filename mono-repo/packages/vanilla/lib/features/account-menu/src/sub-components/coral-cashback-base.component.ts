import { Directive, OnDestroy, OnInit, inject } from '@angular/core';

import { IntlService } from '@frontend/vanilla/core';
import { filter, takeUntil } from 'rxjs';

import { AccountMenuVipService } from '../account-menu-vip.service';
import { CoralCashback } from '../account-menu.models';
import { CashbackBaseComponent } from './cashback-base.component';

@Directive()
export abstract class CoralCashbackBaseComponent extends CashbackBaseComponent implements OnInit, OnDestroy {
    private accountMenuVipService = inject(AccountMenuVipService);
    private intlService = inject(IntlService);

    constructor() {
        super();
    }

    override ngOnInit() {
        this.ignoreVipLevel = this.accountMenuVipService.ignoreVipLevel;

        if (this.ignoreVipLevel || this.accountMenuVipService.isVip) {
            this.accountMenuService.coralCashbackEvents
                .pipe(
                    filter((d): d is CoralCashback => d != null),
                    takeUntil(this.unsubscribe),
                )
                .subscribe((data) => {
                    if (!data.optinStatus) {
                        this.setDescription();
                    } else {
                        const completion = data.currentPoints / data.minPointsReqForRedeem;
                        const points = (data.minPointsReqForRedeem - data.currentPoints).toString();
                        this.cashbackAmount = this.intlService.formatCurrency(data.cashbackAmount / 100, data.cashbackCurrency);
                        this.isCompleted = completion >= 1;
                        this.chartSegments = [{ percent: completion * 100 }];
                        this.text = this.ignoreVipLevel
                            ? this.accountMenuService.resources.messages['CoralCashbackCurrentPoints']?.replace(
                                  '{POINTS}',
                                  data.currentPoints.toString(),
                              ) || ''
                            : data.currentPoints.toString();
                        this.description = this.accountMenuService.resources.messages['CoralCashbackText']!.replace('{POINTS}', points).replace(
                            '{AMOUNT}',
                            this.cashbackAmount,
                        );
                        this.descriptionV3 = this.accountMenuService.resources.messages['CoralCashbackTextV3']!.replace('{POINTS}', points).replace(
                            '{AMOUNT}',
                            this.cashbackAmount,
                        );

                        // Used when ignoreVipLevel in account menu V2
                        this.availablePointsTitle = this.accountMenuService.resources.messages['CoralCashbackAvailablePoints']!;
                        this.cashValueTitle = this.accountMenuService.resources.messages['CoralCashbackValue']!;
                    }
                    this.hideSkeleton = true;
                });
            this.accountMenuService.updateCoralCashback();
        } else {
            this.setDescription();
        }
    }

    private setDescription() {
        this.description = this.accountMenuService.resources.messages['CoralCashbackNonVipMessage']!;
        this.descriptionV3 = this.accountMenuService.resources.messages['CoralCashbackNonVipMessageV3']!;
    }
}
