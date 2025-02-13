import { TestBed } from '@angular/core/testing';

import { CookieService, DeviceService, NativeAppService, NavigationService, Page, UserService, WINDOW } from '@frontend/vanilla/core';
import { BalancePropertiesConfig, BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { MockProvider } from 'ng-mocks';

import { DefaultPageViewDataProvider } from '../src/page-view-data-provider';
import { TrackingValueGettersService } from '../src/tracking-value-getters.service';
import { TrackingConfig } from '../src/tracking.client-config';
import { BalancePropertiesConfigMock } from './mocks/balance-properties-config.mock';
import { BalancePropertiesServiceMock } from './mocks/balance-properties-service.mock';
import { CookieServiceMock } from './mocks/cookie-service.mock';
import { DeviceServiceMock } from './mocks/device-service.mock';
import { NativeAppServiceMock } from './mocks/native-app-service.mock';
import { NavigationServiceMock } from './mocks/navigation-service.mock';
import { PageMock } from './mocks/page.mock';
import { TrackingConfigMock } from './mocks/tracking-config.mock';
import { UserServiceMock } from './mocks/user-service.mock';
import { WindowMock } from './mocks/window.mock';

let service: DefaultPageViewDataProvider;
let navigationServiceMock: typeof NavigationServiceMock;
let pageMock: typeof PageMock;
let spy: jest.Mock;
let valueGetterService: TrackingValueGettersService;
let nativeAppServiceMock: typeof NativeAppServiceMock;
let cookieServiceMock: typeof CookieServiceMock;

const setupLocation = (host: string, path: string, query: string, hash: string): void => {
    const location = navigationServiceMock.location;
    location.url = () => `/${path}?${query}#${hash}`;
    location.absUrl = () => `http://${host}/${path}?${query}#${hash}`;
    location.host = () => host;
    location.path = () => `/${path}`;
};

const init = (): void => {
    navigationServiceMock = NavigationServiceMock;
    pageMock = PageMock;
    cookieServiceMock = CookieServiceMock;
    nativeAppServiceMock = NativeAppServiceMock;

    jest.spyOn(cookieServiceMock, 'get').mockReturnValue('213');

    setupLocation('test.me', 'en/one', 'foo=bar', 'abc=4');

    pageMock.lang = 'selected-page-language';

    TestBed.configureTestingModule({
        providers: [
            DefaultPageViewDataProvider,
            TrackingValueGettersService,
            MockProvider(NavigationService, navigationServiceMock),
            MockProvider(Page, pageMock),
            MockProvider(CookieService, cookieServiceMock),
            MockProvider(NativeAppService, nativeAppServiceMock),
            MockProvider(TrackingConfig, TrackingConfigMock),
            MockProvider(DeviceService, DeviceServiceMock),
            MockProvider(BalancePropertiesService, BalancePropertiesServiceMock),
            MockProvider(UserService, UserServiceMock),
            MockProvider(BalancePropertiesConfig, BalancePropertiesConfigMock),
            {
                provide: WINDOW,
                useValue: {
                    ...WindowMock,
                    location: {
                        ...WindowMock.location,
                        href: 'http://bwin.com/en/path',
                    },
                },
            },
        ],
    });

    valueGetterService = TestBed.inject(TrackingValueGettersService);
    valueGetterService.setReferrer('http://www.google.com/');
    service = TestBed.inject(DefaultPageViewDataProvider);
    spy = jest.fn();
};

describe('DefaultPageViewDataProvider', () => {
    beforeEach(init);

    it('should provide page data', () => {
        service.getData().subscribe(spy);

        expect(spy).toHaveBeenCalledWith({
            'page.referrer': 'http://www.google.com/',
            'page.url': 'http://test.me/en/one?foo=bar#abc=4',
            'page.host': 'test.me',
            'page.pathQueryAndFragment': 'en/one?foo=bar#abc=4',
            'page.name': 'en/one',
        });
    });

    it('should provide extra page data for terminal', () => {
        jest.spyOn(valueGetterService['nativeAppService'], 'isTerminal', 'get').mockReturnValue(true);

        service.getData().subscribe(spy);

        expect(spy).toHaveBeenCalledWith({
            'page.referrer': 'http://www.google.com/',
            'page.url': 'http://test.me/en/one?foo=bar#abc=4',
            'page.host': 'test.me',
            'page.pathQueryAndFragment': 'en/one?foo=bar#abc=4',
            'page.name': 'en/one',
            'page.terminalId': '213',
            'page.terminalType': 'unknown',
            'page.shopId': '213',
        });
    });

    describe('page name', () => {
        it('should remove current language from current path', () => {
            navigationServiceMock.location.path = () => '/en/pageName';
            valueGetterService['page'].lang = 'en';

            service.getData().subscribe(spy);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    'page.name': 'pageName',
                }),
            );
        });

        it('should return "" when path contain only language', () => {
            navigationServiceMock.location.path = () => '/en';
            valueGetterService['page'].lang = 'en';

            service.getData().subscribe(spy);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    'page.name': '',
                }),
            );
        });

        it('should return "" for root', () => {
            navigationServiceMock.location.path = () => '/';

            service.getData().subscribe(spy);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    'page.name': '',
                }),
            );
        });

        it('should return full path for url without language part', () => {
            navigationServiceMock.location.path = () => '/site/version';

            service.getData().subscribe(spy);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    'page.name': 'site/version',
                }),
            );
        });
    });

    describe('removeNotTrackedQueryStrings()', () => {
        beforeEach(() => {
            setupLocation('test.me', 'en/one', 'sessionKey=567&secretQuery=987&foo=bar&sessionKey=123', 'abc=4');
            valueGetterService.setReferrer('http://www.google.com/?secretQuery=7777');
        });

        it('should remove not tracked query string keys from all tracked URLs - for data layer', () => {
            service.getData().subscribe(spy);

            expect(spy).toHaveBeenCalledWith({
                'page.referrer': 'http://www.google.com/',
                'page.url': 'http://test.me/en/one?foo=bar#abc=4',
                'page.host': 'test.me',
                'page.pathQueryAndFragment': 'en/one?foo=bar#abc=4',
                'page.name': 'en/one',
            });
        });
    });

    describe('utm tracking data', () => {
        beforeEach(() => {
            setupLocation('test.me', 'en/one', 'sessionKey=567&secretQuery=987&foo=bar&sessionKey=123', 'abc=4');
            valueGetterService.setReferrer('http://www.google.com/?secretQuery=7777');
        });

        it('should remove not tracked query string keys from all tracked URLs - for data layer', () => {
            service
                .getData({
                    navigationId: 12,
                    utm: {
                        utm_campaign: 'A',
                        utm_content: 'b',
                        utm_medium: 'C',
                        utm_source: '1',
                        utm_term: '22o',
                        utm_keyword: 'x',
                    },
                })
                .subscribe(spy);

            expect(spy).toHaveBeenCalledWith({
                'page.referrer': 'http://www.google.com/',
                'page.url': 'http://test.me/en/one?foo=bar#abc=4',
                'page.host': 'test.me',
                'page.pathQueryAndFragment': 'en/one?foo=bar#abc=4',
                'page.name': 'en/one',
                'utms.campaign': 'A',
                'utms.content': 'b',
                'utms.medium': 'C',
                'utms.source': '1',
                'utms.term': '22o',
                'utms.keyword': 'x',
            });
        });
    });
});
