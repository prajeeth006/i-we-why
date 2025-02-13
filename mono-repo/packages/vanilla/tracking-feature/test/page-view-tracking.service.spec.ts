import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    ClientConfigService,
    PAGE_VIEW_DATA_PROVIDER,
    PageViewContext,
    PageViewDataProvider,
    ProductInjector,
    TrackingData,
    TrackingService,
    Utm,
} from '@frontend/vanilla/core';
import { MockProvider } from 'ng-mocks';
import { Subject, of } from 'rxjs';

import { PageViewTrackingService } from '../src/page-view-tracking.service';
import { TrackingConfig } from '../src/tracking.client-config';
import { ClientConfigServiceMock } from './mocks/client-config-service.mock';
import { ProductInjectorMock } from './mocks/product-injector.mock';
import { TrackingConfigMock } from './mocks/tracking-config.mock';
import { TrackingServiceMock } from './mocks/tracking-service.mock';

class PageViewDataProviderMock implements PageViewDataProvider {
    getData = jest.fn();
}

describe('PageViewTrackingService', () => {
    let service: PageViewTrackingService;
    let trackingServiceMock: typeof TrackingServiceMock;
    let trackingConfigMock: typeof TrackingConfigMock;
    let pageViewDataProviderMock: PageViewDataProvider;
    let productInjector: ProductInjector;

    beforeEach(() => {
        trackingServiceMock = TrackingServiceMock;
        trackingConfigMock = TrackingConfigMock;
        productInjector = ProductInjectorMock;
        pageViewDataProviderMock = new PageViewDataProviderMock();

        TestBed.configureTestingModule({
            providers: [
                PageViewTrackingService,
                ProductInjector,
                provideHttpClient(),
                provideHttpClientTesting(),
                MockProvider(PAGE_VIEW_DATA_PROVIDER, pageViewDataProviderMock, 'useValue', true),
                MockProvider(TrackingService, trackingServiceMock),
                MockProvider(TrackingConfig, trackingConfigMock),
                MockProvider(ClientConfigService, ClientConfigServiceMock),
                MockProvider(ProductInjector, productInjector),
            ],
        });

        trackingConfigMock.pageViewDataProviderTimeout = 2000;
        service = TestBed.inject(PageViewTrackingService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should track page view with provided data', fakeAsync(() => {
        jest.spyOn(productInjector, 'getMultiple').mockReturnValue([of(pageViewDataProviderMock)]);
        const spy = jest.spyOn(pageViewDataProviderMock, 'getData').mockReturnValue(of({ data: 'a' }));

        service.trackPageView(1);

        tick(2000);

        expect(spy).toHaveBeenCalled();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('pageView', { data: 'a' });
    }));

    it('should keep order of events', () => {
        const source$ = new Subject<TrackingData>();
        jest.spyOn(pageViewDataProviderMock, 'getData').mockReturnValue(source$.asObservable());
        jest.spyOn(productInjector, 'getMultiple').mockReturnValue([of(pageViewDataProviderMock)]);

        service.trackPageView(1);
        source$.next({ data: 0 });

        service.trackPageView(2);
        source$.next({ data: 1 });

        service.trackPageView(3);
        source$.next({ data: 2 });

        let i = 0;

        (trackingServiceMock.triggerEvent as jest.Mock).mock.calls.forEach((c) => {
            expect(c[0]).toBe('pageView');
            expect(c[1]).toEqual({ data: i++ });
        });
    });

    it('should timeout and take empty values after specified timeout', fakeAsync(() => {
        jest.spyOn(productInjector, 'getMultiple').mockReturnValue([of(pageViewDataProviderMock)]);
        jest.spyOn(pageViewDataProviderMock, 'getData').mockReturnValue(of({}));

        service.trackPageView(1);

        tick(2000);

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('pageView', {});
    }));

    it('should send the utm values as well', fakeAsync(() => {
        jest.spyOn(productInjector, 'getMultiple').mockReturnValue([of(pageViewDataProviderMock)]);

        const context = {
            navigationId: 0,
            utm: {
                utm_campaign: 'A',
                utm_content: 'b',
                utm_medium: 'C',
                utm_source: '1',
                utm_term: '22o',
            },
        } as PageViewContext;

        jest.spyOn(pageViewDataProviderMock, 'getData').mockReturnValue(of(context));

        service.trackPageView(context.utm as Utm);

        expect(pageViewDataProviderMock.getData).toHaveBeenCalledWith(context);
        // (pageViewDataProviderMock.getData as Subject<TrackingData>).next({});
    }));
});
