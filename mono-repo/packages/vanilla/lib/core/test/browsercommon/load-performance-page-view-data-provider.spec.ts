import { TestBed } from '@angular/core/testing';

import { PerformanceProfile } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { LoadPerformancePageViewDataProvider } from '../../src/browser/performance/load-performance-page-view-data-provider';
import { BrowserPerformanceServiceMock } from './browser-performance.mock';
import { PageMock } from './page.mock';

describe('LoadPerformancePageViewDataProvider', () => {
    let service: LoadPerformancePageViewDataProvider;
    let page: PageMock;
    let browserPerformanceServiceMock: BrowserPerformanceServiceMock;
    let spy: jasmine.Spy;
    let profile: PerformanceProfile;

    beforeEach(() => {
        page = MockContext.useMock(PageMock);
        browserPerformanceServiceMock = MockContext.useMock(BrowserPerformanceServiceMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, LoadPerformancePageViewDataProvider],
        });

        page.isProfilingEnabled = true;
        browserPerformanceServiceMock.isSupported = true;
        spy = jasmine.createSpy();

        profile = {
            events: {
                domContentLoadedEvent: 1,
                loadEvent: 2,
            },
            network: [
                <any>{
                    name: 'clientconfig',
                    duration: 7.456456,
                },
            ],
            waterfall: {
                appCompilation: 3,
                appRun: 5,
                assetsFetch: 6,
            },
        };

        service = TestBed.inject(LoadPerformancePageViewDataProvider);
    });

    it('should provide performance data', () => {
        service.getData().subscribe(spy);

        browserPerformanceServiceMock.loadProfile.next(profile);

        expect(spy).toHaveBeenCalledWith({
            'performance.assetsFetch': 6,
            'performance.appCompilation': 3,
            'performance.appRun': 5,
            'performance.clientBootstrap': 7,
            'performance.domContentLoaded': 1,
            'performance.load': 2,
        });
    });

    it('should provide performance data only for the first call', () => {
        service.getData().subscribe(spy);

        browserPerformanceServiceMock.loadProfile.next(profile);

        expect(spy).toHaveBeenCalled();

        spy.calls.reset();

        service.getData().subscribe(spy);

        expect(spy).toHaveBeenCalledWith({});
    });

    it('should not provide performance data if disabled', () => {
        page.isProfilingEnabled = false;

        service.getData().subscribe(spy);

        expect(browserPerformanceServiceMock.loadProfile).not.toHaveBeenCalled();

        expect(spy).toHaveBeenCalledWith({});
    });

    it('should not provide performance data if performance is not supported', () => {
        browserPerformanceServiceMock.isSupported = false;

        service.getData().subscribe(spy);

        expect(browserPerformanceServiceMock.loadProfile).not.toHaveBeenCalled();

        expect(spy).toHaveBeenCalledWith({});
    });
});
