import { Injectable } from '@angular/core';

import { ClaimsService } from '../../user/claims.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslValueAsyncResolver, DslValueCacheKey } from '../dsl-value-async-resolver';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

const GEO_IP_DSL_INVALIDATE_KEY = 'geoIP.CountryName';

@Injectable()
export class GeoIpDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private claimsService: ClaimsService,
        private dslValueAsyncResolver: DslValueAsyncResolver,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            GeoIP: this.dslRecorderService
                .createRecordable('geoIP')
                .createProperty({
                    name: 'City',
                    get: () => this.claimsService.get('http://api.bwin.com/v3/geoip/locality') || '',
                    deps: ['geoIP.City'],
                })
                .createProperty({
                    name: 'Region',
                    get: () => this.claimsService.get('http://api.bwin.com/v3/geoip/stateorprovince') || '',
                    deps: ['geoIP.Region'],
                })
                .createProperty({
                    name: 'Country',
                    get: () => this.claimsService.get('http://api.bwin.com/v3/geoip/country') || '',
                    deps: ['geoIP.Country'],
                })
                .createProperty({
                    name: 'CountryName',
                    get: () =>
                        this.dslValueAsyncResolver.resolve({
                            cacheKey: DslValueCacheKey.GEO_IP,
                            endpoint: 'geoip',
                            invalidateKey: GEO_IP_DSL_INVALIDATE_KEY,
                            get: (data) => data.countryName,
                        }),
                    deps: [GEO_IP_DSL_INVALIDATE_KEY],
                }),
        };
    }
}
