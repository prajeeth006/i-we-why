import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { flatten, values } from 'lodash-es';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Bonus, BonusBalance, BonusBalanceResponse } from './bonus-balance.models';

/**
 * @whatItDoes Provides functionality to get bonus balance
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class BonusBalanceService {
    private bonusBalanceEvents = new ReplaySubject<BonusBalance>(1);
    private bonusBalanceV4Events = new ReplaySubject<BonusBalanceResponse>(1);
    private bonusBalanceRefreshInProgress: boolean;
    private refreshSubscription: Subscription;

    constructor(
        private apiService: SharedFeaturesApiService,
        private balancePropertiesService: BalancePropertiesService,
    ) {}

    get bonusBalance(): Observable<BonusBalance> {
        return this.bonusBalanceEvents;
    }

    get bonusBalanceV4(): Observable<BonusBalanceResponse> {
        return this.bonusBalanceV4Events;
    }

    refresh() {
        this.refreshBonusBalance();
    }

    private refreshBonusBalance() {
        if (!this.bonusBalanceRefreshInProgress) {
            this.bonusBalanceRefreshInProgress = true;

            this.apiService
                .get('balance/bonus')
                .pipe(
                    map((r: BonusBalanceResponse) => {
                        this.bonusBalanceV4Events.next(r);
                        return this.calculateProductAmounts(flatten(values(r).map((v) => v.bonuses)));
                    }),
                )
                .subscribe((bonusBalance) => {
                    this.bonusBalanceEvents.next(bonusBalance);
                    this.bonusBalanceRefreshInProgress = false;
                    this.startRefreshOnBalanceRefresh();
                });
        }
    }

    private startRefreshOnBalanceRefresh() {
        if (!this.refreshSubscription) {
            this.refreshSubscription = this.balancePropertiesService.balanceProperties
                .pipe(
                    filter(Boolean),
                    filter((b) => b.propagateRefresh),
                )
                .subscribe(() => this.refresh());
        }
    }

    private calculateProductAmounts(bonuses: Bonus[]): BonusBalance {
        return bonuses.reduce(
            (result, bonus) => {
                let postfix: string;

                if (bonus.isBonusActive) {
                    postfix = '';
                } else {
                    postfix = '_inactive';
                }

                bonus.applicableProducts.forEach((p) => (result[p + postfix] = (result[p + postfix] || 0) + bonus.bonusAmount));

                return result;
            },
            <BonusBalance>{},
        );
    }
}
