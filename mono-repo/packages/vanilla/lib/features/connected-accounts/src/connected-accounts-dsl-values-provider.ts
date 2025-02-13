import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { ConnectedAccountsService } from './connected-accounts.service';

@Injectable()
export class ConnectedAccountsDslValuesProvider implements DslValuesProvider {
    private count: number | null = null;
    private loaded: boolean = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private connectedAccountsService: ConnectedAccountsService,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.connectedAccountsService.count.subscribe((count: number | null) => {
            this.count = count;
            dslCacheService.invalidate(['connectedAccounts']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            ConnectedAccounts: this.dslRecorderService.createRecordable('connectedAccounts').createProperty({
                name: 'Count',
                get: () =>
                    this.getCurrentValue<number>(() => {
                        return this.count ?? DSL_NOT_READY;
                    }),
                deps: ['connectedAccounts', 'user.isAuthenticated'],
            }),
        };
    }

    private getCurrentValue<T>(get: () => T, defaultValue = 0) {
        if (!this.user.isAuthenticated) {
            return defaultValue;
        }

        if (!this.loaded) {
            this.loaded = true;
            this.connectedAccountsService.load();
        }

        return get();
    }
}
