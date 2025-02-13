import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { AffordabilitySnapshotDetails } from './affordability.models';
import { AffordabilityService } from './affordability.service';

@Injectable()
export class AffordabilityDslValuesProvider implements DslValuesProvider {
    private snapshotDetails: AffordabilitySnapshotDetails | null = null;
    private loaded: boolean;

    constructor(
        private dslRecorderService: DslRecorderService,
        private affordabilityService: AffordabilityService,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.affordabilityService.snapshotDetails.subscribe((snapshotDetails: AffordabilitySnapshotDetails | null) => {
            this.snapshotDetails = snapshotDetails;

            dslCacheService.invalidate(['affordability']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Affordability: this.dslRecorderService
                .createRecordable('affordability')
                .createProperty({
                    name: 'Level',
                    get: () => this.getCurrentValue('affordabilityStatus')?.toUpperCase().replace('LEVEL', ''),
                    deps: ['affordability', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'EmploymentGroup',
                    get: () => this.getCurrentValue('employmentGroup'),
                    deps: ['affordability', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue(property: string): string {
        if (!this.user.isAuthenticated) {
            return '';
        }

        if (!this.loaded) {
            this.affordabilityService.load();
            this.loaded = true;
        }

        return this.snapshotDetails ? this.snapshotDetails[property] : DSL_NOT_READY;
    }
}
