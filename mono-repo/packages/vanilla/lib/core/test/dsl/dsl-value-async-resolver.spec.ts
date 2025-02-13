import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DSL_NOT_READY, DslValueAsyncResolver } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { DslCacheServiceMock } from './dsl-cache.mock';

describe('DslValueAsyncResolver', () => {
    let target: DslValueAsyncResolver;
    let dslCacheServiceMock: DslCacheServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslValueAsyncResolver],
        });

        target = TestBed.inject(DslValueAsyncResolver);
    });

    it('resolve', fakeAsync(() => {
        const result = target.resolve({
            cacheKey: 'cacheone',
            endpoint: 'api/url',
            invalidateKey: 'inv',
            get: (data: any) => data?.play,
        });

        expect(result).toBe(DSL_NOT_READY);
        expect(apiServiceMock.get).toHaveBeenCalledWith('api/url', undefined, { showSpinner: false });

        apiServiceMock.get.next({ play: true });

        expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['inv']);

        tick();

        expect(
            target.resolve({
                cacheKey: 'cacheone',
                endpoint: 'api/url',
                invalidateKey: 'inv',
                get: (data: any) => data?.play,
            }),
        ).toBeTrue();
    }));
});
