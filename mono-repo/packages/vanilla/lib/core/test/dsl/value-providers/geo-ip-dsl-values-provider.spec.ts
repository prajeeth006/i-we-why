import { TestBed } from '@angular/core/testing';

import { DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { GeoIpDslValuesProvider } from '../../../src/dsl/value-providers/geo-ip-dsl-values-provider';
import { ClaimsServiceMock } from '../../user/claims.mock';
import { DslValueAsyncResolverMock } from './dsl-value-async-resolver.mock';

describe('GeoIpDslValuesProvider', () => {
    let target: DslRecordable;
    let claimsServiceMock: ClaimsServiceMock;
    let dslValueAsyncResolverMock: DslValueAsyncResolverMock;

    beforeEach(() => {
        dslValueAsyncResolverMock = MockContext.useMock(DslValueAsyncResolverMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, GeoIpDslValuesProvider],
        });

        const provider = TestBed.inject(GeoIpDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        dslValueAsyncResolverMock.resolve.and.returnValue('Her');
        claimsServiceMock.get.withArgs('http://api.bwin.com/v3/geoip/locality').and.returnValue('Herz');
        claimsServiceMock.get.withArgs('http://api.bwin.com/v3/geoip/stateorprovince').and.returnValue('gacko');
        claimsServiceMock.get.withArgs('http://api.bwin.com/v3/geoip/country').and.returnValue('Country Herz');

        target = provider.getProviders()['GeoIP']!;
    });

    it('should resolve', () => {
        expect(target['City']).toBe('Herz');
        expect(target['Region']).toBe('gacko');
        expect(target['Country']).toBe('Country Herz');
        expect(target['CountryName']).toBe('Her');
    });
});
