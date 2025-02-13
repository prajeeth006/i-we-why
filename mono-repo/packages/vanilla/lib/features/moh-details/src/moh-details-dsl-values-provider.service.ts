import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';

import { MohDetails, MohDetailsService } from './moh-details.service';

@Injectable()
export class MohDetailsDslValuesProvider implements DslValuesProvider {
    private mohDetails: MohDetails | null = null;
    private loaded: boolean = false;
    constructor(
        private dslRecorderService: DslRecorderService,
        dslCacheService: DslCacheService,
        private mohDetailsService: MohDetailsService,
        private user: UserService,
    ) {
        this.mohDetailsService.details.subscribe((s) => {
            this.mohDetails = s;

            dslCacheService.invalidate(['mohDetails']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            MohDetails: this.dslRecorderService
                .createRecordable('mohDetails')
                .createProperty({
                    name: 'Comments',
                    get: () => this.getCurrentValue('comments'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'CountryCode',
                    get: () => this.getCurrentValue('countryCode'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'ExclDays',
                    get: () => this.getCurrentValue('exclDays'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'MohPrimaryProductCode',
                    get: () => this.getCurrentValue('mohPrimaryProductCode'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'MohPrimaryReasonCode',
                    get: () => this.getCurrentValue('mohPrimaryReasonCode'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'MohPrimaryRiskBandCode',
                    get: () => this.getCurrentValue('mohPrimaryRiskBandCode'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'MohPrimaryToolCode',
                    get: () => this.getCurrentValue('mohPrimaryToolCode'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'MohScore',
                    get: () => this.getCurrentValue('mohScore'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Processed',
                    get: () => this.getCurrentValue('processed'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'VipUser',
                    get: () => this.getCurrentValue('vipUser'),
                    deps: ['mohDetails', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue(property: string) {
        if (!this.user.isAuthenticated) {
            return MohDetailsService.UnauthMohDetails[property];
        }

        if (!this.loaded) {
            this.loaded = true;
            this.mohDetailsService.refresh();
        }

        return this.mohDetails ? this.mohDetails[property] : DSL_NOT_READY;
    }
}
