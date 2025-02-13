import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    ClaimsConfig,
    CookieName,
    LOGIN_RESPONSE_HANDLER_HOOK,
    LoginResponse,
    LoginResponseHandlerContext,
    LoginResponseHandlerService,
    NativeEventType,
    UserPreHooksLoginEvent,
    UtilsService,
} from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of, throwError } from 'rxjs';

import { LoginResponseHandlerHookMock, PostLoginActionsServiceMock } from '../../../../features/login/test/login.mocks';
import { LoginResponseOptions } from '../../../src/login/login-response-handler/login-response-handler.models';
import { TrackingServiceMock } from '../../../src/tracking/test/tracking.mock';
import { UtilsServiceMock } from '../../../src/utils/test/utils.mock';
import { CookieServiceMock } from '../../browser/cookie.mock';
import { PageMock } from '../../browsercommon/page.mock';
import { ClientConfigServiceMock } from '../../client-config/client-config.mock';
import { LoggerMock } from '../../languages/logger.mock';
import { NativeAppServiceMock } from '../../native-app/native-app.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../navigation/navigation.mock';
import { RouterMock } from '../../router.mock';
import { ClaimsServiceMock } from '../../user/claims.mock';
import { UserServiceMock } from '../../user/user.mock';
import { LoginStoreServiceMock } from '../login-store.mock';
import { LoginNavigationServiceMock } from '../navigation-service.mocks';
import { RememberMeConfigMock } from '../remember-me/remember-me.config.mock';
import { RememberMeServiceMock } from '../remember-me/remember-me.service.mock';

describe('LoginResponseHandlerService', () => {
    let service: LoginResponseHandlerService;
    let loginStoreMock: LoginStoreServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let loginNavigationServiceMock: LoginNavigationServiceMock;
    let clientConfigServiceMock: ClientConfigServiceMock;
    let claimsServiceMock: ClaimsServiceMock;
    let userServiceMock: UserServiceMock;
    let rememberMeServiceMock: RememberMeServiceMock;
    let log: LoggerMock;
    let postLoginActionsServiceMock: PostLoginActionsServiceMock;
    let routerMock: RouterMock;
    let hookMock: LoginResponseHandlerHookMock;
    let cookieServiceMock: CookieServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let utilsServiceMock: UtilsServiceMock;
    let pageMock: PageMock;

    beforeEach(() => {
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        userServiceMock.claims = claimsServiceMock as any;
        loginStoreMock = MockContext.useMock(LoginStoreServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        clientConfigServiceMock = MockContext.useMock(ClientConfigServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginNavigationServiceMock = MockContext.useMock(LoginNavigationServiceMock);
        rememberMeServiceMock = MockContext.useMock(RememberMeServiceMock);
        log = MockContext.useMock(LoggerMock);
        postLoginActionsServiceMock = MockContext.useMock(PostLoginActionsServiceMock);
        routerMock = MockContext.useMock(RouterMock);
        hookMock = MockContext.createMock(LoginResponseHandlerHookMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        utilsServiceMock = MockContext.useMock(UtilsServiceMock);
        pageMock = MockContext.useMock(PageMock);
        MockContext.useMock(RememberMeConfigMock);

        TestBed.configureTestingModule({
            providers: [
                LoginResponseHandlerService,
                UtilsService,
                MockContext.providers,
                { provide: LOGIN_RESPONSE_HANDLER_HOOK, useValue: hookMock },
            ],
        });

        clientConfigServiceMock.update.and.returnValue({});
        clientConfigServiceMock.reloadOnLogin.and.returnValue(Promise.resolve());
        rememberMeServiceMock.setupTokenAfterLogin.and.returnValue(of({}));
        trackingServiceMock.triggerEvent.and.returnValue({});
        loginNavigationServiceMock.getStoredLoginRedirect.and.returnValue({
            isCompleted: true,
            url: new ParsedUrlMock(),
            options: {},
        });
    });

    beforeEach(() => {
        service = TestBed.inject(LoginResponseHandlerService);
        service.registerHooks([TestBed.inject(LOGIN_RESPONSE_HANDLER_HOOK)]);
    });

    function runTest(response?: LoginResponse, options?: LoginResponseOptions) {
        response = response || { isCompleted: true, redirectUrl: 'test_url', rememberMeEnabled: true, claims: {} };

        const promise = service.handle(response, options); // act

        tick(); // remember-me
        tick(); // client configs
        tick(); // post login hooks

        return promise;
    }

    it('should not be undefined', () => {
        expect(service).toBeDefined();
    });

    describe('interceptorResponse()', () => {
        it('should set loginStore.PostLoginValues', fakeAsync(() => {
            nativeAppServiceMock.isNative = true;
            const data = { postLoginValues: { some: 'value' } };
            service.handle(data, { additionalPostLoginCcbParameters: { test: 'yeah' } });
            expect(loginStoreMock.PostLoginValues).toEqual(data.postLoginValues);
            expect(cookieServiceMock.putObject).toHaveBeenCalledWith(CookieName.AdditionalPostLoginOptions, { test: 'yeah' });
        }));

        it('should navigate to redirectUrl and track login flow', fakeAsync(() => {
            userServiceMock.accountId = 'test_account';
            clientConfigServiceMock.reload.and.resolveTo({});
            runTest({ isCompleted: false, redirectUrl: 'http://redirect/path' }, { replace: true }).then((r) => r.goTo());
            tick();

            const args = navigationServiceMock.goTo.calls.mostRecent().args;
            expect(args[0].absUrl()).toBe('http://redirect/path');
            expect(args[1]).toEqual({ replace: true });
            expect(log.infoRemote).toHaveBeenCalledWith('Class: LoginResponseHandlerService. Method: handle. Message: Workflow phase.');
            expect(log.infoRemote).toHaveBeenCalledWith(
                'Class: LoginResponseHandlerService. Method: createRedirectInfo. Message: goTo_parsedUrl => (parsedUrl: "http://redirect/path", options: {"replace":true}).',
            );
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'login process',
                'component.LabelEvent': 'authentication',
                'component.ActionEvent': 'success',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'login flow',
                'component.EventDetails': 'pre login interceptor',
                'component.URLClicked': 'http://redirect/path',
            });
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.LOGIN_INTERCEPTOR,
                parameters: { isPostLogin: false, accountId: 'test_account' },
            });
        }));

        it('should add culture to options if its different from page culture and not track is isRegistrationFlow is true', fakeAsync(() => {
            userServiceMock.lang = 'de';
            clientConfigServiceMock.reload.and.resolveTo({});
            runTest({ isCompleted: false, redirectUrl: 'http://redirect/path', claims: {} }, { replace: true, skipInterceptorTracking: true }).then(
                (r) => r.goTo(),
            );
            tick();

            const args = navigationServiceMock.goTo.calls.mostRecent().args;
            expect(args[0].absUrl()).toBe('http://redirect/path');
            expect(args[1]).toEqual({ replace: true, culture: 'de', skipInterceptorTracking: true });
            expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
        }));

        it('should not add culture to options if skipUserLanguage cookie is equal to 1', fakeAsync(() => {
            cookieServiceMock.get.withArgs('skipUserLanguage').and.returnValue('1');
            userServiceMock.lang = 'de';
            clientConfigServiceMock.reload.and.resolveTo({});
            runTest({ isCompleted: false, redirectUrl: 'http://redirect/path' }, { replace: true }).then((r) => r.goTo());
            tick();

            const args = navigationServiceMock.goTo.calls.mostRecent().args;
            expect(args[0].absUrl()).toBe('http://redirect/path');
            expect(args[1]).toEqual({ replace: true });
        }));
    });

    describe('successResponse()', () => {
        it('should set loginStore.PostLoginValues', () => {
            const data = { postLoginValues: { some: 'value' } };
            service.handle(data);
            expect(loginStoreMock.PostLoginValues).toEqual(data.postLoginValues);
        });

        it('should setup remember-me and reload client configs', fakeAsync(() => {
            runTest();
            expect(clientConfigServiceMock.reloadOnLogin).toHaveBeenCalled();
            expect(rememberMeServiceMock.setupTokenAfterLogin).toHaveBeenCalled();
        }));

        it('should pass if remember-me setup failed', fakeAsync(() => {
            rememberMeServiceMock.setupTokenAfterLogin.and.returnValue(throwError(() => 'loginError'));
            runTest(); // act

            expect(log.errorRemote).toHaveBeenCalledWith('Failed to setup remember-me token. User gets only regular auth session.', 'loginError');
        }));

        it('should navigate to redirectUrl when set', fakeAsync(() => {
            runTest({ isCompleted: true, redirectUrl: 'http://redirect/path', claims: {} }, { replace: true }).then((r) => r.goTo());
            tick();

            const args = navigationServiceMock.goTo.calls.mostRecent().args;
            expect(rememberMeServiceMock.setupTokenAfterLogin).toHaveBeenCalled();
            expect(args[0].absUrl()).toBe('http://redirect/path');
            expect(args[1]).toEqual({ replace: true });
            expect(log.infoRemote).toHaveBeenCalledWith('Class: LoginResponseHandlerService. Method: handle. Message: Post login phase.');
            expect(log.infoRemote).toHaveBeenCalledWith('Class: LoginResponseHandlerService. Method: handle. Message: Post login phase.');
            expect(log.infoRemote).toHaveBeenCalledWith('Class: LoginResponseHandlerService. Method: handle. Message: Finished post login hooks.');
            expect(log.infoRemote).toHaveBeenCalledWith(
                'Class: LoginResponseHandlerService. Method: createRedirectInfo. Message: goTo_parsedUrl => (parsedUrl: "http://redirect/path", options: {"replace":true}).',
            );
            expect(userServiceMock.triggerEvent).toHaveBeenCalledWith(new UserPreHooksLoginEvent());
        }));

        it('should navigate to redirectUrl when set even if native app', fakeAsync(() => {
            nativeAppServiceMock.isNativeApp = true;
            runTest({ isCompleted: true, redirectUrl: 'http://redirect/path', claims: {} }, { replace: true }).then((r) => r.goTo());
            tick();

            const args = navigationServiceMock.goTo.calls.mostRecent().args;
            expect(args[0].absUrl()).toBe('http://redirect/path');
            expect(args[1]).toEqual({ replace: true });
        }));

        it('should navigate to stored return url async when redirectUrl not set', fakeAsync(() => {
            cookieServiceMock.get.and.returnValue('Login_faceid');
            runTest(
                {
                    isCompleted: true,
                    claims: {
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country': 'GB',
                        'http://api.bwin.com/v3/user/currency': 'EU',
                        'http://api.bwin.com/v3/user/pg/nameidentifier': '6958',
                    },
                    balance: <any>{
                        accountBalance: 200,
                    },
                    user: {
                        isAuthenticated: true,
                        loyaltyCategory: 'VIP',
                    },
                },
                { replace: true },
            ).then((r) => r.goTo());
            tick();

            expect(postLoginActionsServiceMock.invoke).toHaveBeenCalledWith('goToRedirectUrl', [{ replace: true }]);
            expect(log.infoRemote).toHaveBeenCalledWith(
                'Class: LoginResponseHandlerService. Method: createRedirectInfo. Message: goTo_postLoginActions => (action: goToRedirectUrl, args: [{"replace":true}]).',
            );
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Login', {
                'login.type': 'Login_faceid',
                'page.loginSubmissionType': 'userID',
                'page.siteSection': 'Authentication',
                'user.profile.accountID': '6958',
                'user.profile.bal': 200,
                'user.profile.currency': 'EU',
                'user.profile.country': 'GB',
                'user.profile.loyaltyStatus': 'VIP',
                'user.hasPositiveBalance': true,
                'user.isAuthenticated': true,
                'user.isExisting': true,
            });

            expect(cookieServiceMock.get).toHaveBeenCalledWith('loginType');
        }));

        it('should send login interceptor event when post login interceptor', fakeAsync(() => {
            userServiceMock.workflowType = -3;
            userServiceMock.accountId = 'test_account';
            runTest({ isCompleted: true, redirectUrl: 'http://redirect/path', user: { isAuthenticated: true }, claims: {} }, { replace: true }).then(
                (r) => r.goTo(),
            );
            tick();

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.LOGIN_INTERCEPTOR,
                parameters: { isPostLogin: true, accountId: 'test_account' },
            });
        }));

        it('should execute action when set and redirectUrl not set', fakeAsync(() => {
            runTest({ isCompleted: true, action: 'goToCashierDeposit', claims: {} }, { replace: true }).then((r) => r.goTo());
            tick();

            expect(postLoginActionsServiceMock.invoke).toHaveBeenCalledWith('goToCashierDeposit', [{ replace: true }]);
        }));

        it('should go to native app if completed and in native app', fakeAsync(() => {
            nativeAppServiceMock.isNativeApp = true;
            runTest({ isCompleted: true, claims: {} }, { replace: true }).then((r) => r.goTo());
            tick();

            expect(navigationServiceMock.goToNativeApp).toHaveBeenCalledWith({ replace: true });
            expect(log.infoRemote).toHaveBeenCalledWith(
                'Class: LoginResponseHandlerService. Method: createRedirectInfo. Message: goTo_goToNativeApp => (options: {"replace":true}).',
            );
        }));

        it('should add culture to options if its different from page culture', fakeAsync(() => {
            userServiceMock.lang = 'de';
            runTest({ isCompleted: true, redirectUrl: 'http://redirect/path', claims: {} }, { replace: true }).then((r) => r.goTo());
            tick();

            const args = navigationServiceMock.goTo.calls.mostRecent().args;
            expect(args[0].absUrl()).toBe('http://redirect/path');
            expect(args[1]).toEqual({ replace: true, culture: 'de' });
        }));

        it('should call post login hooks', fakeAsync(() => {
            runTest();

            expect(hookMock.onPostLogin).toHaveBeenCalled();
        }));

        it('should track if username is a mobile number', fakeAsync(() => {
            userServiceMock.username = '+1-58964152';
            pageMock.isLoginWithMobileEnabled = true;

            runTest(
                {
                    isCompleted: true,
                    claims: {
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country': 'GB',
                        'http://api.bwin.com/v3/user/currency': 'EU',
                        'http://api.bwin.com/v3/user/pg/nameidentifier': '6958',
                    },
                    balance: <any>{
                        accountBalance: 200,
                    },
                    user: {
                        isAuthenticated: true,
                        loyaltyCategory: 'VIP',
                    },
                },
                { replace: true },
            ).then((r) => r.goTo());
            tick();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Login', {
                'login.type': 'Login_mobile',
                'page.loginSubmissionType': 'mobile',
                'page.siteSection': 'Authentication',
                'user.profile.accountID': '6958',
                'user.profile.bal': 200,
                'user.profile.currency': 'EU',
                'user.profile.country': 'GB',
                'user.profile.loyaltyStatus': 'VIP',
                'user.hasPositiveBalance': true,
                'user.isAuthenticated': true,
                'user.isExisting': false,
            });

            expect(cookieServiceMock.get).toHaveBeenCalledWith('loginType');
        }));

        it('should track as connectCard for connectcardoption', fakeAsync(() => {
            loginStoreMock.SelectedTab = 'connectcardoption';

            runTest(
                {
                    isCompleted: true,
                    claims: {
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country': 'GB',
                        'http://api.bwin.com/v3/user/currency': 'EU',
                        'http://api.bwin.com/v3/user/pg/nameidentifier': '6958',
                    },
                    balance: <any>{
                        accountBalance: 200,
                    },
                    user: {
                        isAuthenticated: true,
                        loyaltyCategory: 'VIP',
                    },
                },
                { replace: true },
            ).then((r) => r.goTo());

            tick();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Login', {
                'login.type': 'Login_connectcard',
                'page.loginSubmissionType': 'connectcard',
                'page.siteSection': 'Authentication',
                'user.profile.accountID': '6958',
                'user.profile.bal': 200,
                'user.profile.currency': 'EU',
                'user.profile.country': 'GB',
                'user.profile.loyaltyStatus': 'VIP',
                'user.hasPositiveBalance': true,
                'user.isAuthenticated': true,
                'user.isExisting': false,
            });

            expect(cookieServiceMock.get).toHaveBeenCalledWith('loginType');
        }));

        it('should track if username is an email', fakeAsync(() => {
            userServiceMock.username = 'zlatko@didnotwritethis.test';
            utilsServiceMock.isEmail.withArgs('zlatko@didnotwritethis.test').and.resolveTo(true);

            runTest(
                {
                    isCompleted: true,
                    claims: {
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country': 'GB',
                        'http://api.bwin.com/v3/user/currency': 'EU',
                        'http://api.bwin.com/v3/user/pg/nameidentifier': '6958',
                    },
                    balance: <any>{
                        accountBalance: 200,
                    },
                    user: {
                        isAuthenticated: true,
                        loyaltyCategory: 'VIP',
                    },
                },
                { replace: true },
            ).then((r) => r.goTo());
            tick();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Login', {
                'login.type': 'Login_email',
                'page.loginSubmissionType': 'email',
                'page.siteSection': 'Authentication',
                'user.profile.accountID': '6958',
                'user.profile.bal': 200,
                'user.profile.currency': 'EU',
                'user.profile.country': 'GB',
                'user.profile.loyaltyStatus': 'VIP',
                'user.hasPositiveBalance': true,
                'user.isAuthenticated': true,
                'user.isExisting': false,
            });

            expect(cookieServiceMock.get).toHaveBeenCalledWith('loginType');
        }));

        it('should track if last visitor is an email', fakeAsync(() => {
            loginStoreMock.LastVisitor = 'zlatko@isaret.ard';
            utilsServiceMock.isEmail.withArgs('zlatko@isaret.ard').and.resolveTo(true);

            runTest(
                {
                    isCompleted: true,
                    claims: {
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country': 'GB',
                        'http://api.bwin.com/v3/user/currency': 'EU',
                        'http://api.bwin.com/v3/user/pg/nameidentifier': '6958',
                    },
                    balance: <any>{
                        accountBalance: 200,
                    },
                    user: {
                        isAuthenticated: true,
                        loyaltyCategory: 'VIP',
                    },
                },
                { replace: true },
            ).then((r) => r.goTo());
            tick();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Login', {
                'login.type': 'Login_email',
                'page.loginSubmissionType': 'email',
                'page.siteSection': 'Authentication',
                'user.profile.accountID': '6958',
                'user.profile.bal': 200,
                'user.profile.currency': 'EU',
                'user.profile.country': 'GB',
                'user.profile.loyaltyStatus': 'VIP',
                'user.hasPositiveBalance': true,
                'user.isAuthenticated': true,
                'user.isExisting': false,
            });

            expect(cookieServiceMock.get).toHaveBeenCalledWith('loginType');
        }));

        testContext({ isCompleted: true, redirectUrl: 'url', claims: {} }, 'reload', false, false, true);
        testContext({ isCompleted: true, action: 'action', claims: {} }, 'reload', false, false, true);
        testContext({ isCompleted: true, claims: {} }, 'reload', false, true, true);
        testContext({ isCompleted: true, claims: {} }, 'reload', true, true, true);
        testContext({ isCompleted: true, claims: {} }, 'ignore', false, true, true);
        testContext({ isCompleted: true, claims: {} }, 'ignore', true, true, false);

        function testContext(
            response: LoginResponse,
            onSameUrlNavigation: 'ignore' | 'reload',
            sameUrl: boolean,
            usesDefault: boolean,
            willRedirect: boolean,
        ) {
            it(`should have context values usesDefaultPostLoginAction=${usesDefault}, willRedirectAfterLogin=${willRedirect} when response is ${JSON.stringify(
                response,
            )} and onSameUrlNavigation=${onSameUrlNavigation} and sameUrl=${sameUrl}`, fakeAsync(() => {
                routerMock.onSameUrlNavigation = onSameUrlNavigation;

                const storedReturnUrl = new ParsedUrlMock();
                storedReturnUrl.absUrl.and.returnValue(sameUrl ? 'y' : 'x');
                loginNavigationServiceMock.getStoredLoginRedirect.and.returnValue({ url: storedReturnUrl });
                navigationServiceMock.location.absUrl.and.returnValue('y');

                runTest(response);

                expect(hookMock.onPostLogin).toHaveBeenCalled();
                const context: LoginResponseHandlerContext = hookMock.onPostLogin.calls.mostRecent().args[0];
                expect(context.response).toBe(response);
                expect(context.usesDefaultPostLoginAction).toBe(usesDefault);
                expect(context.willRedirectAfterLogin).toBe(willRedirect);
            }));
        }
    });

    describe('reloadClientConfigs()', () => {
        it('should reload client configs and claims', () => {
            service.reloadClientConfigs();

            expect(clientConfigServiceMock.reloadOnLogin).toHaveBeenCalledWith([ClaimsConfig]);
        });

        it('should reload client configs without the claims', () => {
            service.reloadClientConfigs(false);

            expect(clientConfigServiceMock.reloadOnLogin).toHaveBeenCalledWith([]);
        });
    });

    it('should not setup remember-me if skip passed', fakeAsync(() => {
        service.handle({}, { skipRememberMeSetup: true });
        expect(rememberMeServiceMock.setupTokenAfterLogin).not.toHaveBeenCalled();
    }));
});
