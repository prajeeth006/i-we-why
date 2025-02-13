import { Injectable } from '@angular/core';

import {
    DslCacheService,
    DslRecordable,
    DslRecorderService,
    DslValuesProvider,
    PersistentDslLoadOptions,
    PersistentDslService,
} from '@frontend/vanilla/core';

import { UserScrubService } from './user-scrub.service';

@Injectable()
export class UserScrubDslValuesProvider implements DslValuesProvider {
    private products: string[] | null = null;
    private options: PersistentDslLoadOptions = { fetchEnabled: true };

    constructor(
        private dslRecorderService: DslRecorderService,
        private userScrubService: UserScrubService,
        private persistentDslService: PersistentDslService,
        dslCacheService: DslCacheService,
    ) {
        this.userScrubService.products.subscribe((products) => {
            this.products = products;
            dslCacheService.invalidate(['userScrub']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            UserScrub: this.dslRecorderService.createRecordable('userScrub').createFunction({
                name: 'IsScrubbedFor',
                get: (product: string) =>
                    this.getValue<boolean>(() => (this.products ? this.products.some((p) => product.toLowerCase() === p.toLowerCase()) : false)),
                deps: () => ['userScrub', 'user.isAuthenticated'],
            }),
        };
    }

    private getValue<T>(resultFunc: () => T) {
        return this.persistentDslService.getResult<T>(this.options, () => this.userScrubService.load(), resultFunc);
    }
}
