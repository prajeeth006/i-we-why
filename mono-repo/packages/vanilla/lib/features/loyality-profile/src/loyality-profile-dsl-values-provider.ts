import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider } from '@frontend/vanilla/core';

import { MlifeLoyalityProfile } from './loyality-profile.models';
import { LoyalityProfileService } from './loyality-profile.service';

@Injectable()
export class LoyalityProfileDslValuesProvider implements DslValuesProvider {
    private mlifeLoyalityProfile: MlifeLoyalityProfile | null = null;
    private loaded: boolean = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private loyalityProfileService: LoyalityProfileService,
        dslCacheService: DslCacheService,
    ) {
        this.loyalityProfileService.mlifeLoyalityProfile.subscribe((mlifeProfile: MlifeLoyalityProfile | null) => {
            this.mlifeLoyalityProfile = mlifeProfile;
            dslCacheService.invalidate(['loyalityProfile']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            LoyalityProfile: this.dslRecorderService
                .createRecordable('loyalityProfile')

                .createProperty({
                    name: 'MlifeNo',
                    get: () => this.getCurrentValue('mlifeNo'),
                    deps: ['loyalityProfile', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Tier',
                    get: () => this.getCurrentValue('tier'),
                    deps: ['loyalityProfile', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'TierDesc',
                    get: () => this.getCurrentValue('tierDesc'),
                    deps: ['loyalityProfile', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'TierCredits',
                    get: () => this.getCurrentValue('tierCredits'),
                    deps: ['loyalityProfile', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue(property: string) {
        if (!this.loaded) {
            this.loaded = true;
            this.loyalityProfileService.refresh();
        }

        return this.mlifeLoyalityProfile ? this.mlifeLoyalityProfile[property] : DSL_NOT_READY;
    }
}
