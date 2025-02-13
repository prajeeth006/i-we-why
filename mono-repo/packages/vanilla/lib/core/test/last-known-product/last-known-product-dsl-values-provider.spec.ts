import { TestBed } from '@angular/core/testing';

import { DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LastKnownProductDslValuesProvider } from '../../src/last-known-product/last-known-product-dsl-values-provider';
import { DslCacheServiceMock } from '../dsl/dsl-cache.mock';
import { LastKnownProductServiceMock } from './last-known-product.mock';

describe('LastKnownProductDslValuesProvider', () => {
    let provider: LastKnownProductDslValuesProvider;
    let dslCacheServiceMock: DslCacheServiceMock;
    let lastKnownProductServiceMock: LastKnownProductServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        lastKnownProductServiceMock = MockContext.useMock(LastKnownProductServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, LastKnownProductDslValuesProvider],
        });

        provider = TestBed.inject(LastKnownProductDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        lastKnownProductServiceMock.get.and.returnValue({
            name: 'sports',
            platformProductId: 'sportsId',
            previous: 'casino',
            url: 'http://bwin.com',
        });
    });

    it('should invalidate cache', () => {
        lastKnownProductServiceMock.update.next({ name: 'sports', platformProductId: 'sportsId', previous: 'casino', url: 'http://bwin.com' });

        expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['lastKnownProduct']);
    });

    describe('getProviders()', () => {
        it('should return correct recordable', () => {
            const providers = provider.getProviders();
            const name = providers['LastKnownProduct']!['Name'];
            const platformProductId = providers['LastKnownProduct']!['PlatformProductId'];
            const previous = providers['LastKnownProduct']!['Previous'];
            const url = providers['LastKnownProduct']!['Url'];
            expect(name).toEqual('sports');
            expect(platformProductId).toEqual('sportsId');
            expect(previous).toEqual('casino');
            expect(url).toEqual('http://bwin.com');
        });
    });
});
