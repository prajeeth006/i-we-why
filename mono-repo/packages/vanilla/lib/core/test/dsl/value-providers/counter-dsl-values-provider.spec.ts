import { TestBed } from '@angular/core/testing';

import { DateTimeOffset, DslRecorderService, TimeSpan, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ABSOLUTE_EXPIRATION_BOUNDARY } from '../../../src/dsl/value-providers/cookie-dsl-values-provider';
import { CounterDslValuesProvider } from '../../../src/dsl/value-providers/counter-dsl-values-provider';
import { CookieServiceMock } from '../../browser/cookie.mock';
import { DateTimeServiceMock } from '../../browser/datetime.service.mock';
import { WebWorkerServiceMock } from '../../web-worker/web-worker.service.mock';
import { DslCacheServiceMock } from '../dsl-cache.mock';
import { DslTimeConverterServiceMock } from './dsl-time-converter.service.mock';

describe('CounterDslValuesProvider', () => {
    let provider: CounterDslValuesProvider;
    let cookieServiceMock: CookieServiceMock;
    let dateTimeServiceMock: DateTimeServiceMock;
    let dslTimeConverterServiceMock: DslTimeConverterServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);
        dslTimeConverterServiceMock = MockContext.useMock(DslTimeConverterServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        MockContext.useMock(DslCacheServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, CounterDslValuesProvider],
        });

        TestBed.inject(DslRecorderService).beginRecording();
    });

    function createProvider() {
        provider = TestBed.inject(CounterDslValuesProvider);
    }

    describe('init', () => {
        it('should create Web worker', () => {
            createProvider();

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.CounterDslValuesProviderInterval,
                { interval: 1000 },
                jasmine.any(Function),
            );
        });
    });

    describe('methods', () => {
        let target: any;

        beforeEach(() => {
            createProvider();
            target = provider.getProviders()['Counter'];
        });

        describe('Get()', () => {
            it('should return counter value', () => {
                cookieServiceMock.getObject.withArgs('counter').and.returnValue({ count: 1, expiration: '2020-01-01' });

                // act
                const value = target['Get']('counter');

                expect(value).toBe(1);
            });

            it('should return counter value as 0 if counter inexistent', () => {
                cookieServiceMock.getObject.withArgs('counter').and.returnValue(undefined);

                // act
                const value = target['Get']('counter');

                expect(value).toBe(0);
            });
        });

        describe('Increment()', () => {
            it('should create counter if current one inexistent', () => {
                const expiration = ABSOLUTE_EXPIRATION_BOUNDARY + 500;
                const converted = new Date(expiration);
                dslTimeConverterServiceMock.fromDslToTime.withArgs(expiration).and.returnValue(new DateTimeOffset(expiration, TimeSpan.ZERO));

                cookieServiceMock.getObject.withArgs('counter').and.returnValue(undefined);

                // act
                target['Increment']('counter', expiration);

                expect(cookieServiceMock.putRaw).toHaveBeenCalledWith('counter', JSON.stringify({ count: 1, expiration: converted }), {
                    expires: converted,
                });
            });

            it('should increment counter', () => {
                const expiration = ABSOLUTE_EXPIRATION_BOUNDARY + 500;
                const converted = new Date(expiration);
                dslTimeConverterServiceMock.fromDslToTime.withArgs(expiration).and.returnValue(new DateTimeOffset(expiration, TimeSpan.ZERO));
                dateTimeServiceMock.now.and.returnValue(new Date(expiration - 500));

                cookieServiceMock.getObject.withArgs('counter').and.returnValue({ count: 1, expiration: converted });

                // act
                target['Increment']('counter', expiration);

                expect(cookieServiceMock.putRaw).toHaveBeenCalledWith('counter', JSON.stringify({ count: 2, expiration: converted }), {
                    expires: converted,
                });
            });
        });
    });
});
