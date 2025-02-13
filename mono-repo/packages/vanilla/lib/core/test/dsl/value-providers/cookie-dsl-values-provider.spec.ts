import { TestBed } from '@angular/core/testing';

import { DateTimeOffset, DslRecordable, DslRecorderService, TimeSpan, WINDOW, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ABSOLUTE_EXPIRATION_BOUNDARY, CookieDslValuesProvider } from '../../../src/dsl/value-providers/cookie-dsl-values-provider';
import { CookieServiceMock } from '../../browser/cookie.mock';
import { DateTimeServiceMock } from '../../browser/datetime.service.mock';
import { LoggerMock } from '../../languages/logger.mock';
import { WebWorkerServiceMock } from '../../web-worker/web-worker.service.mock';
import { DslCacheServiceMock } from '../dsl-cache.mock';
import { DslTimeConverterServiceMock } from './dsl-time-converter.service.mock';

describe('CookieDslValuesProvider', () => {
    let provider: CookieDslValuesProvider;
    let cookieServiceMock: CookieServiceMock;
    let dateTimeServiceMock: DateTimeServiceMock;
    let dslTimeConverterServiceMock: DslTimeConverterServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    const worker = new Worker('');

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);
        dslTimeConverterServiceMock = MockContext.useMock(DslTimeConverterServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        MockContext.useMock(LoggerMock);
        MockContext.useMock(DslCacheServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, CookieDslValuesProvider],
        });

        cookieServiceMock.getAll.and.returnValue({
            cname: 'cval',
        });
        webWorkerServiceMock.createWorker.and.returnValue(worker);

        TestBed.inject(WINDOW);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    function createProvider() {
        provider = TestBed.inject(CookieDslValuesProvider);
    }

    describe('init', () => {
        it('should create Web worker', () => {
            createProvider();

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.CookieDslValuesProviderInterval,
                { interval: 100 },
                jasmine.any(Function),
            );
        });
    });

    describe('methods', () => {
        let target: DslRecordable;

        beforeEach(() => {
            createProvider();
            target = provider.getProviders()['Cookies'] || new DslRecordable('');
        });

        describe('Get()', () => {
            it('should return a cookie', () => {
                cookieServiceMock.get.withArgs('cname').and.returnValue('cval');

                // act
                const value = target['Get']('cname');

                expect(value).toBe('cval');
            });

            it('should return empty string for non existent cookie', () => {
                createProvider();

                // act
                const value = target['Get']('cname');

                expect(value).toBeEmptyString();
            });
        });

        it('SetSession() should set cookie without expiration', () => {
            // act
            target['SetSession']('foo', 'bar');

            expect(cookieServiceMock.put).toHaveBeenCalledWith('foo', 'bar');
        });

        it('SetPersistent() should set cookie with relative expiration', () => {
            const expiration = setupRelativeExpiration();

            // act
            target['SetPersistent']('foo', 'bar', expiration.input);

            expect(cookieServiceMock.putRaw).toHaveBeenCalledWith('foo', 'bar', { expires: expiration.expected });
        });

        it('SetPersistent() should set cookie with absolute expiration', () => {
            const expiration = setupAbsoluteExpiration();

            // act
            target['SetPersistent']('foo', 'bar', expiration.input);

            expect(cookieServiceMock.putRaw).toHaveBeenCalledWith('foo', 'bar', { expires: expiration.expected });
        });

        it('Delete() should delete cookie', () => {
            // act
            target['Delete']('foo');

            expect(cookieServiceMock.remove).toHaveBeenCalledWith('foo');
        });

        describe('Set()', () => {
            it('should delete cookie if expiration below zero', () => {
                // act
                target['Set']('foo', 'bar', -1, false, '.bwin.com', '/page');
                expect(cookieServiceMock.remove).toHaveBeenCalledWith('foo', {
                    domain: '.bwin.com',
                    path: '/page',
                    httpOnly: false,
                });
            });

            it('should session cookie if expiration below zero', () => {
                // act
                target['Set']('foo', 'bar', 0, false, '.bwin.com', '/page');

                expect(cookieServiceMock.put).toHaveBeenCalledWith('foo', 'bar', {
                    domain: '.bwin.com',
                    path: '/page',
                    httpOnly: false,
                });
            });

            it('should set persistent cookie with relative expiration', () => {
                const expiration = setupRelativeExpiration();

                // act
                target['Set']('foo', 'bar', expiration.input, false, '.bwin.com', '/page');

                expect(cookieServiceMock.put).toHaveBeenCalledWith('foo', 'bar', {
                    expires: expiration.expected,
                    domain: '.bwin.com',
                    path: '/page',
                    httpOnly: false,
                });
            });

            it('should set persistent cookie with absolute expiration', () => {
                const expiration = setupAbsoluteExpiration();

                // act
                target['Set']('foo', 'bar', expiration.input, false, '.bwin.com', '/page');

                expect(cookieServiceMock.put).toHaveBeenCalledWith('foo', 'bar', {
                    expires: expiration.expected,
                    domain: '.bwin.com',
                    path: '/page',
                    httpOnly: false,
                });
            });
        });

        function setupAbsoluteExpiration(): { input: number; expected: Date } {
            const input = ABSOLUTE_EXPIRATION_BOUNDARY + 666000;
            const testTime = 1558571243000;
            dslTimeConverterServiceMock.fromDslToTime.withArgs(input).and.returnValue(new DateTimeOffset(testTime, TimeSpan.ZERO));
            return { input, expected: new Date(testTime) };
        }

        function setupRelativeExpiration(): { input: number; expected: Date } {
            const input = ABSOLUTE_EXPIRATION_BOUNDARY - 666000;
            const converted = 12000;
            const now = 1578581243000;
            dslTimeConverterServiceMock.fromDslToTimeSpan.withArgs(input).and.returnValue(new TimeSpan(converted));
            dateTimeServiceMock.now.and.returnValue(new Date(now));
            return { input, expected: new Date(now + converted) };
        }
    });
});
