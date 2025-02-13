import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { BonusBalance, BonusBalanceResponse } from './bonus-balance.models';
import { BonusBalanceService } from './bonus-balance.service';

@Injectable()
export class BonusBalanceDslValuesProvider implements DslValuesProvider {
    private bonusBalance: BonusBalance | null = null;
    private bonusBalanceV4: BonusBalanceResponse | null = null;
    private refreshed: boolean = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private bonusBalanceService: BonusBalanceService,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.bonusBalanceService.bonusBalance.subscribe((b) => {
            this.bonusBalance = b;
            this.refreshed = true;

            dslCacheService.invalidate(['bonusBalance.Get']);
        });

        this.bonusBalanceService.bonusBalanceV4.subscribe((b) => {
            this.bonusBalanceV4 = b;
            this.refreshed = true;

            dslCacheService.invalidate(['bonusBalance.GetBonusByType']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            BonusBalance: this.dslRecorderService
                .createRecordable('bonusBalance')
                .createFunction({
                    name: 'Get',
                    get: (product: string) => this.getCurrentValue(() => (this.bonusBalance ? this.bonusBalance[product] || 0 : DSL_NOT_READY)),
                    deps: ['bonusBalance.Get', 'user.isAuthenticated'],
                })
                .createFunction({
                    name: 'GetBonusByType',
                    get: (product: string) => this.getCurrentValue(() => (this.bonusBalanceV4 ? this.getIndividualBonus(product) : DSL_NOT_READY)),
                    deps: ['bonusBalance.GetBonusByType', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'ThirdParty',
                    get: () => (this.user.isAuthenticated ? 0 : -1),
                    deps: ['bonusBalance.ThirdParty', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue(get: () => number): number {
        if (!this.user.isAuthenticated) {
            return -1;
        }

        if (!this.refreshed) {
            this.refreshed = true;
            this.bonusBalanceService.refresh();
        }

        return get();
    }

    private getIndividualBonus(bonusType: string): number {
        let balance: number = 0;

        if (this.bonusBalanceV4) {
            this.bonusBalanceV4[bonusType.toLocaleLowerCase()]?.bonuses.forEach((bonus) => {
                if (bonus.isBonusActive) balance += bonus.bonusAmount;
            });
        }

        return balance;
    }
}
