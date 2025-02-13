import { Injectable } from '@angular/core';

import {
    DSL_NOT_READY,
    DslCacheService,
    DslRecordable,
    DslRecorderService,
    DslValuesProvider,
    SofStatusDetails,
    UserService,
} from '@frontend/vanilla/core';

import { SofStatusDetailsService } from './sof-status-details.service';

@Injectable()
export class SofStatusDetailsDslValuesProvider implements DslValuesProvider {
    private sofStatusDetails: SofStatusDetails | null = null;
    private loaded: boolean = false;

    constructor(
        private dslRecorderService: DslRecorderService,
        private sofStatusDetailsService: SofStatusDetailsService,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.sofStatusDetailsService.statusDetails.subscribe((details: SofStatusDetails | null) => {
            this.sofStatusDetails = details;
            dslCacheService.invalidate(['sofStatusDetails']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            SofStatusDetails: this.dslRecorderService
                .createRecordable('sofStatusDetails')
                .createProperty({
                    name: 'SofStatus',
                    get: () => this.getCurrentValue('sofStatus'),
                    deps: ['sofStatusDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'RedStatusDays',
                    get: () => this.getCurrentValue('redStatusDays'),
                    deps: ['sofStatusDetails', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue(property: string) {
        if (!this.user.isAuthenticated) {
            return (SofStatusDetailsService.UnauthSofStatusDetails as any)[property];
        }

        if (!this.loaded) {
            this.loaded = true;
            this.sofStatusDetailsService.refresh();
        }

        return this.sofStatusDetails ? (this.sofStatusDetails as any)[property] : DSL_NOT_READY;
    }
}
