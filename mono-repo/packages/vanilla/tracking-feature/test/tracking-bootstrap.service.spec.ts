import { DOCUMENT } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    ClaimsService,
    ClientConfigService,
    CookieOptionsProvider,
    DeviceService,
    LoadingIndicatorService,
    LocationChangeEvent,
    NativeAppConfig,
    NavigationService,
    Page,
    ProductService,
    ResizeObserverService,
    STORE_PREFIX,
    SharedFeaturesApiService,
    TRACKING_SERVICE_PROVIDER,
    TagManagerService as TagManagerCoreService,
    TopLevelCookiesConfig,
    TrackingService,
    TrackingServiceProvider,
    UrlService,
    UserEvent,
    UserLoginEvent,
    UserService,
    Utm,
    WINDOW,
} from '@frontend/vanilla/core';
import { TagManagerService } from '@frontend/vanilla/features/tracking';
import { MockProvider, MockService } from 'ng-mocks';
import { BehaviorSubject, Subject } from 'rxjs';

import { PageViewTrackingService } from '../src/page-view-tracking.service';
import { TrackingBootstrapService } from '../src/tracking-bootstrap.service';
import { TrackingConfig } from '../src/tracking.client-config';
import { UtmService } from '../src/utm-service';
import { ClientConfigServiceMock } from './mocks/client-config-service.mock';
import { DeviceServiceMock } from './mocks/device-service.mock';
import { NavigationServiceMock } from './mocks/navigation-service.mock';
import { PageViewTrackingServiceMock } from './mocks/page-view-tracking-service.mock';
import { TagManagerServiceMock } from './mocks/tag-manager-service.mock';
import { TrackingConfigMock } from './mocks/tracking-config.mock';
import { TrackingServiceProviderMock } from './mocks/tracking-service-provider.mock';
import { UserServiceMock } from './mocks/user-service.mock';
import { UtmServiceMock } from './mocks/utm-service.mock';
import { WindowMock } from './mocks/window.mock';

describe('TrackingBootstrapService', () => {
    let service: TrackingBootstrapService;
    let navigationServiceMock: typeof NavigationServiceMock;
    let userServiceMock: typeof UserServiceMock;
    let pageViewTrackingServiceMock: typeof PageViewTrackingServiceMock;
    let trackingConfigMock: typeof TrackingConfigMock;
    let tagManagerServiceMock: typeof TagManagerServiceMock;
    let utmServiceMock: typeof UtmServiceMock;
    let deviceServiceMock: typeof DeviceServiceMock;
    let trackingServiceProviderMock: TrackingServiceProvider;

    beforeEach(() => {
        navigationServiceMock = MockService(NavigationService, {
            locationChange: new Subject<LocationChangeEvent>(),
        });
        pageViewTrackingServiceMock = PageViewTrackingServiceMock;
        trackingConfigMock = TrackingConfigMock;
        tagManagerServiceMock = TagManagerServiceMock;
        deviceServiceMock = DeviceServiceMock;
        utmServiceMock = UtmServiceMock;
        userServiceMock = UserServiceMock;
        trackingServiceProviderMock = new TrackingServiceProviderMock();

        TestBed.configureTestingModule({
            providers: [
                TrackingBootstrapService,
                provideHttpClient(),
                provideHttpClientTesting(),
                MockProvider(Page),
                MockProvider(UrlService),
                MockProvider(ClaimsService),
                MockProvider(NativeAppConfig),
                MockProvider(LoadingIndicatorService),
                MockProvider(CookieOptionsProvider),
                MockProvider(TopLevelCookiesConfig),
                MockProvider(ProductService),
                MockProvider(SharedFeaturesApiService),
                MockProvider(ResizeObserverService),

                MockProvider(DeviceService, deviceServiceMock),
                MockProvider(PageViewTrackingService, pageViewTrackingServiceMock),
                MockProvider(TrackingService, MockService(TrackingService)),
                MockProvider(TrackingConfig, trackingConfigMock),
                MockProvider(TagManagerCoreService, MockService(TagManagerCoreService)),
                MockProvider(NavigationService, navigationServiceMock),
                MockProvider(UtmService, utmServiceMock),
                MockProvider(UserService, userServiceMock),
                MockProvider(TagManagerCoreService, MockService(TagManagerCoreService)),
                MockProvider(TagManagerService, tagManagerServiceMock),
                MockProvider(ClientConfigService, ClientConfigServiceMock),
                MockProvider(TRACKING_SERVICE_PROVIDER, trackingServiceProviderMock),
                {
                    provide: STORE_PREFIX,
                    useValue: 'van.',
                },
                {
                    provide: WINDOW,
                    useValue: WindowMock,
                },
                {
                    provide: DOCUMENT,
                    useValue: {
                        referrer: 'http://bwin.com',
                    },
                },
            ],
        });

        service = TestBed.inject(TrackingBootstrapService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    function initBootstrapper() {
        service.onFeatureInit();
        (trackingConfigMock.whenReady as Subject<void>).next();
        tick();
    }

    it('should set initial referrer', fakeAsync(() => {
        initBootstrapper();

        expect(trackingServiceProviderMock.setReferrer).toHaveBeenCalledWith('http://bwin.com');
    }));

    it('should update referrer when location changes', fakeAsync(() => {
        initBootstrapper();

        (navigationServiceMock.locationChange as Subject<LocationChangeEvent>).next({
            id: 1,
            previousUrl: 'page1',
            nextUrl: 'page2',
        });

        expect(trackingServiceProviderMock.setReferrer).toHaveBeenCalledWith('page1');
        expect(pageViewTrackingServiceMock.trackPageView).toHaveBeenCalledTimes(2);
    }));

    it('should not track when location changes and prevUrl is the same as nextUrl', fakeAsync(() => {
        initBootstrapper();

        (navigationServiceMock.locationChange as Subject<LocationChangeEvent>).next({
            id: 1,
            previousUrl: 'page1',
            nextUrl: 'page1',
        });

        expect(trackingServiceProviderMock.setReferrer).not.toHaveBeenCalledWith('page1');
        expect(pageViewTrackingServiceMock.trackPageView).toHaveBeenCalledTimes(1);
    }));

    it('should track page view when location changes', fakeAsync(() => {
        initBootstrapper();
        const utm = { utm_source: 'test' } as Utm;

        jest.spyOn(utmServiceMock, 'parseFromUrl').mockReturnValue(utm);

        (navigationServiceMock.locationChange as Subject<LocationChangeEvent>).next({
            id: 1,
            previousUrl: 'page1',
            nextUrl: 'page2',
        });

        expect(pageViewTrackingServiceMock.trackPageView).toHaveBeenCalledWith(utm, 1);
    }));

    it('should track user contactability status when user login', fakeAsync(() => {
        initBootstrapper();

        (userServiceMock.events as Subject<UserEvent>).next(new UserLoginEvent());

        expect(trackingServiceProviderMock.updateUserContactabilityStatus).toHaveBeenCalled();
    }));

    it('do nothing if tracking is disabled', () => {
        trackingConfigMock.isEnabled = false;
        fakeAsync(() => {
            initBootstrapper();

            (navigationServiceMock.locationChange as Subject<LocationChangeEvent>).next({
                id: 1,
                previousUrl: 'page1',
                nextUrl: 'page1',
            });
            (userServiceMock.events as Subject<UserEvent>).next(new UserLoginEvent());

            expect(trackingServiceProviderMock.setReferrer).not.toHaveBeenCalled();
            expect(trackingServiceProviderMock.updateUserContactabilityStatus).not.toHaveBeenCalled();
            expect(pageViewTrackingServiceMock.trackPageView).not.toHaveBeenCalled();
            expect(trackingServiceProviderMock.triggerEvent).not.toHaveBeenCalled();
        });
        trackingConfigMock.isEnabled = true;
    });

    it('should initialize tag manager', fakeAsync(() => {
        initBootstrapper();

        expect(tagManagerServiceMock.init).toHaveBeenCalledTimes(1);
    }));

    it('should store the utm values on app init and tracks the values on locationChange', fakeAsync(() => {
        const navigationId = 44;

        const utm = {
            utm_campaign: 'A',
            utm_content: 'b',
            utm_medium: 'C',
            utm_source: '1',
            utm_term: '22o',
        } as Utm;
        jest.spyOn(utmServiceMock, 'parseFromUrl').mockReturnValue(utm);

        initBootstrapper();

        (navigationServiceMock.locationChange as Subject<LocationChangeEvent>).next({
            id: navigationId,
            previousUrl: 'page1',
            nextUrl: 'page2',
        });
        expect(pageViewTrackingServiceMock.trackPageView).toHaveBeenCalledWith(utm, navigationId);
    }));

    it('should put landscape orientation into data layer when in landscape mode', fakeAsync(() => {
        initBootstrapper();

        Object.defineProperty(deviceServiceMock, 'currentOrientation', {
            value: 'portrait',
        });

        (deviceServiceMock.orientation as BehaviorSubject<'portrait' | 'landscape'>).next('landscape');

        expect(trackingServiceProviderMock.updateDataLayer).toHaveBeenCalledWith({
            'browser.orientation': 'landscape',
        });
    }));

    it('should put portrait orientation into data layer when in portrait mode', fakeAsync(() => {
        initBootstrapper();

        Object.defineProperty(deviceServiceMock, 'currentOrientation', {
            value: 'landscape',
        });

        (deviceServiceMock.orientation as BehaviorSubject<'portrait' | 'landscape'>).next('portrait');

        expect(trackingServiceProviderMock.updateDataLayer).toHaveBeenCalledWith({
            'browser.orientation': 'portrait',
        });
    }));
});
