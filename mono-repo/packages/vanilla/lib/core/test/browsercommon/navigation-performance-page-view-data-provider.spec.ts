import { TestBed } from '@angular/core/testing';

import { PageViewContext } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NavigationPerformancePageViewDataProvider } from '../../src/browser/performance/navigation-performance-page-view-data-provider';
import { BrowserPerformanceServiceMock } from './browser-performance.mock';
import { PageMock } from './page.mock';

describe('NavigationPerformancePageViewDataProvider', () => {
    let service: NavigationPerformancePageViewDataProvider;
    let page: PageMock;
    let browserPerformanceServiceMock: BrowserPerformanceServiceMock;
    let spy: jasmine.Spy;
    let context: PageViewContext;

    beforeEach(() => {
        page = MockContext.useMock(PageMock);
        browserPerformanceServiceMock = MockContext.useMock(BrowserPerformanceServiceMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, NavigationPerformancePageViewDataProvider],
        });

        page.isProfilingEnabled = true;
        browserPerformanceServiceMock.isSupported = true;
        spy = jasmine.createSpy();

        context = { navigationId: 1, utm: null };
    });

    function initService() {
        service = TestBed.inject(NavigationPerformancePageViewDataProvider);
    }

    it('should provide performance data', () => {
        initService();

        const sub = service.getData(context).subscribe(spy);

        expect(browserPerformanceServiceMock.observeMeasurement).toHaveBeenCalledWith('van_nav1');

        browserPerformanceServiceMock.observeMeasurement.next(5);

        expect(spy).toHaveBeenCalledWith({
            'performance.nav': 5,
        });

        sub.unsubscribe();
    });
});
