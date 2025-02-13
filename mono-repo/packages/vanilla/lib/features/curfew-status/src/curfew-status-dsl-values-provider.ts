import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { CurfewStatus, CurfewStatusService } from './curfew-status.service';

@Injectable()
export class CurfewStatusDslValuesProvider implements DslValuesProvider {
    private curfewStatus: CurfewStatus | null = null;
    private loaded: boolean = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private curfewStatusService: CurfewStatusService,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.curfewStatusService.curfewStatuses.subscribe((curfewStatus) => {
            this.curfewStatus = curfewStatus;
            this.loaded = true;
            dslCacheService.invalidate(['curfewStatus']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            CurfewStatus: this.dslRecorderService.createRecordable('curfewStatus').createProperty({
                name: 'IsDepositCurfewOn',
                get: () =>
                    this.getCurrentValue<boolean>(() => {
                        return this.curfewStatus?.isDepositCurfewOn ?? DSL_NOT_READY;
                    }),
                deps: ['curfewStatus', 'user.isAuthenticated'],
            }),
        };
    }

    private getCurrentValue<T>(get: () => T, defaultValue = false) {
        if (!this.user.isAuthenticated) {
            return defaultValue;
        }

        if (!this.loaded) {
            this.loaded = true;
            this.curfewStatusService.load();
        }

        return get();
    }
}
