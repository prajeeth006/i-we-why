import { Injectable } from '@angular/core';

import { DslRecordable, DslRecorderService, DslValueAsyncResolver, DslValueCacheKey, DslValuesProvider, UserService } from '@frontend/vanilla/core';

const LICENSE_INFO_DSL_INVALIDATE_KEY = 'licenseInfo.AcceptanceNeeded';
@Injectable()
export class LicenseInfoDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private user: UserService,
        private dslValueAsyncResolver: DslValueAsyncResolver,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            LicenseInfo: this.dslRecorderService.createRecordable('licenseInfo').createProperty({
                name: 'AcceptanceNeeded',
                get: () =>
                    this.user.isAuthenticated
                        ? this.dslValueAsyncResolver.resolve({
                              cacheKey: DslValueCacheKey.LICENSE_INFO,
                              endpoint: 'licenseinfo',
                              invalidateKey: LICENSE_INFO_DSL_INVALIDATE_KEY,
                              get: (result) => result?.acceptanceNeeded,
                          })
                        : false,
                deps: [LICENSE_INFO_DSL_INVALIDATE_KEY, 'user.isAuthenticated'],
            }),
        };
    }
}
