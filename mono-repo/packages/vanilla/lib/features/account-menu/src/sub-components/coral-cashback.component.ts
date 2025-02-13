import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { IntlService } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { AccountMenuVipService } from '../account-menu-vip.service';
import { CoralCashback } from '../account-menu.models';
import { CoralCashbackLevelComponent } from './coral-cashback-level.component';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, CoralCashbackLevelComponent, TrustAsHtmlPipe],
    selector: 'lh-am-coral-cashback',
    templateUrl: 'coral-cashback.html',
})
export class CoralCashbackComponent extends AccountMenuItemBase implements OnDestroy, OnInit {
    model: any;
    nonVipMessage: string;
    private unsubscribe = new Subject<void>();

    constructor(
        private intlService: IntlService,
        private accountMenuVipService: AccountMenuVipService,
    ) {
        super();
    }

    ngOnInit() {
        if (this.accountMenuVipService.ignoreVipLevel || this.accountMenuVipService.isVip) {
            this.accountMenuService.coralCashbackEvents
                .pipe(
                    filter((d): d is CoralCashback => d != null),
                    takeUntil(this.unsubscribe),
                )
                .subscribe((data) => {
                    this.model = {
                        title: this.accountMenuService.resources.messages['CoralCashbackTitle'],
                        currentPoints: this.accountMenuService.resources.messages['CoralCashbackCurrentPoints']!.replace(
                            '{POINTS}',
                            data.currentPoints.toString(),
                        ),
                        cashValue: this.accountMenuService.resources.messages['CoralCashbackCashValue']!.replace(
                            '{AMOUNT}',
                            this.intlService.formatCurrency(data.cashbackAmount / 100, data.cashbackCurrency),
                        ),
                        minRequiredPointsForRedeem: this.accountMenuService.resources.messages['CoralCashbackMinRequiredPoints']!.replace(
                            '{MIN_POINTS}',
                            data.minPointsReqForRedeem.toString(),
                        ),
                    };
                });
            this.accountMenuService.updateCoralCashback();
        } else {
            this.nonVipMessage = this.accountMenuService.resources.messages['CoralCashbackNonVipMessage']!;
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
