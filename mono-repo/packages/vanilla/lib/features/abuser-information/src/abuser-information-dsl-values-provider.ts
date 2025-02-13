import { Injectable } from '@angular/core';

import {
    DslCacheService,
    DslRecordable,
    DslRecorderService,
    DslValuesProvider,
    PersistentDslLoadOptions,
    PersistentDslService,
} from '@frontend/vanilla/core';

import { AbuserInformation } from './abuser-information.models';
import { AbuserInformationService } from './abuser-information.service';

@Injectable()
export class AbuserInformationDslValuesProvider implements DslValuesProvider {
    private abuserInformation: AbuserInformation | null = null;
    private options: PersistentDslLoadOptions = { fetchEnabled: true };

    constructor(
        private dslRecorderService: DslRecorderService,
        private abuserInformationService: AbuserInformationService,
        private persistentDslService: PersistentDslService,
        dslCacheService: DslCacheService,
    ) {
        this.abuserInformationService.abuserInformation.subscribe((info) => {
            this.abuserInformation = info;
            dslCacheService.invalidate(['bonusAbuserInformation']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            BonusAbuserInformation: this.dslRecorderService.createRecordable('bonusAbuserInformation').createProperty({
                name: 'IsBonusAbuser',
                get: () => this.getValue<boolean>(() => this.abuserInformation?.isBonusAbuser ?? false),
                deps: ['bonusAbuserInformation', 'user.isAuthenticated'],
            }),
        };
    }

    private getValue<T>(resultFunc: () => T) {
        return this.persistentDslService.getResult<T>(this.options, () => this.abuserInformationService.load(), resultFunc);
    }
}
