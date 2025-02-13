import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { RegistrationInformation } from './registration.models';
import { RegistrationService } from './registration.service';

@Injectable()
export class RegistrationDslValuesProvider implements DslValuesProvider {
    private registrationInformation: RegistrationInformation | null = null;
    private loaded: boolean;

    constructor(
        private dslRecorderService: DslRecorderService,
        private registrationInformationService: RegistrationService,
        dslCacheService: DslCacheService,
        private user: UserService,
    ) {
        this.registrationInformationService.registrationInformation.subscribe((info) => {
            this.registrationInformation = info;
            dslCacheService.invalidate(['registration']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Registration: this.dslRecorderService
                .createRecordable('registration')
                .createProperty({
                    name: 'Date',
                    get: () => this.getCurrentValue<string>('date', ''),
                    deps: ['registration', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'DaysRegistered',
                    get: () => this.getCurrentValue<number>('daysRegistered', -1),
                    deps: ['registration', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue<T>(property: string, defaultValue: T): T {
        if (!this.user.isAuthenticated) {
            return defaultValue;
        }

        if (!this.loaded) {
            this.loaded = true;
            this.registrationInformationService.load();
        }

        return this.registrationInformation ? this.registrationInformation[property] : DSL_NOT_READY;
    }
}
