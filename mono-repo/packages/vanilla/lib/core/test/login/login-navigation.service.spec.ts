import { TestBed } from '@angular/core/testing';

import { LoginNavigationService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { ProductHomepagesConfigMock } from '../../../core/test/products/product-homepages.client-config.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { PageMock } from '../browsercommon/page.mock';
import { LastKnownProductConfigMock } from '../last-known-product/last-known-product-config.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../navigation/navigation.mock';
import { HomeServiceMock } from './home-service.mock';
import { LoginService2Mock } from './login-service.mock';
import { LoginStoreServiceMock } from './login-store.mock';

describe('LoginNavigationService', () => {
    let service: LoginNavigationService;
    let userServiceMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let pageMock: PageMock;
    let urlServiceMock: UrlServiceMock;
    let productHomepagesConfigMock: ProductHomepagesConfigMock;
    let loginStoreServiceMock: LoginStoreServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        MockContext.useMock(LoginService2Mock);
        MockContext.useMock(HomeServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        pageMock = MockContext.useMock(PageMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        productHomepagesConfigMock = MockContext.useMock(ProductHomepagesConfigMock);
        MockContext.useMock(LastKnownProductConfigMock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoginNavigationService],
        });
    });

    beforeEach(() => {
        urlServiceMock.current.and.returnValue({ culture: pageMock.lang });
        service = TestBed.inject(LoginNavigationService);
    });

    it('should not be undefined or null', () => {
        expect(service).not.toBeUndefined();
        expect(service).not.toBeNull();
    });

    it('goToRegistration() should navigate to registration with options', () => {
        productHomepagesConfigMock.portal = 'http://www.acme.com';
        const options = { appendReferrer: true, replace: false, storeMessageQueue: false };
        service.goToRegistration(options);
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith('http://www.acme.com/mobileportal/register', options);
    });

    it('goToRegistration() should navigate to registration url', () => {
        productHomepagesConfigMock.portal = 'http://www.acme.com';
        const options = { appendReferrer: true, replace: false, storeMessageQueue: false };
        service.goToRegistration(options, 'http://www.acme.com/test');
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith('http://www.acme.com/test', options);
    });

    describe('goToStoredReturnUrl()', () => {
        let parsedUrlMock: ParsedUrlMock;

        beforeEach(() => {
            parsedUrlMock = new ParsedUrlMock();
            parsedUrlMock.culture = userServiceMock.lang;
            urlServiceMock.parse.withArgs('en/return/url').and.callFake(() => parsedUrlMock);
        });

        it('should navigate to returnUrl from loginStore with current culture', () => {
            loginStoreServiceMock.ReturnUrlFromLogin = `${pageMock.lang}/return/url`;
            service.goToStoredReturnUrl();

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrlMock, {
                replace: true,
                culture: 'en',
            });
        });
    });

    describe('storeReturnUrlFromQuerystring()', () => {
        const returnUrl = 'https://acme.com/';
        let parsedUrlMock: ParsedUrlMock;

        beforeEach(() => {
            parsedUrlMock = new ParsedUrlMock();
            parsedUrlMock.culture = userServiceMock.lang;
            parsedUrlMock.isSameTopDomain = true;
            urlServiceMock.parse.and.callFake(() => parsedUrlMock);
        });

        it('should not store when null', () => {
            service.storeReturnUrlFromQuerystring();
            expect(loginStoreServiceMock.ReturnUrlFromLogin).toBeUndefined();
        });

        it('should store value of querystring "ReturnUrl"', () => {
            navigationServiceMock.location.search.set('ReturnUrl', returnUrl);
            service.storeReturnUrlFromQuerystring();
            expect(loginStoreServiceMock.ReturnUrlFromLogin).toBe(returnUrl);
        });

        const disallowed = ['javascript', 'src', 'onerror', '<', '>', encodeURIComponent('<'), encodeURIComponent('>')];

        Object.keys(disallowed).forEach((key) => {
            it('should not store value of querystring "ReturnUrl" when containing "' + (disallowed as any)[key] + '"', () => {
                const rurl = '/some/url/' + (disallowed as any)[key];
                navigationServiceMock.location.search.set('ReturnUrl', rurl);
                service.storeReturnUrlFromQuerystring();
                expect(loginStoreServiceMock.ReturnUrlFromLogin).toBeUndefined();
            });
        });

        it('should not store value of querystring when not same top domain', () => {
            const returnUrl = 'https://acme.com/';
            parsedUrlMock.isSameTopDomain = false;
            urlServiceMock.parse.and.callFake(() => parsedUrlMock);
            navigationServiceMock.location.search.set('rurl', returnUrl);
            service.storeReturnUrlFromQuerystring();
            expect(loginStoreServiceMock.ReturnUrlFromLogin).toBeUndefined();
        });
    });

    describe('storeReturnUrl', () => {
        const returnUrl = 'https://acme.com';

        it('should store absUrl', () => {
            navigationServiceMock.location.absUrl.and.returnValue(returnUrl);
            service.storeReturnUrl();

            expect(loginStoreServiceMock.ReturnUrlFromLogin).toBe(returnUrl);
        });

        it('should NOT store absUrl if already stored', () => {
            navigationServiceMock.location.absUrl.and.returnValue(returnUrl);
            service.storeReturnUrl();

            navigationServiceMock.location.absUrl.and.returnValue('https://new-acme.com/');
            service.storeReturnUrl();

            expect(loginStoreServiceMock.ReturnUrlFromLogin).toBe(returnUrl);
        });

        it('should NOT store absUrl if URL contains "/login"', () => {
            navigationServiceMock.location.absUrl.and.returnValue(returnUrl + '/login');
            service.storeReturnUrl();

            expect(loginStoreServiceMock.ReturnUrlFromLogin).toBeUndefined();
        });
    });
});
