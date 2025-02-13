import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';
import { PlayerLimit, PlayerLimitsService } from '@frontend/vanilla/shared/limits';

@Injectable()
export class PlayerLimitsDslValuesProvider implements DslValuesProvider {
    private static AnonymousValue = -1;
    private limits: PlayerLimit[] | null;

    constructor(
        readonly dslCacheService: DslCacheService,
        private readonly dslRecorderService: DslRecorderService,
        private readonly userService: UserService,
        private readonly playerLimitsService: PlayerLimitsService,
    ) {
        this.playerLimitsService.getLimits().subscribe((limits: PlayerLimit[] | null) => {
            this.limits = limits;
            dslCacheService.invalidate(['playerLimits']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService.createRecordable('playerLimits');

        recordable.createFunction({
            name: 'GetPlayerLimitsSum',
            get: (limitTypes: string[]) => {
                if (!this.userService.isAuthenticated) {
                    return PlayerLimitsDslValuesProvider.AnonymousValue;
                }

                if (!this.limits) {
                    return DSL_NOT_READY;
                }

                return this.limits
                    .filter((limit) => limitTypes.includes(limit.limitType))
                    .map((limit) => limit.currentLimit)
                    .reduce((previous, current) => previous + current, 0);
            },
            deps: ['playerLimits', 'user.isAuthenticated'],
        });

        return { PlayerLimits: recordable };
    }
}
