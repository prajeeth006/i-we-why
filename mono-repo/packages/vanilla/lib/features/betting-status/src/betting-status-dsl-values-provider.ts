import { Injectable, inject } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';
import { BettingStatus, BettingStatusService } from '@frontend/vanilla/shared/betting-status';

@Injectable()
export class BettingStatusDslValuesProvider implements DslValuesProvider {
    private dslRecorderService = inject(DslRecorderService);
    private bettingStatusService = inject(BettingStatusService);
    private user = inject(UserService);
    private dslCacheService = inject(DslCacheService);

    private bettingStatus: BettingStatus | null = null;
    private loaded: boolean;

    constructor() {
        this.bettingStatusService.bettingStatus.subscribe((bettingStatus: BettingStatus | null) => {
            if (bettingStatus) {
                this.bettingStatus = bettingStatus;
                this.dslCacheService.invalidate(['bettingStatus']);
                this.loaded = true;
            }
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            BettingStatus: this.dslRecorderService.createRecordable('bettingStatus').createProperty({
                name: 'UserHasBets',
                get: () =>
                    this.getCurrentValue<boolean>(() => {
                        return this.bettingStatus?.hasBets ?? DSL_NOT_READY;
                    }),
                deps: ['bettingStatus', 'user.isAuthenticated'],
            }),
        };
    }

    private getCurrentValue<T>(get: () => T, defaultValue = false) {
        if (!this.user.isAuthenticated) {
            return defaultValue;
        }

        if (!this.loaded) {
            this.loaded = true;
            this.bettingStatusService.refresh(true);
        }

        return get();
    }
}
