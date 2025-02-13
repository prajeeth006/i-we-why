import { Injectable, signal } from '@angular/core';

import { BalanceProperties, BalanceSettingsConfig, SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { BalanceTransfer, BalanceUpdate } from './balance-properties.models';

/**
 * @whatItDoes Provides access to users balance and means to refresh it or transfer between types.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class BalancePropertiesService {
    readonly balanceInfo = signal<BalanceProperties | null>(null);

    get balanceProperties(): Observable<BalanceProperties | null> {
        return this.balancePropertiesEvents;
    }

    private readonly balancePropertiesEvents = new BehaviorSubject<BalanceProperties | null>(null);

    constructor(
        private userService: UserService,
        private apiService: SharedFeaturesApiService,
        private balanceSettingsConfig: BalanceSettingsConfig,
    ) {}

    refresh(propagate: boolean = true) {
        if (this.userService.isAuthenticated) {
            this.apiService.get('balance', undefined, { showSpinner: false }).subscribe((response: BalanceUpdate) => {
                this.balanceInfo.set({ ...response.balance, propagateRefresh: propagate });
                this.balancePropertiesEvents.next({ ...response.balance, propagateRefresh: propagate });
            });
        }
    }

    update(balanceProperties: BalanceProperties) {
        this.balanceInfo.set(balanceProperties);
        this.balancePropertiesEvents.next(balanceProperties);
    }

    transfer(data: BalanceTransfer): Observable<any> {
        return this.apiService.post('balance/transfer', data);
    }

    isLow(balance: number): boolean {
        const lowBalanceThreshold =
            this.balanceSettingsConfig.lowThresholds[this.userService.currency] || this.balanceSettingsConfig.lowThresholds['*'];

        if (lowBalanceThreshold == null) {
            return false;
        }

        return balance <= lowBalanceThreshold;
    }
}
