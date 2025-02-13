import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import {
    AutoLoginParameters,
    CookieName,
    LoginProvider,
    LoginProviderProfile,
    LoginType,
    MessageScope,
    NativeEventType,
    SsoAutoLoginParameters,
    UserLoggingInEvent,
    UserLoginFailedEvent,
} from '@frontend/vanilla/core';
import { LoginFailedEvent } from '@frontend/vanilla/features/login';
import { ProviderParameters } from '@frontend/vanilla/shared/login';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { LoadingIndicatorServiceMock } from '../../../core/test/http/loading-indicator.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { LoginService2Mock } from '../../../core/test/login/login-service.mock';
import { LoginNavigationServiceMock } from '../../../core/test/login/navigation-service.mocks';
import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { ProductNavigationServiceMock } from '../../../core/test/products/product.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WrapperSettingsServiceMock } from '../../../shared/native-app/test/wrapper-settings.mock';
import { ReCaptchaConfigMock } from '../../recaptcha/test/recaptcha-config.mock';
import { RecaptchaEnterpriseServiceMock } from '../../recaptcha/test/recaptcha.mock';
import { LoginService } from '../src/login.service';
import { DeviceFingerprintServiceMock } from './device-fingerprint.mock';
import {
    LoginConfigMock,
    CoreLoginDialogServiceMock as LoginDialogServiceMock,
    LoginMessagesServiceMock,
    LoginProvidersServiceMock,
    LoginResourceServiceMock,
    LoginResponseHandlerServiceMock,
    LoginTrackingServiceMock,
} from './login.mocks';

describe('LoginService', () => {
    let cookieServiceMock: CookieServiceMock;
    let deviceFingerprintServiceMock: DeviceFingerprintServiceMock;
    let loginConfigMock: LoginConfigMock;
    let loginDialogServiceMock: LoginDialogServiceMock;
    let loginMessagesServiceMock: LoginMessagesServiceMock;
    let loginNavigationServiceMock: LoginNavigationServiceMock;
    let loginProvidersServiceMock: LoginProvidersServiceMock;
    let loginResourceServiceMock: LoginResourceServiceMock;
    let loginResponseHandlerServiceMock: LoginResponseHandlerServiceMock;
    let loginService2Mock: LoginService2Mock;
    let loginTrackingServiceMock: LoginTrackingServiceMock;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let productNavigationServiceMock: ProductNavigationServiceMock;
    let service: LoginService;
    let userServiceMock: UserServiceMock;
    let wrapperSettingsServiceMock: WrapperSettingsServiceMock;
    let recaptchaConfigMock: ReCaptchaConfigMock;
    let recaptchaEnterpriseServiceMock: RecaptchaEnterpriseServiceMock;
    let loggerMock: LoggerMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        deviceFingerprintServiceMock = MockContext.useMock(DeviceFingerprintServiceMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        loginDialogServiceMock = MockContext.useMock(LoginDialogServiceMock);
        loginMessagesServiceMock = MockContext.useMock(LoginMessagesServiceMock);
        loginNavigationServiceMock = MockContext.useMock(LoginNavigationServiceMock);
        loginProvidersServiceMock = MockContext.useMock(LoginProvidersServiceMock);
        loginResourceServiceMock = MockContext.useMock(LoginResourceServiceMock);
        loginResponseHandlerServiceMock = MockContext.useMock(LoginResponseHandlerServiceMock);
        loginService2Mock = MockContext.useMock(LoginService2Mock);
        loginTrackingServiceMock = MockContext.useMock(LoginTrackingServiceMock);
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        productNavigationServiceMock = MockContext.useMock(ProductNavigationServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        wrapperSettingsServiceMock = MockContext.useMock(WrapperSettingsServiceMock);
        recaptchaConfigMock = MockContext.useMock(ReCaptchaConfigMock);
        recaptchaEnterpriseServiceMock = MockContext.useMock(RecaptchaEnterpriseServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        MockContext.useMock(LoadingIndicatorServiceMock);

        TestBed.configureTestingModule({
            providers: [LoginService, MockContext.providers],
        });

        deviceFingerprintServiceMock.get.and.returnValue({});

        service = TestBed.inject(LoginService);
    });

    it('touchIdToggleVisible should return correct value', () => {
        wrapperSettingsServiceMock.current.deviceTouchSupported = false;
        wrapperSettingsServiceMock.current.isTouchIDLoginEnabled = true;
        expect(service.touchIdToggleVisible).toBeFalse();

        wrapperSettingsServiceMock.current.deviceTouchSupported = true;
        wrapperSettingsServiceMock.current.isTouchIDLoginEnabled = true;
        expect(service.touchIdToggleVisible).toBeTrue();

        wrapperSettingsServiceMock.current.deviceTouchSupported = true;
        wrapperSettingsServiceMock.current.isTouchIDLoginEnabled = false;
        expect(service.touchIdToggleVisible).toBeTrue();

        wrapperSettingsServiceMock.current.deviceTouchSupported = true;
        wrapperSettingsServiceMock.current.isTouchIDLoginEnabled = undefined;
        expect(service.touchIdToggleVisible).toBeFalse();
    });

    it('faceIdToggleVisible should return correct value', () => {
        wrapperSettingsServiceMock.current.deviceFaceSupported = false;
        wrapperSettingsServiceMock.current.isFaceIDLoginEnabled = true;
        expect(service.faceIdToggleVisible).toBeFalse();

        wrapperSettingsServiceMock.current.deviceFaceSupported = true;
        wrapperSettingsServiceMock.current.isFaceIDLoginEnabled = true;
        expect(service.faceIdToggleVisible).toBeTrue();

        wrapperSettingsServiceMock.current.deviceFaceSupported = true;
        wrapperSettingsServiceMock.current.isFaceIDLoginEnabled = false;
        expect(service.faceIdToggleVisible).toBeTrue();

        wrapperSettingsServiceMock.current.deviceFaceSupported = true;
        wrapperSettingsServiceMock.current.isFaceIDLoginEnabled = undefined;
        expect(service.faceIdToggleVisible).toBeFalse();
    });

    it('keepMeSignedInToggleVisible should return correct value', () => {
        wrapperSettingsServiceMock.current.keepMeSignedInEnabled = true;
        expect(service.keepMeSignedInToggleVisible).toBeTrue();

        wrapperSettingsServiceMock.current.keepMeSignedInEnabled = false;
        expect(service.keepMeSignedInToggleVisible).toBeTrue();

        wrapperSettingsServiceMock.current.keepMeSignedInEnabled = undefined;
        expect(service.keepMeSignedInToggleVisible).toBeFalse();
    });

    it('fastLoginEnabled should return correct value', () => {
        wrapperSettingsServiceMock.current.deviceTouchSupported = true;
        wrapperSettingsServiceMock.current.isTouchIDLoginEnabled = true;
        wrapperSettingsServiceMock.current.keepMeSignedInEnabled = false;

        expect(service.fastLoginEnabled).toBeTrue();

        wrapperSettingsServiceMock.current.deviceTouchSupported = false;
        wrapperSettingsServiceMock.current.deviceFaceSupported = false;
        wrapperSettingsServiceMock.current.keepMeSignedInEnabled = true;

        expect(service.fastLoginEnabled).toBeTrue();

        wrapperSettingsServiceMock.current.keepMeSignedInEnabled = false;

        expect(service.fastLoginEnabled).toBeFalse();
    });

    describe('loginFailed', () => {
        it('should track on 604 error code', () => {
            const reason = { errorCode: '604', posApiErrorMessage: 'the end is nigh!' };
            service.loginFailed({ reason, type: LoginType.Manual });

            expect(loginTrackingServiceMock.trackErrorCode).toHaveBeenCalledWith(reason);
            expect(loginTrackingServiceMock.reportLoginError).toHaveBeenCalledWith(reason);
        });

        it('should track remaining login attempts on 600 errorCode', () => {
            const reason = {
                errorCode: '600',
                posApiErrorMessage: 'Authentication failed',
                errorValues: [{ key: 'REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK', value: '2' }],
            };
            service.loginFailed({
                reason,
                type: LoginType.Manual,
            });

            expect(loginTrackingServiceMock.trackErrorCode).toHaveBeenCalledWith(reason);
            expect(loginTrackingServiceMock.reportLoginError).toHaveBeenCalledWith(reason);
        });

        it('should invoke login failed event and redirect to login if autologin', () => {
            loginDialogServiceMock.opened = false;
            const reason = { errorCode: 'bla', posApiErrorMessage: 'run for cover!' };
            service.loginFailed({ reason, type: LoginType.Autologin });

            expect(messageQueueServiceMock.changeScope).toHaveBeenCalledWith('autologin', 'login');
            expect(loginTrackingServiceMock.trackErrorCode).toHaveBeenCalledWith(reason);
            expect(loginTrackingServiceMock.reportLoginError).toHaveBeenCalledWith(reason);
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.LOGINFAILED,
                parameters: {
                    type: LoginType.Autologin,
                    errorCode: 'bla',
                },
            });
            expect(loginService2Mock.goTo).toHaveBeenCalledWith({
                appendReferrer: true,
                storeMessageQueue: true,
                loginMessageKey: '',
            });
        });

        it('should invoke login failed event and set login entry message on dialog', () => {
            loginDialogServiceMock.opened = true;
            const reason = { errorCode: '', posApiErrorMessage: 'oh no!' };
            service.loginFailed({ reason, type: LoginType.Autologin });

            expect(loginTrackingServiceMock.trackErrorCode).toHaveBeenCalledWith(reason);
            expect(loginTrackingServiceMock.reportLoginError).toHaveBeenCalledWith(reason);
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.LOGINFAILED,
                parameters: {
                    type: LoginType.Autologin,
                    errorCode: '',
                },
            });
            expect(loginMessagesServiceMock.setLoginMessage).toHaveBeenCalledWith('autologinerror');
        });

        it('should invoke login failed event and redirect to login with autologintouch message', () => {
            loginDialogServiceMock.opened = false;
            service.loginFailed({
                reason: { errorCode: 'bla' },
                type: LoginType.Autologin,
                touchIdOrFaceIdEnabled: true,
            });

            expect(loginService2Mock.goTo).toHaveBeenCalledOnceWith({
                appendReferrer: true,
                storeMessageQueue: true,
                loginMessageKey: '',
            });
        });

        it('should publish onLoginFailed event', () => {
            let loginFailedEvent: LoginFailedEvent = <any>null;
            service.onLoginFailed.subscribe((e) => (loginFailedEvent = e));

            service.loginFailed({ reason: { errorCode: '604' }, type: LoginType.Manual });
            expect(loginFailedEvent.reason?.errorCode).toBe('604');
            expect(loginFailedEvent.loginType).toBe(LoginType.Manual);
        });

        it('should trigger UserLoginFailedEvent on LoginFailed', () => {
            service.loginFailed({ reason: { errorCode: '604' }, type: LoginType.Manual });

            expect(userServiceMock.triggerEvent).toHaveBeenCalledWith(new UserLoginFailedEvent());
        });

        it('should redirect when redirectUrl is there', () => {
            service.loginFailed({ reason: { errorCode: '604', redirectUrl: '{portal}/test' }, type: LoginType.Manual });

            expect(productNavigationServiceMock.goTo).toHaveBeenCalledWith('{portal}/test');
        });
    });

    describe('goToLogin', () => {
        it('should go to login if `forceRedirect` parameter is provided', () => {
            service.goToLogin({ forceRedirect: '1' });

            expect(loginNavigationServiceMock.goToLogin).toHaveBeenCalled();
        });

        it('should open welcome dialog if login provider profile is available', () => {
            loginConfigMock.useProviderProfile = true;
            loginConfigMock.providers = {
                facebook: <ProviderParameters>{
                    welcomeDialog: true,
                },
            };
            cookieServiceMock.get.withArgs(CookieName.LoginType).and.returnValue(LoginProvider.FACEBOOK);

            service.goToLogin();

            const loginProviderProfile: LoginProviderProfile = {
                name: 'FacebookUser',
                provider: LoginProvider.FACEBOOK,
            };

            loginProvidersServiceMock.providersProfile.next([loginProviderProfile]);

            expect(loginDialogServiceMock.open).toHaveBeenCalled();
        });

        it('should open login dialog', () => {
            service.goToLogin({});

            expect(loginDialogServiceMock.open).toHaveBeenCalledOnceWith({});
        });
    });

    describe('logSuperCookie', () => {
        it('should log and mask super cookie', () => {
            cookieServiceMock.get.and.returnValue('58965214875963');
            service.logSuperCookie('Boot');

            expect(loggerMock.infoRemote).toHaveBeenCalledWith('SuperCookie value - Boot: **********5963');
        });

        it('should log undefined when super cookie does not exist', () => {
            service.logSuperCookie('Boot');

            expect(loggerMock.infoRemote).toHaveBeenCalledWith('SuperCookie value - Boot: undefined');
        });
    });

    describe('autoLogin', () => {
        function autoLogin(data: AutoLoginParameters | SsoAutoLoginParameters) {
            service.autoLogin(data);

            expect(loggerMock.infoRemote).toHaveBeenCalledWith('LOGIN_INFO Autologin started.');

            recaptchaConfigMock.whenReady.next();
            tick();

            expect(recaptchaEnterpriseServiceMock.initReCaptchaAPI).toHaveBeenCalled();

            recaptchaEnterpriseServiceMock.scriptLoaded.next(true);
            tick();

            expect(recaptchaEnterpriseServiceMock.executeRecaptcha).toHaveBeenCalledOnceWith('autoLogin', recaptchaConfigMock.enterpriseSiteKey);

            recaptchaEnterpriseServiceMock.recaptchaToken.next('token');
            tick();

            expect(userServiceMock.triggerEvent).toHaveBeenCalledOnceWith(new UserLoggingInEvent());
        }

        it('should call success', fakeAsync(() => {
            loginConfigMock.failedLoginRetryCount = { touchId: 3 };
            const data = <AutoLoginParameters>{ username: 'username', password: 'password', isTouchIDEnabled: true };

            autoLogin(data);

            expect(loginResourceServiceMock.login).toHaveBeenCalledWith(Object.assign({}, data, { fingerprint: {}, captchaResponse: 'token' }), {
                messageQueueScope: MessageScope.AutoLogin,
                retryCount: 3,
                showSpinner: true,
            });

            loginResourceServiceMock.login.completeWith({});
            tick();

            expect(cookieServiceMock.put).toHaveBeenCalledWith(CookieName.LoginType, 'Login_TouchID');
            expect(loginResponseHandlerServiceMock.handle).toHaveBeenCalledOnceWith({});

            loginResponseHandlerServiceMock.handle.resolve({
                goTo: () => {},
            });
            tick();

            expect(loggerMock.infoRemote).toHaveBeenCalledWith('LOGIN_INFO Autologin HandleResponse successful.');
        }));

        it('should call success with sso token', fakeAsync(() => {
            loginConfigMock.failedLoginRetryCount = { touchId: 3 };
            const data = { ssoToken: 'token', isTouchIDEnabled: true };

            autoLogin(data);

            expect(loginResourceServiceMock.login).toHaveBeenCalledOnceWith(Object.assign({}, data, { fingerprint: {}, captchaResponse: 'token' }), {
                messageQueueScope: MessageScope.AutoLogin,
                retryCount: 3,
                showSpinner: true,
            });

            loginResourceServiceMock.login.completeWith({});
            tick();

            expect(cookieServiceMock.put).toHaveBeenCalledWith('loginType', 'Login_TouchID');
            expect(loginResponseHandlerServiceMock.handle).toHaveBeenCalledOnceWith({});
        }));

        it('should call login with retryNumber of 2 with faceId', fakeAsync(() => {
            loginConfigMock.failedLoginRetryCount = { faceId: 2 };
            loginConfigMock.showLoginSpinner = true;
            const data: AutoLoginParameters | SsoAutoLoginParameters = {
                username: 'username',
                password: 'password',
                isFaceIDEnabled: true,
                dateOfBirth: undefined,
            };

            autoLogin(data);

            expect(loginResourceServiceMock.login).toHaveBeenCalledWith(Object.assign({}, data, { fingerprint: {}, captchaResponse: 'token' }), {
                messageQueueScope: MessageScope.AutoLogin,
                retryCount: 2,
                showSpinner: false,
            });
        }));

        it('should call login with retryNumber of 1 with autoLogin', fakeAsync(() => {
            loginConfigMock.failedLoginRetryCount = { autoLogin: 1 };
            const data: AutoLoginParameters | SsoAutoLoginParameters = {
                username: 'username',
                password: 'password',
                dateOfBirth: undefined,
            };

            autoLogin(data);

            expect(loginResourceServiceMock.login).toHaveBeenCalledOnceWith(Object.assign({}, data, { fingerprint: {}, captchaResponse: 'token' }), {
                messageQueueScope: MessageScope.AutoLogin,
                retryCount: 1,
                showSpinner: true,
            });
        }));

        it('should call loginFailed', fakeAsync(() => {
            loginConfigMock.failedLoginRetryCount = { touchId: 3 };
            const data: AutoLoginParameters | SsoAutoLoginParameters = {
                username: 'username',
                password: 'password',
                isTouchIDEnabled: true,
                dateOfBirth: undefined,
            };
            const loginFailedSpy = spyOn(service, 'loginFailed');

            autoLogin(data);

            loginResourceServiceMock.login.error({ errorCode: '112' });
            tick();

            expect(loginFailedSpy).toHaveBeenCalledOnceWith({
                reason: { errorCode: '112' },
                type: LoginType.Autologin,
                touchIdOrFaceIdEnabled: true,
            });
        }));
    });
});
