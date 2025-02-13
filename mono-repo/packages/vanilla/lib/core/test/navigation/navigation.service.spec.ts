import { TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { NavigationEnd } from '@angular/router';

import { LocationChangeEvent, NavigationService, UrlService, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { RouterMock } from '../../../core/test/router.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { PublicHeaderServiceMock } from '../../../features/header/test/header.mock';
import { getBaseUrl } from '../../../test/test-utils';
import { CookieServiceMock } from '../browser/cookie.mock';
import { PageMock } from '../browsercommon/page.mock';
import { LoadingIndicatorServiceMock } from '../http/loading-indicator.mock';
import { LastKnownProductServiceMock } from '../last-known-product/last-known-product.mock';
import { LoginStoreServiceMock } from '../login/login-store.mock';
import { PostLoginServiceMock } from '../login/post-login.service.mock';
import { RememberMeServiceMock } from '../login/remember-me/remember-me.service.mock';
import { MessageQueueServiceMock } from '../messages/message-queue.mock';
import { NativeAppConfigMock, NativeAppServiceMock } from '../native-app/native-app.mock';
import { LocationMock } from './location.mock';

describe('NavigationService', () => {
    let service: NavigationService;
    let windowMock: WindowMock;
    let pageMock: PageMock;
    let nativeAppConfigMock: NativeAppConfigMock;
    let cookieServiceMock: CookieServiceMock;
    let urlService: UrlService;
    let routerMock: RouterMock;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let loadingIndicatorServiceMock: LoadingIndicatorServiceMock;
    let userServiceMock: UserServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let postLoginServiceMock: PostLoginServiceMock;
    let loginStoreServiceMock: LoginStoreServiceMock;

    let currentHref: string;

    beforeEach(() => {
        windowMock = new WindowMock();
        MockContext.useMock(LocationMock);
        pageMock = MockContext.useMock(PageMock);
        routerMock = MockContext.useMock(RouterMock);
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        loadingIndicatorServiceMock = MockContext.useMock(LoadingIndicatorServiceMock);
        MockContext.useMock(LastKnownProductServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        nativeAppConfigMock = MockContext.useMock(NativeAppConfigMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        MockContext.useMock(PublicHeaderServiceMock);
        MockContext.useMock(RememberMeServiceMock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);
        postLoginServiceMock = MockContext.useMock(PostLoginServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                UrlService,
                NavigationService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(NavigationService);
        urlService = TestBed.inject(UrlService);
        pageMock.domain = '.bwin.com';
        pageMock.loadingIndicator = {
            externalNavigationDelay: 666,
            defaultDelay: 222,
            spinnerContent: 'spinner',
            disabledUrlPattern: '',
        };
        windowMock.location.href = 'http://m.bwin.com:8181/en/mobileportal/register?a=x#f';
        service.init();
    });

    describe('location', () => {
        it('should provide current parsed url', () => {
            // test all properties of ImmutableParsedUrl
            expect(service.location.absUrl()).toBe('http://m.bwin.com:8181/en/mobileportal/register?a=x#f');
            expect(service.location.url()).toBe('/en/mobileportal/register?a=x#f');
            expect(service.location.path()).toBe('/en/mobileportal/register');
            expect(service.location.baseUrl()).toBe('http://m.bwin.com:8181');
            expect(service.location.host()).toBe('m.bwin.com:8181');
            expect(service.location.culture).toBe('en');
            expect(service.location.hash).toBe('f');
            expect(service.location.hostname).toBe('m.bwin.com');
            expect(service.location.pathname).toBe('/en/mobileportal/register');
            expect(service.location.port).toBe('8181');
            expect(service.location.protocol).toBe('http');
            expect(service.location.search.toString()).toBe('a=x');
            expect(service.location.search.get('a')).toBe('x');
            expect(service.location.search.getAll('a')).toEqual(['x']);
            expect(service.location.search.has('a')).toBeTrue();
            expect(service.location.isSameTopDomain).toBeTrue();
            expect(service.location.isSameHost).toBeTrue();
        });

        it('should cache the url until location changes', () => {
            const location = service.location;
            expect(location.absUrl()).toBe('http://m.bwin.com:8181/en/mobileportal/register?a=x#f');
            expect(service.location).toBe(location);

            windowMock.location.href = 'http://m.bwin.com:8181/en/mobillogin/login';
            expect(service.location.absUrl()).toBe('http://m.bwin.com:8181/en/mobillogin/login');
            expect(service.location).not.toBe(location);
        });
    });

    describe('goToNativeApp', () => {
        it('should navigate to bwin scheme url with username and sso', () => {
            userServiceMock.ssoToken = 'sso';

            service.goToNativeApp();

            expect(windowMock.location.href).toBe('bwin://user/sso');
        });

        it('should navigate to playtech scheme url with accountId and externalToken if enabled', () => {
            userServiceMock.accountId = '123123123';
            nativeAppServiceMock.htcmdSchemeEnabled = true;
            cookieServiceMock.getObject.withArgs('mobileLogin.PostLoginValues').and.returnValue({ tempPartnerToken: '3Hn60bFJM2ng123123123' });
            service.goToNativeApp();

            expect(windowMock.location.href).toBe('htcmd:login?username=123123123&password=3Hn60bFJM2ng123123123&type=4');
        });

        it('should replace history if specified', () => {
            windowMock.location.href = 'http://m.bwin.com/page';
            userServiceMock.ssoToken = 'sso';

            service.goToNativeApp({ replace: true });

            expect(windowMock.location.replace).toHaveBeenCalledWith('bwin://user/sso');
        });

        it('should navigate to bwin scheme url for unauthenticated user', () => {
            userServiceMock.isAuthenticated = false;

            service.goToNativeApp();

            expect(windowMock.location.href).toBe('bwin://noSso');
        });

        it('should navigate to bwin scheme with superCookie', () => {
            cookieServiceMock.get.withArgs('superCookie').and.returnValue('superCookie');
            userServiceMock.ssoToken = 'sso';
            service.goToNativeApp();

            expect(windowMock.location.href).toBe('bwin://user/sso/superCookie');
        });

        it('should navigate to bwin scheme with noSuperCookie and noPartnerSessionId', () => {
            userServiceMock.ssoToken = 'sso';
            nativeAppConfigMock.partnerSessionIdSupported = true;
            service.goToNativeApp();

            expect(windowMock.location.href).toBe('bwin://user/sso/noSuperCookie/noPartnerSessionId');
        });

        it('should navigate to bwin scheme with noSuperCookie and PartnerSessionId', () => {
            userServiceMock.ssoToken = 'sso';
            cookieServiceMock.get.withArgs('superCookie').and.returnValue(undefined);
            cookieServiceMock.get.withArgs('mobileLogin.PostLoginValues').and.returnValue('{"partnerSessionUid": "partner_id"}');
            nativeAppConfigMock.partnerSessionIdSupported = true;

            service.goToNativeApp();

            expect(windowMock.location.href).toBe('bwin://user/sso/noSuperCookie/partner_id');
        });

        it('should send POST_LOGIN event', () => {
            cookieServiceMock.getObject.and.returnValue({ test: 'yeah' });
            loginStoreServiceMock.PostLoginValues = { partnerId: '2256' };
            nativeAppConfigMock.sendPostLoginOnGoToNative = true;
            service.goToNativeApp();

            expect(postLoginServiceMock.sendPostLoginEvent).toHaveBeenCalledWith({ partnerId: '2256' }, { test: 'yeah' });
        });
    });

    describe('goTo()', () => {
        it('should do a full page reload when different host', () => {
            setCurrentHref('http://sports.m.bwin.com:8181/');

            const urlObject = urlService.parse('http://m.bwin.com:8181/en/mobileportal/register');

            service.goTo(urlObject);

            expectUrlChange('http://m.bwin.com:8181/en/mobileportal/register', ['reload', 'loading-indicator']);
        });

        it('should preserve previous query string params', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings?test=123');
            service.init();

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register?newParam=abc', {
                queryParamsHandling: 'preserve',
            });

            expectUrlChange('/en/mobileportal/register?test=123');
        });

        it('should merge query string params', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings?test=123');
            service.init();

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register?newParam=abc&hide=true', {
                queryParamsHandling: 'merge',
            });

            expectUrlChange('/en/mobileportal/register?newParam=abc&hide=true&test=123');
        });

        it('should do a full page reload when different language then current language', () => {
            setCurrentHref('http://m.bwin.com:8181/es');
            pageMock.lang = 'es';

            const urlObject = urlService.parse('http://m.bwin.com:8181/en/mobileportal/register');

            service.goTo(urlObject);

            expectUrlChange('http://m.bwin.com:8181/en/mobileportal/register', ['reload']);
        });

        it('should not do a full page reload when not needed', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register');

            expectUrlChange('/en/mobileportal/register');
        });

        it('should do a full page reload when given a 3rd party/external url', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo(
                'https://cashier147.ivycomptech.co.in:8181/deposit/depositOptionsMerchant.action?sessionKey=somekey&LANG_ID=en&parent=someparent',
            );

            expectUrlChange(
                'https://cashier147.ivycomptech.co.in:8181/deposit/depositOptionsMerchant.action?sessionKey=somekey&LANG_ID=en&parent=someparent',
                ['reload', 'loading-indicator'],
            );
        });

        it('should attach a referrer rurl querystring parameter when appendReferrer parameter is set', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register', {
                appendReferrer: true,
            });

            expectUrlChange('/en/mobileportal/register?rurl=http:%2F%2Fm.bwin.com:8181%2Fen%2Fmobileportal%2Fsettings');
        });

        it('should attach the supplied custom return url as rurl querystring parameter when appendReferrer parameter is set as string', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register', {
                appendReferrer: 'http://casino.m.bwin.com:8181/en/p/imprint',
            });

            expectUrlChange('/en/mobileportal/register?rurl=http:%2F%2Fcasino.m.bwin.com:8181%2Fen%2Fp%2Fimprint');
        });

        it('should do a full page reload when forceReload parameter is set regardless if it is needed or not', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register', {
                forceReload: true,
            });

            expectUrlChange('http://m.bwin.com:8181/en/mobileportal/register', ['reload']);
        });

        it('should replace the current url in the browser history if replace paramter is set', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register', {
                replace: true,
            });

            expectUrlChange('/en/mobileportal/register', ['replace']);
        });

        it('should replace the current url in the browser history if replace paramter is set and a full page reload is needed', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/de/mobileportal/register', {
                replace: true,
            });

            expectUrlChange('http://m.bwin.com:8181/de/mobileportal/register', ['reload', 'replace']);
        });

        it('should store messages if storeMessageQueue parameter is set and is a full reload navigation', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register', {
                storeMessageQueue: true,
                forceReload: true,
            });

            expectUrlChange('http://m.bwin.com:8181/en/mobileportal/register', ['reload', 'store']);
        });

        it('should append sso and proper GA id format', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');
            userServiceMock.isAuthenticated = true;
            userServiceMock.ssoToken = 'foobar';
            windowMock.ga = { getAll: () => [{ get: () => 'GA1.1.54321.123456' }] };
            // www.google.com is already in pageMock.singleSignOnDomains

            service.goTo('http://www.google.com/search');

            expectUrlChange('http://www.google.com/search?parentURL=m.bwin.com:8181%2Fen&gavisitid=54321.123456&_sso=foobar', [
                'reload',
                'loading-indicator',
            ]);
        });

        it('should store messages if storeMessageQueue parameter is set and is a SPA navigation', fakeAsync(() => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register', {
                storeMessageQueue: true,
            });

            expectUrlChange('/en/mobileportal/register', ['store']);
        }));

        it('should skip location change if skipLocationChange parameter is set and is a SPA navigation', fakeAsync(() => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register', {
                skipLocationChange: true,
            });

            expectUrlChange('/en/mobileportal/register', ['skip-location-change']);
        }));

        it('should stop loading indicator if page is not unloaded', fakeAsync(() => {
            setCurrentHref('http://sports.m.bwin.com:8181/');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register');

            expect(loadingIndicatorServiceMock.start).toHaveBeenCalledWith({ blockScrolling: true, delay: 666 });

            tick(5000);

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        }));

        it('should change culture and force reload if url has a different culture', () => {
            setCurrentHref('http://m.bwin.com:8181/en/mobileportal/settings');

            service.goTo('http://m.bwin.com:8181/en/mobileportal/register', { culture: 'de' });

            expectUrlChange('http://m.bwin.com:8181/de/mobileportal/register', ['reload']);
        });

        it('should trigger attempted navigation event', () => {
            const spy = jasmine.createSpy('spy');
            service.attemptedNavigation.subscribe(spy);

            service.goTo('http://m.bwin.com/en/mobileportal/register');

            const parsedUrl = urlService.parse('http://m.bwin.com/en/mobileportal/register');
            expect(spy).toHaveBeenCalledWith(parsedUrl);
        });

        it('should return a promise', fakeAsync(() => {
            const spy = jasmine.createSpy('spy');

            setCurrentHref('http://sports.m.bwin.com:8181/');

            service.goTo('http://sports.m.bwin.com:8181/en/sports').then(spy);

            routerMock.navigateByUrl.resolve();
            tick();

            expect(spy).toHaveBeenCalled();
        }));

        it('should not resolve promise when full reloading', fakeAsync(() => {
            const spy = jasmine.createSpy('spy');

            setCurrentHref('http://sports.m.bwin.com:8181/');

            service.goTo('http://m.bwin.com:8181/en/sports').then(spy);

            tick();

            expect(spy).not.toHaveBeenCalled();
            flush();
        }));
    });

    describe('locationChange', () => {
        it('should publish events when router publishes NavigationEnd event', () => {
            const spy = jasmine.createSpy('spy');
            service.locationChange.subscribe(spy);

            windowMock.location.href = '/en/nurl';
            routerMock.events.next(new NavigationEnd(2, 'x', 'y'));
            expect(spy).toHaveBeenCalledWith(<LocationChangeEvent>{
                id: 2,
                previousUrl: 'http://m.bwin.com:8181/en/mobileportal/register?a=x#f',
                nextUrl: `${getBaseUrl()}/en/nurl`,
            });

            windowMock.location.href = '/en/nurl2';
            routerMock.events.next(new NavigationEnd(3, 'x', 'y'));
            expect(spy).toHaveBeenCalledWith(<LocationChangeEvent>{
                id: 3,
                previousUrl: `${getBaseUrl()}/en/nurl`,
                nextUrl: `${getBaseUrl()}/en/nurl2`,
            });
        });
    });

    function setCurrentHref(url: string) {
        windowMock.location.href = url;
        currentHref = url;
    }

    function expectUrlChange(url: string, actions?: string[]) {
        actions = actions || [];
        const replace = actions.indexOf('replace') !== -1;
        const reload = actions.indexOf('reload') !== -1;
        const storeMessages = actions.indexOf('store') !== -1;
        const showLoadingIndicator = actions.indexOf('loading-indicator') !== -1;
        const skipLocationChange = actions.indexOf('skip-location-change') !== -1;

        if (showLoadingIndicator) {
            expect(loadingIndicatorServiceMock.start).toHaveBeenCalledWith({ blockScrolling: true, delay: 666 });
        } else {
            expect(loadingIndicatorServiceMock.start).not.toHaveBeenCalled();
        }

        if (!reload) {
            expect(routerMock.navigateByUrl).toHaveBeenCalledWith(url, { replaceUrl: replace, skipLocationChange });
        }

        if (reload && !replace) {
            expect(windowMock.location.href).toBe(url);
        } else {
            expect(windowMock.location.href).toBe(currentHref);
        }

        if (reload && replace) {
            expect(windowMock.location.replace).toHaveBeenCalledWith(url);
        } else {
            expect(windowMock.location.replace).not.toHaveBeenCalled();
        }

        if (!storeMessages) {
            expect(messageQueueServiceMock.storeMessages).not.toHaveBeenCalled();
        } else if (reload && storeMessages) {
            expect(messageQueueServiceMock.storeMessages).toHaveBeenCalled();
        } else if (!reload && storeMessages) {
            expect(messageQueueServiceMock.storeMessages).toHaveBeenCalled();

            routerMock.navigateByUrl.resolve();
            tick();

            expect(messageQueueServiceMock.restoreMessages).toHaveBeenCalled();
        }
    }
});
