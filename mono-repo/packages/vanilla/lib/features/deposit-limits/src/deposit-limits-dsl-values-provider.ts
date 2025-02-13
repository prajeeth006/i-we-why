import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';
import { DepositLimit, DepositLimitsService } from '@frontend/vanilla/shared/limits';

import { DepositLimitsConfig } from './deposit-limits.client-config';

@Injectable()
export class DepositLimitsDslValuesProvider implements DslValuesProvider {
    private limits: DepositLimit[];
    private loaded: boolean = false;
    private limitDefaultValue: number = -1;

    constructor(
        private dslRecorderService: DslRecorderService,
        private depositLimitsService: DepositLimitsService,
        private depositLimitConfig: DepositLimitsConfig,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.depositLimitsService.limits.subscribe((limits: DepositLimit[]) => {
            this.limits = limits;
            this.loaded = true;
            dslCacheService.invalidate(['depositLimits.Get']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            DepositLimits: this.dslRecorderService
                .createRecordable('depositLimits')
                .createFunction({
                    name: 'Get',
                    get: (limitType: string) =>
                        this.getCurrentValue<number>(() =>
                            this.limits
                                ? this.limits.find((s) => s.limitSet && s.type?.toLowerCase() === limitType?.toLowerCase())?.currentLimit ||
                                  this.limitDefaultValue
                                : DSL_NOT_READY,
                        ),
                    deps: ['depositLimits.Get', 'user.isAuthenticated'],
                })
                .createFunction({
                    name: 'IsLow',
                    get: (limitType: string) => this.isLow(limitType),
                    deps: ['depositLimits.Get', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue<T>(get: () => T) {
        if (!this.user.isAuthenticated) {
            return this.limitDefaultValue;
        }

        this.loadDepositLimits();

        return get();
    }

    private isLow(limitType: string) {
        if (!this.user.isAuthenticated) {
            return false;
        }

        this.loadDepositLimits();

        if (!this.limits) {
            return DSL_NOT_READY;
        }

        limitType = limitType?.toLowerCase();
        const currency = this.user.currency;
        const lowBalanceThresholdLimitType = this.depositLimitConfig.lowThresholds[limitType];

        if (!lowBalanceThresholdLimitType) {
            return false;
        }

        const lowLimitThreshold = lowBalanceThresholdLimitType[currency] || lowBalanceThresholdLimitType['*'];

        if (lowLimitThreshold == null) {
            return false;
        }

        const limit = this.limits.find((s) => s.limitSet && s.type?.toLowerCase() === limitType)?.currentLimit;

        // return false if limit is not set
        if (!limit) {
            return false;
        }

        return limit <= lowLimitThreshold;
    }

    private loadDepositLimits() {
        if (!this.loaded) {
            this.loaded = true;
            this.depositLimitsService.load();
        }
    }
}
