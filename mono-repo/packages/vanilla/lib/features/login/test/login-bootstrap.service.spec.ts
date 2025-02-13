import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    CookieName,
    LOGIN_RESPONSE_HANDLER_HOOK,
    LoginMessageKey,
    MenuAction,
    NativeEventType,
    ON_LOGIN_NAVIGATION_PROVIDER,
    UserLogoutEvent,
} from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { LoginService2Mock } from '../../../core/test/login/login-service.mock';
import { LoginStoreServiceMock } from '../../../core/test/login/login-store.mock';
import { LoginNavigationServiceMock } from '../../../core/test/login/navigation-service.mocks';
import { PostLoginServiceMock } from '../../../core/test/login/post-login.service.mock';
import { RememberMeConfigMock } from '../../../core/test/login/remember-me/remember-me.config.mock';
import { RememberMeServiceMock } from '../../../core/test/login/remember-me/remember-me.service.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { ClaimsServiceMock } from '../../../core/test/user/claims.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LoginBootstrapService } from '../src/login-bootstrap.service';
import {
    BetstationLoginErrorOverlayServiceMock,
    BetstationLoginOverlayServiceMock,
    LoginConfigMock,
    LoginContentMock,
    LoginDialogServiceMock,
    LoginIntegrationServiceMock,
    LoginMessagesServiceMock,
    LoginNavigationProviderMock,
    LoginNavigationProvidersServiceMock,
    LoginResponseHandlerHookMock,
    LoginResponseHandlerServiceMock,
    LoginServiceMock,
} from './login.mocks';

describe('LoginBootstrapService', () => {
    let service: LoginBootstrapService;
    let betstationLoginOverlayService: BetstationLoginOverlayServiceMock;
    let claimsService: ClaimsServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let errorOverlayService: BetstationLoginErrorOverlayServiceMock;
    let eventsService: EventsServiceMock;
    let hookMock: LoginResponseHandlerHookMock;
    let logger: LoggerMock;
    let loginConfigMock: LoginConfigMock;
    let loginContentMock: LoginContentMock;
    let loginDialogServiceMock: LoginDialogServiceMock;
    let loginIntegrationServiceMock: LoginIntegrationServiceMock;
    let loginMessagesServiceMock: LoginMessagesServiceMock;
    let loginNavigationProvidersServiceMock: LoginNavigationProvidersServiceMock;
    let loginNavigationServiceMock: LoginNavigationServiceMock;
    let loginResponseHandlerServiceMock: LoginResponseHandlerServiceMock;
    let loginService2Mock: LoginService2Mock;
    let loginServiceMock: LoginServiceMock;
    let loginStoreServiceMock: LoginStoreServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let navMock: LoginNavigationProviderMock;
    let userServiceMock: UserServiceMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let postLoginServiceMock: PostLoginServiceMock;

    beforeEach(() => {
        betstationLoginOverlayService = MockContext.useMock(BetstationLoginOverlayServiceMock);
        claimsService = MockContext.useMock(ClaimsServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        errorOverlayService = MockContext.useMock(BetstationLoginErrorOverlayServiceMock);
        eventsService = MockContext.useMock(EventsServiceMock);
        hookMock = MockContext.createMock(LoginResponseHandlerHookMock);
        logger = MockContext.useMock(LoggerMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        loginContentMock = MockContext.useMock(LoginContentMock);
        loginDialogServiceMock = MockContext.useMock(LoginDialogServiceMock);
        loginIntegrationServiceMock = MockContext.useMock(LoginIntegrationServiceMock);
        loginMessagesServiceMock = MockContext.useMock(LoginMessagesServiceMock);
        loginNavigationProvidersServiceMock = MockContext.useMock(LoginNavigationProvidersServiceMock);
        loginNavigationServiceMock = MockContext.useMock(LoginNavigationServiceMock);
        loginResponseHandlerServiceMock = MockContext.useMock(LoginResponseHandlerServiceMock);
        loginService2Mock = MockContext.useMock(LoginService2Mock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        navMock = MockContext.createMock(LoginNavigationProviderMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        MockContext.useMock(DeviceServiceMock);
        MockContext.useMock(RememberMeConfigMock);
        MockContext.useMock(RememberMeServiceMock);
        MockContext.useMock(AuthServiceMock);
        postLoginServiceMock = MockContext.useMock(PostLoginServiceMock);

        loginStoreServiceMock.PostLoginValues = 'postLoginValues';

        TestBed.configureTestingModule({
            providers: [
                LoginBootstrapService,
                MockContext.providers,
                { provide: ON_LOGIN_NAVIGATION_PROVIDER, useValue: navMock, multi: true },
                { provide: LOGIN_RESPONSE_HANDLER_HOOK, useValue: hookMock, multi: true },
            ],
        });

        navigationServiceMock.location = new ParsedUrlMock();
        navigationServiceMock.location.absUrl.and.returnValue('http://bla');
        navigationServiceMock.location.path.and.returnValue('test');
        claimsService.get.withArgs('accbusinessphase').and.returnValue('anonymous');
        loginConfigMock.showLoginSpinner = true;

        service = TestBed.inject(LoginBootstrapService);
    });

    beforeEach(fakeAsync(() => {
        service.onFeatureInit();
        loginConfigMock.whenReady.next();
        loginContentMock.whenReady.next();
        tick();
        loginIntegrationServiceMock.init.resolve();
    }));

    describe('onFeatureInit()', () => {
        it('should init', () => {
            expect(loginNavigationProvidersServiceMock.registerProviders).toHaveBeenCalledWith([navMock]);
            expect(loginResponseHandlerServiceMock.registerHooks).toHaveBeenCalledWith([hookMock]);
            expect(loginIntegrationServiceMock.init).toHaveBeenCalled();
            expect(dynamicLayoutServiceMock.setComponent).toHaveBeenCalledOnceWith('login_spinner', jasmine.anything());
            expect(loginServiceMock.logSuperCookie).toHaveBeenCalledWith('LoginBootstrap');
        });

        it('on UserLogoutEvent should remove "DisplayedInterceptors" cookie', () => {
            userServiceMock.triggerEvent(new UserLogoutEvent());
            expect(cookieServiceMock.remove).toHaveBeenCalledWith('DisplayedInterceptors');
            expect(loginStoreServiceMock.PostLoginValues).toEqual(null);
            expect(loginStoreServiceMock.LoginType).toBeNull();
            expect(cookieServiceMock.remove).toHaveBeenCalledWith(CookieName.AdditionalPostLoginOptions);
        });
    });

    describe('menu actions', () => {
        it('should be registered', () => {
            expect(menuActionsServiceMock.register).toHaveBeenCalledWith(MenuAction.GOTO_LOGIN, jasmine.any(Function));
            expect(menuActionsServiceMock.register).toHaveBeenCalledWith(MenuAction.GOTO_PRE_LOGIN, jasmine.any(Function));
            expect(menuActionsServiceMock.register).toHaveBeenCalledWith(MenuAction.LOGIN_AND_GOTO, jasmine.any(Function));
            expect(menuActionsServiceMock.register).toHaveBeenCalledWith(MenuAction.LOGOUT, jasmine.any(Function));
        });

        it('should handle `GOTO_LOGIN`', () => {
            const menuAction = getMenuActionCallback(MenuAction.GOTO_LOGIN);
            menuAction(undefined, undefined, undefined, {});

            expect(loginServiceMock.goToLogin).toHaveBeenCalledOnceWith({});
        });
    });

    describe('native events', () => {
        describe('LOGIN', () => {
            it('should autologin user on login event', () => {
                const loginParams = { username: 'u', password: 'p', birthDate: '1980-12-02', isTouchIDEnabled: true };
                nativeAppServiceMock.eventsFromNative.next({
                    eventName: NativeEventType.LOGIN,
                    parameters: loginParams,
                });

                expect(loginStoreServiceMock.ReturnUrlFromLogin).toEqual('http://bla');
                expect(loginServiceMock.autoLogin).toHaveBeenCalledOnceWith({
                    username: 'u',
                    password: 'p',
                    dateOfBirth: new Date('1980-12-02'),
                    isTouchIDEnabled: true,
                    isFaceIDEnabled: undefined,
                    rememberme: undefined,
                });
            });
        });

        describe('SSO_LOGIN', () => {
            it('should autologin user on login event', () => {
                const loginParams = { ssoToken: 'tokensso' };
                nativeAppServiceMock.eventsFromNative.next({
                    eventName: NativeEventType.SSO_LOGIN,
                    parameters: loginParams,
                });

                expect(loginStoreServiceMock.ReturnUrlFromLogin).toEqual('http://bla');
                expect(loginServiceMock.autoLogin).toHaveBeenCalledOnceWith({
                    ssoToken: 'tokensso',
                });
            });
        });

        describe('RETRIEVE_POST_LOGIN', () => {
            it('should send post login event if user authenticated', () => {
                cookieServiceMock.getObject.and.returnValue({ test: 'yeah' });
                loginStoreServiceMock.PostLoginValues = { partnerId: '2256' };
                nativeAppServiceMock.eventsFromNative.next({ eventName: NativeEventType.RETRIEVE_POST_LOGIN });

                expect(postLoginServiceMock.sendPostLoginEvent).toHaveBeenCalledWith({ partnerId: '2256' }, { test: 'yeah' });
            });

            it('should not send post login event if user not authenticated', () => {
                userServiceMock.isAuthenticated = false;
                nativeAppServiceMock.eventsFromNative.next({ eventName: NativeEventType.RETRIEVE_POST_LOGIN });

                expect(postLoginServiceMock.sendPostLoginEvent).not.toHaveBeenCalled();
            });
        });

        describe('OPEN_LOGIN_SCREEN', () => {
            it('should open login dialog with login entry message', () => {
                nativeAppServiceMock.eventsFromNative.next({
                    eventName: NativeEventType.OPEN_LOGIN_SCREEN,
                    parameters: { errorReason: 'faceid' },
                });

                expect(loginService2Mock.goTo).toHaveBeenCalledWith({
                    appendReferrer: true,
                    storeMessageQueue: true,
                    loginMessageKey: LoginMessageKey.FaceId,
                });
            });

            it('should open login dialog without login entry message', () => {
                nativeAppServiceMock.eventsFromNative.next({
                    eventName: NativeEventType.OPEN_LOGIN_SCREEN,
                });

                expect(loginService2Mock.goTo).toHaveBeenCalledWith({
                    appendReferrer: true,
                    storeMessageQueue: true,
                    loginMessageKey: undefined,
                });
            });

            it('should set login entry message when dialog is opened', () => {
                loginDialogServiceMock.opened = true;
                nativeAppServiceMock.eventsFromNative.next({
                    eventName: NativeEventType.OPEN_LOGIN_SCREEN,
                    parameters: { errorReason: 'faceid' },
                });

                expect(loginMessagesServiceMock.setLoginMessage).toHaveBeenCalledWith('faceid');
            });

            it('should set login entry message when login page is opened', () => {
                navigationServiceMock.location.path.and.returnValue('label/login');
                nativeAppServiceMock.eventsFromNative.next({
                    eventName: NativeEventType.OPEN_LOGIN_SCREEN,
                    parameters: { errorReason: 'faceid' },
                });

                expect(loginMessagesServiceMock.setLoginMessage).toHaveBeenCalledWith('faceid');
            });
        });
    });

    describe('events', () => {
        beforeEach(fakeAsync(() => {
            userServiceMock.isAuthenticated = true;
        }));

        it('should show overlay if GridCard event', () => {
            eventsService.events.next({
                eventName: 'GridCard',
                data: { barcode: 'LA1234567890123', source: 'terminal' },
            });
            expect(betstationLoginOverlayService.show).toHaveBeenCalledWith('123456789012');
        });

        it('should show overlay if NFCLoginCardEventName event of type GRID', () => {
            eventsService.events.next({
                eventName: 'NfcIdCard',
                data: { nfcString: '12345678901200000000321321321123', cardType: 'GRID', source: 'terminal' },
            });
            expect(betstationLoginOverlayService.show).toHaveBeenCalledWith('123456789012');
        });

        it('should show overlay if NFCLoginCardEventName event of type CONNECT', () => {
            eventsService.events.next({
                eventName: 'NfcIdCard',
                data: { nfcString: '12345678901234560000321321321123', cardType: 'CONNECT', source: 'terminal' },
            });
            expect(betstationLoginOverlayService.show).toHaveBeenCalledWith('1234567890123456');
        });

        it('should show logout info to current user if another already logged in', () => {
            claimsService.get.withArgs('accbusinessphase').and.returnValue('NotAnonymous');
            eventsService.events.next({
                eventName: 'NfcIdCard',
                data: { nfcString: '12345678901234560000000000123456', cardType: 'CONNECT', source: 'terminal' },
            });

            expect(loginNavigationServiceMock.storeReturnUrl).toHaveBeenCalled();
            expect(betstationLoginOverlayService.show).not.toHaveBeenCalled();
            expect(errorOverlayService.showLogoutInfoMessage).toHaveBeenCalledWith();
        });

        it('should not show login and log on the console when same user scan card again.', () => {
            claimsService.get.withArgs('accbusinessphase').and.returnValue('NotAnonymous');
            loginStoreServiceMock.LastVisitor = '1234567890123456';
            eventsService.events.next({
                eventName: 'NfcIdCard',
                data: { nfcString: '12345678901234560000000000123456', cardType: 'CONNECT', source: 'terminal' },
            });

            const msg = logger.info.calls.argsFor(0)[0];
            expect(msg).toContain('1234567890123456');
            expect(loginNavigationServiceMock.storeReturnUrl).toHaveBeenCalled();
            expect(betstationLoginOverlayService.show).not.toHaveBeenCalled();
        });
    });

    function getMenuActionCallback(name: string): any {
        return menuActionsServiceMock.register.calls.all().find((c) => c.args[0] === name)?.args[1];
    }
});
