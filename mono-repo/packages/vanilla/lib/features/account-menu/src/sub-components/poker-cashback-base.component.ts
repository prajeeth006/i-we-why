import { Directive, OnDestroy, OnInit, inject } from '@angular/core';

import { TrackingService, UtilsService } from '@frontend/vanilla/core';
import { AccountMenuConfig } from '@frontend/vanilla/shared/account-menu';
import { filter, takeUntil } from 'rxjs';

import { AccountMenuTrackingService } from '../account-menu-tracking.service';
import { PokerCashback } from '../account-menu.models';
import { CashbackBaseComponent } from './cashback-base.component';

@Directive()
export abstract class PokerCashbackBaseComponent extends CashbackBaseComponent implements OnInit, OnDestroy {
    private utilsService = inject(UtilsService);
    private accountMenuTrackingService = inject(AccountMenuTrackingService);
    private accountMenuConfig = inject(AccountMenuConfig);
    private trackingService = inject(TrackingService);

    constructor() {
        super();
    }

    override ngOnInit() {
        this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
        this.accountMenuService.pokerCashbackEvents
            .pipe(
                filter((d): d is PokerCashback => d != null),
                takeUntil(this.unsubscribe),
            )
            .subscribe((d) => {
                let positionEvent = 'no opt-in';
                if (d.hasOptedIn) {
                    positionEvent = 'more points needed';
                    const completion = d.weeklyPoints / d.nextSlabPoints;
                    const isTournamentAward = this.accountMenuConfig.account.pokerCashbackTournamentAwardTypes.indexOf(d.awardType) !== -1;
                    const tournamentCurrencySymbolV2 = isTournamentAward
                        ? `${this.accountMenuConfig.account.tournamentPokerCashbackSymbol}${d.currency}`
                        : d.currency;
                    const tournamentCurrencySymbolV3 = isTournamentAward
                        ? `${this.accountMenuConfig.account.tournamentPokerCashbackSymbol}${d.currency}${d.targetCashback}`
                        : `${d.currency}${d.targetCashback}`;
                    this.isCompleted = completion >= 1;
                    this.chartSegments = [{ percent: Math.min(completion * 100, 100) }];
                    this.text = d.weeklyPoints.toString();
                    this.description = this.utilsService.format(
                        this.accountMenuService.resources.messages['PokerCashbackOptedIn']!,
                        d.weeklyPoints,
                        d.pointsRequiredForNextSlab,
                        tournamentCurrencySymbolV2,
                        d.targetCashback,
                    );
                    this.descriptionV3 = this.utilsService.format(
                        this.accountMenuService.resources.messages['PokerCashbackOptedInV3']!,
                        d.weeklyPoints,
                        d.pointsRequiredForNextSlab,
                        tournamentCurrencySymbolV3,
                    );
                } else {
                    this.description = this.accountMenuService.resources.messages['PokerCashbackNotOptedIn']!;
                    this.descriptionV3 = this.accountMenuService.resources.messages['PokerCashbackNotOptedInV3']!;
                }
                const placeholders = { 'component.PositionEvent': positionEvent };
                this.accountMenuTrackingService.replacePlaceholders(this.item, placeholders);
                if (this.isFirstNotification) {
                    this.isFirstNotification = false;
                    this.trackingService.trackContentItemEvent(this.item.trackEvent, 'LoadedEvent');
                }
                this.hideSkeleton = true;
            });
        this.accountMenuService.updatePokerCashback();
    }
}
