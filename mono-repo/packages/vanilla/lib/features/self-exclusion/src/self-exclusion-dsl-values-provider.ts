import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { SelfExclusionDetails, SelfExclusionService } from './self-exclusion.service';

@Injectable()
export class SelfExclusionDslValuesProvider implements DslValuesProvider {
    private selfExclusionDetails: SelfExclusionDetails | null = null;
    private loaded: boolean = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private selfExclusionService: SelfExclusionService,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.selfExclusionService.details.subscribe((details: SelfExclusionDetails) => {
            this.selfExclusionDetails = details;
            this.loaded = true;
            dslCacheService.invalidate(['selfExclusion']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        const recordable = this.dslRecorderService.createRecordable('selfExclusion');
        const createProperty = (name: string, getProperty: (b: SelfExclusionDetails) => string) => {
            recordable.createProperty({
                name,
                get: () => this.getCurrentValue<string>(() => (this.selfExclusionDetails ? getProperty(this.selfExclusionDetails) : DSL_NOT_READY)),
                deps: ['selfExclusion', 'user.isAuthenticated'],
            });
        };

        createProperty('Category', (b) => b.categoryId ?? '');
        createProperty('StartDate', (b) => b.startDate ?? '');
        createProperty('EndDate', (b) => b.endDate ?? '');

        return { SelfExclusion: recordable };
    }

    private getCurrentValue<T>(get: () => T, defaultValue = '') {
        if (!this.user.isAuthenticated) {
            return defaultValue;
        }

        if (!this.loaded) {
            this.loaded = true;
            this.selfExclusionService.init();
        }

        return get();
    }
}
