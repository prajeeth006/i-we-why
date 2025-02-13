import { TestBed, waitForAsync } from '@angular/core/testing';
import { NavigationEnd, NavigationStart } from '@angular/router';

import { BrowserPerformanceService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { RouterMock } from '../../../core/test/router.mock';
import { LoggerMock } from '../languages/logger.mock';
import { PageMock } from './page.mock';

const NOT_SUPPORTED_MESSAGE =
    'Performance is not supported on this device. Please check BrowserPerformanceService.isSupported before calling any performance methods.';

describe('BrowserPerformanceService', () => {
    let service: BrowserPerformanceService;
    let windowMock: WindowMock;
    let loggerMock: LoggerMock;
    let network: PerformanceResourceTiming[];
    let routerMock: RouterMock;
    let page: PageMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        loggerMock = MockContext.useMock(LoggerMock);
        routerMock = MockContext.useMock(RouterMock);
        page = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [
                ...MockContext.providers,
                BrowserPerformanceService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        windowMock.performance.getEntriesByType.withArgs('navigation').and.returnValue([{ domComplete: 100, domInteractive: 99 }]);
        windowMock.performance.getEntriesByType.withArgs('resource').and.callFake(() => network);
        page.isProfilingEnabled = true;
        network = [
            <any>{
                name: 'ClientDist/app.bla.js',
                responseEnd: 10,
            },
            {
                name: 'ClientDist/vendor.bla.js',
                responseEnd: 22.5,
            },
            {
                name: 'ClientDist/polyfills.bla.js',
                responseEnd: 40,
            },
            {
                name: 'themes/main.bla.css',
                responseEnd: 50,
            },
            {
                name: 'themes/splash.bla.css',
                responseEnd: 3.4,
            },
            {
                name: '/clientconfig',
                responseEnd: 33.4,
            },
            {
                name: 'random-script.js',
                responseEnd: 9999,
            },
        ];
    });

    function initService() {
        service = TestBed.inject(BrowserPerformanceService);
        service.init();
    }

    describe('init', () => {
        it('should start measuring on NavigationStart', () => {
            initService();

            routerMock.events.next(new NavigationStart(1, '/en'));

            expect(windowMock.performance.mark).toHaveBeenCalledWith('van_nav1-start');
        });

        it('should end measuring on NavigationEnd', () => {
            initService();

            routerMock.events.next(new NavigationEnd(1, '/en', '/en'));

            expect(windowMock.performance.mark).toHaveBeenCalledWith('van_nav1-end');
        });
    });

    describe('loadProfile()', () => {
        it('should resolve a promise after window load and timeout', (done) => {
            initService();

            service.loadProfile().subscribe((p) => {
                expect(p).toEqual({
                    events: {
                        domContentLoadedEvent: 99,
                        loadEvent: 100,
                    },
                    network,
                    waterfall: {
                        appCompilation: 49,
                        appRun: 51,
                        assetsFetch: 50,
                    },
                });
                done();
            });

            expect(windowMock.addEventListener).toHaveBeenCalledWith('load', jasmine.any(Function));
            windowMock.addEventListener.calls.mostRecent().args[1]();
        });

        it('should return NaN if assets are not in resource timings', (done) => {
            network = [
                <any>{
                    name: 'random-script.js',
                    responseEnd: 9999,
                },
            ];

            initService();

            service.loadProfile().subscribe((p) => {
                expect(p).toEqual({
                    events: {
                        domContentLoadedEvent: 99,
                        loadEvent: 100,
                    },
                    network,
                    waterfall: {
                        appCompilation: NaN,
                        appRun: NaN,
                        assetsFetch: NaN,
                    },
                });
                expect(loggerMock.warn).toHaveBeenCalled();
                done();
            });

            windowMock.addEventListener.calls.mostRecent().args[1]();
        });
    });

    describe('startMeasurement()', () => {
        it('should call mark with start name', () => {
            initService();

            service.startMeasurement('name');

            expect(windowMock.performance.mark).toHaveBeenCalledWith('name-start');
        });
    });

    describe('endMeasurement()', () => {
        it('should call mark with start name', () => {
            initService();

            service.endMeasurement('name');

            expect(windowMock.performance.mark).toHaveBeenCalledWith('name-end');
        });
    });

    describe('clearMeasurement()', () => {
        it('should clear measure and marks', () => {
            initService();

            service.clearMeasurement('name');

            expect(windowMock.performance.clearMarks).toHaveBeenCalledWith('name-start');
            expect(windowMock.performance.clearMarks).toHaveBeenCalledWith('name-end');
            expect(windowMock.performance.clearMeasures).toHaveBeenCalledWith('name');
        });
    });

    describe('observeMeasurement()', () => {
        it('should return duration of a measurement', waitForAsync(() => {
            initService();

            windowMock.performance.getEntriesByName.withArgs('name-start').and.returnValue([{}]);
            windowMock.performance.getEntriesByName.withArgs('name-end').and.returnValue([{}]);
            windowMock.performance.getEntriesByName.withArgs('name').and.returnValue([{ duration: 5.55 }]);

            service.observeMeasurement('name').subscribe((d) => {
                expect(windowMock.performance.measure).toHaveBeenCalledWith('name', 'name-start', 'name-end');

                expect(d).toBe(6);
            });
        }));

        it('should wait for end and return duration of a measurement', waitForAsync(() => {
            initService();

            windowMock.performance.getEntriesByName.withArgs('name-start').and.returnValue([]);
            windowMock.performance.getEntriesByName.withArgs('name-end').and.returnValue([]);
            windowMock.performance.getEntriesByName.withArgs('name').and.returnValue([{ duration: 5.55 }]);

            service.observeMeasurement('name').subscribe((d) => {
                expect(windowMock.performance.measure).toHaveBeenCalledWith('name', 'name-start', 'name-end');

                expect(d).toBe(6);
            });

            windowMock.performance.getEntriesByName.withArgs('name-start').and.returnValue([{}]);
            windowMock.performance.getEntriesByName.withArgs('name-end').and.returnValue([{}]);
            service.endMeasurement('name');
        }));

        it('should throw an error if measurement was not started', waitForAsync(() => {
            initService();

            windowMock.performance.getEntriesByName.withArgs('name-start').and.returnValue([]);
            windowMock.performance.getEntriesByName.withArgs('name-end').and.returnValue([]);
            windowMock.performance.getEntriesByName.withArgs('name').and.returnValue([{ duration: 5.55 }]);

            service.observeMeasurement('name').subscribe({
                error: (err) => {
                    expect(err.message).toContain('Unable to measure');
                },
            });

            windowMock.performance.getEntriesByName.withArgs('name-end').and.returnValue([{}]);
            service.endMeasurement('name');
        }));
    });

    describe('isSupported', () => {
        notSupportedTest('performance', () => (windowMock.performance = <any>undefined));
        notSupportedTest('getEntriesByType navigation [0]', () => windowMock.performance.getEntriesByType.withArgs('navigation').and.returnValue([]));

        function notSupportedTest(what: string, setup: () => void) {
            it(`should be false if ${what} is not defined`, () => {
                setup();
                initService();

                expect(service.isSupported).toBeFalse();
                expect(() => service.loadProfile()).toThrowError(NOT_SUPPORTED_MESSAGE);
                expect(() => service.observeMeasurement('name')).toThrowError(NOT_SUPPORTED_MESSAGE);
                expect(() => service.startMeasurement('name')).toThrowError(NOT_SUPPORTED_MESSAGE);
                expect(() => service.endMeasurement('name')).toThrowError(NOT_SUPPORTED_MESSAGE);
            });
        }
    });
});
