import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { UtilsService } from '@frontend/vanilla/core';
import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs';

import { AccountMenuItemBase } from '../account-menu-item-base';
import { PokerCashback } from '../account-menu.models';

/**
 * NOTE: not used in v2
 */
@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'lh-am-poker-cashback',
    templateUrl: 'poker-cashback.html',
})
export class PokerCashbackComponent extends AccountMenuItemBase implements OnDestroy, OnInit {
    title: string;
    text: string;
    private unsubscribe = new Subject<void>();

    constructor(
        private utils: UtilsService,
        private accountMenuConfig: AccountMenuConfig,
    ) {
        super();
    }

    ngOnInit() {
        this.title = this.accountMenuService.resources.messages['PokerCashbackTitle']!;
        this.accountMenuService.pokerCashbackEvents
            .pipe(
                filter((d): d is PokerCashback => d != null),
                takeUntil(this.unsubscribe),
            )
            .subscribe((d) => {
                if (d.hasOptedIn) {
                    const tournamentCurrencySymbol =
                        this.accountMenuConfig.account.pokerCashbackTournamentAwardTypes.indexOf(d.awardType) === -1
                            ? d.currency
                            : `${this.accountMenuConfig.account.tournamentPokerCashbackSymbol}${d.currency}`;
                    this.text = this.utils.format(
                        this.accountMenuService.resources.messages['PokerCashbackOptedIn']!,
                        d.weeklyPoints,
                        d.pointsRequiredForNextSlab,
                        tournamentCurrencySymbol,
                        d.targetCashback,
                    );
                } else {
                    this.text = this.accountMenuService.resources.messages['PokerCashbackNotOptedIn']!;
                }
            });
        this.accountMenuService.updatePokerCashback();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
