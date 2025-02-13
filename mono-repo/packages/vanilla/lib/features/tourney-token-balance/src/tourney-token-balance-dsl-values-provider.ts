import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { TourneyTokenBalance } from './tourney-token-balance.models';
import { TourneyTokenBalanceService } from './tourney-token-balance.service';

@Injectable()
export class TourneyTokenBalanceDslValuesProvider implements DslValuesProvider {
    private tourneyTokenBalance: TourneyTokenBalance | null = null;
    private loaded: boolean = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private tourneyTokenBalanceService: TourneyTokenBalanceService,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.tourneyTokenBalanceService.tourneyTokenBalance.subscribe((info: TourneyTokenBalance | null) => {
            this.tourneyTokenBalance = info;
            this.loaded = true;
            dslCacheService.invalidate(['tourneyTokenBalance']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            TourneyTokenBalance: this.dslRecorderService
                .createRecordable('tourneyTokenBalance')
                .createProperty({
                    name: 'Balance',
                    get: () =>
                        this.getCurrentValue<number>(() => {
                            return this.tourneyTokenBalance ? this.tourneyTokenBalance.tourneyTokenBalance : DSL_NOT_READY;
                        }, -1),
                    deps: ['tourneyTokenBalance', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Currency',
                    get: () =>
                        this.getCurrentValue<string>(() => {
                            return this.tourneyTokenBalance ? this.tourneyTokenBalance.tourneyTokenCurrencyCode : DSL_NOT_READY;
                        }, ''),
                    deps: ['tourneyTokenBalance', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue<T>(get: () => T, defaultValue: T) {
        if (!this.user.isAuthenticated) {
            return defaultValue;
        }

        if (!this.loaded) {
            this.loaded = true;
            this.tourneyTokenBalanceService.load();
        }

        return get();
    }
}
