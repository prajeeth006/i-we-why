import { Injectable } from '@angular/core';

import { DslRecordable, DslRecorderService, DslValueAsyncResolver, DslValueCacheKey, DslValuesProvider, UserService } from '@frontend/vanilla/core';

const BONUS_AWARD_DSL_INVALIDATE_KEY = 'bonusAward.IsBonusAwarded';
@Injectable()
export class BonusAwardDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private user: UserService,
        private dslValueAsyncResolver: DslValueAsyncResolver,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            BonusAward: this.dslRecorderService.createRecordable('bonusAward').createFunction({
                name: 'IsBonusAwarded',
                get: (offerId: string) =>
                    this.user.isAuthenticated
                        ? this.dslValueAsyncResolver.resolve({
                              cacheKey: `${DslValueCacheKey.BONUS_AWARD}.${offerId}`,
                              endpoint: 'bonusaward',
                              invalidateKey: BONUS_AWARD_DSL_INVALIDATE_KEY,
                              requestData: { offerId: offerId },
                              get: (result) => result?.isBonusAwarded,
                          })
                        : false,
                deps: [BONUS_AWARD_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
            }),
        };
    }
}
