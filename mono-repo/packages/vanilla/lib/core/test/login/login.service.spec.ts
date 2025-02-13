import { TestBed } from '@angular/core/testing';

import { LoginService2 } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../browser/cookie.mock';
import { PageMock } from '../browsercommon/page.mock';
import { NativeAppConfigMock, NativeAppServiceMock } from '../native-app/native-app.mock';
import { NavigationServiceMock } from '../navigation/navigation.mock';

describe('LoginService2', () => {
    let service: LoginService2;
    let navigationServiceMock: NavigationServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let pageMock: PageMock;
    let cookieServiceMock: CookieServiceMock;
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    let nativeAppConfigMock: NativeAppConfigMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        pageMock = MockContext.useMock(PageMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        nativeAppConfigMock = MockContext.useMock(NativeAppConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoginService2],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(LoginService2);
    });

    describe('goTo()', () => {
        beforeEach(() => {
            pageMock.loginUrl = '/en/mobilelogin/login';
        });

        it('should send CCB event', async () => {
            nativeAppConfigMock.sendOpenLoginDialogEvent = true;
            await service.goTo();
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: 'OPEN_LOGIN_DIALOG' });
        });

        it('should navigate to login', async () => {
            const options = { forceReload: true };
            navigationServiceMock.goTo.and.resolveTo();
            await service.goTo(options);
            expect(navigationServiceMock.goToNativeApp).toHaveBeenCalledTimes(0);
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(pageMock.loginUrl, options);
        });

        it('should navigate to login and append "rurlauth" parameter and store location when options.referrerNeedsLoggedInUser', async () => {
            const referrer = 'https://referrer';
            navigationServiceMock.location.url.and.returnValue(referrer);
            navigationServiceMock.goTo.and.resolveTo();
            const options = { referrerNeedsLoggedInUser: true };
            await service.goTo(options);
            expect(navigationServiceMock.goToNativeApp).toHaveBeenCalledTimes(0);
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(pageMock.loginUrl + '?rurlauth=1', options);
        });

        it('should navigate to native app when isNative and not ignoreSpecialNativeHandling', async () => {
            nativeAppServiceMock.isNativeApp = true;
            await service.goTo({ ignoreSpecialNativeHandling: false, culture: 'de' });
            expect(navigationServiceMock.goTo).toHaveBeenCalledTimes(0);
            expect(navigationServiceMock.goToNativeApp).toHaveBeenCalledWith({
                storeMessageQueue: true,
                ignoreSpecialNativeHandling: false,
                culture: 'de',
            });
        });

        it('should navigate to login when isNative and ignoreSpecialNativeHandling', async () => {
            nativeAppServiceMock.isNativeApp = true;
            const options = { ignoreSpecialNativeHandling: true };
            navigationServiceMock.goTo.and.resolveTo();
            await service.goTo(options);
            expect(navigationServiceMock.goToNativeApp).toHaveBeenCalledTimes(0);
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(pageMock.loginUrl, options);
        });

        it('should navigate to login and append "msg" parameter when options.loginMessageKey', async () => {
            navigationServiceMock.goTo.and.resolveTo();
            const options = { loginMessageKey: 'messagekey', cancelUrl: 'https://netflix.com' };
            await service.goTo(options);
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(
                pageMock.loginUrl + '?cancelUrl=https%3A%2F%2Fnetflix.com&msg=messagekey',
                options,
            );
        });
    });

    describe('shouldPrefillUsername', () => {
        it('should set cookie with future expiration when value is "true"', () => {
            service.shouldPrefillUsername(true);
            const tenYearsInTheFuture = new Date().getFullYear() + 10;

            expect(cookieServiceMock.put).toHaveBeenCalledWith('pf-u', '' + true, { expires: jasmine.any(Date) });

            const cookieOptions = cookieServiceMock.put.calls.mostRecent().args[2] as { expires: Date };
            expect(cookieOptions.expires.getFullYear()).toBe(tenYearsInTheFuture);
        });

        it('should remove cookie when value is false', () => {
            service.shouldPrefillUsername(false);

            expect(cookieServiceMock.remove).toHaveBeenCalledWith('pf-u');
        });
    });
});
