import { SlicePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import {
    ContentItem,
    FastLoginValue,
    LoginProvider,
    LoginType,
    MessageLifetime,
    MessageScope,
    MessageType,
    NativeEventType,
} from '@frontend/vanilla/core';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DateTimeServiceMock } from '../../../core/test/browser/datetime.service.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { LoginService2Mock } from '../../../core/test/login/login-service.mock';
import { LoginStoreServiceMock } from '../../../core/test/login/login-store.mock';
import { LoginNavigationServiceMock } from '../../../core/test/login/navigation-service.mocks';
import { RememberMeConfigMock } from '../../../core/test/login/remember-me/remember-me.config.mock';
import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { ValidationConfigMock } from '../../../shared/forms/src/validation/test/validation-config.mock';
import { ValidationHelperServiceMock } from '../../../shared/forms/test/forms/validation-helper.mock';
import { WrapperSettingsServiceMock } from '../../../shared/native-app/test/wrapper-settings.mock';
import { TestReCaptchaComponent } from '../../recaptcha/test/recaptcha.mock';
import { TabbedLoginAction } from '../src/login-tracking.service';
import { LoginComponent } from '../src/login.component';
import { DeviceFingerprintServiceMock } from './device-fingerprint.mock';
import {
    LoginConfigMock,
    LoginContentMock,
    LoginContentServiceMock,
    LoginMessagesServiceMock,
    LoginProvidersServiceMock,
    LoginResourceServiceMock,
    LoginResponseHandlerServiceMock,
    LoginServiceMock,
    LoginSpinnerServiceMock,
    LoginTrackingServiceMock,
} from './login.mocks';

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let navigationServiceMock: NavigationServiceMock;
    let loginNavigationServiceMock: LoginNavigationServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let loginResourceServiceMock: LoginResourceServiceMock;
    let loginStoreServiceMock: LoginStoreServiceMock;
    let userServiceMock: UserServiceMock;
    let loginConfigMock: LoginConfigMock;
    let loginServiceMock: LoginServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let loginResponseHandlerMock: LoginResponseHandlerServiceMock;
    let validationHelper: ValidationHelperServiceMock;
    let trackingServiceMock: LoginTrackingServiceMock;
    let loginMessagesServiceMock: LoginMessagesServiceMock;
    let loginResponse: any;
    let wrapperSettingsServiceMock: WrapperSettingsServiceMock;
    let deviceServiceMock: DeviceServiceMock;
    let deviceFingerprintServiceMock: DeviceFingerprintServiceMock;
    let loginProvidersServiceMock: LoginProvidersServiceMock;
    let messageQueueServiceMock: MessageQueueServiceMock;
    let dslServiceMock: DslServiceMock;
    let loginService2Mock: LoginService2Mock;
    let loginContentServiceMock: LoginContentServiceMock;
    let loginSpinnerServiceMock: LoginSpinnerServiceMock;

    beforeEach(() => {
        loginResponse = { isCompleted: false };
        loginResponseHandlerMock = MockContext.useMock(LoginResponseHandlerServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginNavigationServiceMock = MockContext.useMock(LoginNavigationServiceMock);
        loginResourceServiceMock = MockContext.useMock(LoginResourceServiceMock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        trackingServiceMock = MockContext.useMock(LoginTrackingServiceMock);
        MockContext.useMock(LoginContentMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        MockContext.useMock(CommonMessagesMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);
        validationHelper = MockContext.useMock(ValidationHelperServiceMock);
        MockContext.useMock(ValidationConfigMock);
        MockContext.useMock(HtmlNodeMock);
        loginProvidersServiceMock = MockContext.useMock(LoginProvidersServiceMock);
        messageQueueServiceMock = MockContext.useMock(MessageQueueServiceMock);
        wrapperSettingsServiceMock = MockContext.useMock(WrapperSettingsServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        loginMessagesServiceMock = MockContext.useMock(LoginMessagesServiceMock);
        MockContext.useMock(RememberMeConfigMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        deviceFingerprintServiceMock = MockContext.useMock(DeviceFingerprintServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        loginService2Mock = MockContext.useMock(LoginService2Mock);
        loginContentServiceMock = MockContext.useMock(LoginContentServiceMock);
        MockContext.useMock(WebWorkerServiceMock);
        MockContext.useMock(LoggerMock);
        MockContext.useMock(DateTimeServiceMock);
        loginSpinnerServiceMock = MockContext.useMock(LoginSpinnerServiceMock);

        TestBed.overrideComponent(LoginComponent, {
            set: {
                imports: [FormatPipe, TrustAsHtmlPipe, SlicePipe],
                providers: [MockContext.providers, UntypedFormBuilder],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        loginContentServiceMock.content = <any>{
            form: {
                username: { validation: {} },
                loginbutton: { htmlAttributes: {} },
                registerbutton: { htmlAttributes: {} },
                connectcardbutton: { htmlAttributes: {} },
                password: { validation: {} },
                toggleprovidersbutton: { values: [] },
                facebookbutton: { values: [{ value: 'culture', text: 'en-US' }] },
            },
            children: [
                {
                    forgotpassword: {},
                },
            ],
            messages: {
                Required: 'Required',
            },
        };
        deviceFingerprintServiceMock.get.and.returnValue({});
        loginConfigMock.isDateOfBirthEnabled = true;
        loginConfigMock.resetLoginFormErrorCodes = [];
        loginConfigMock.providers = {};
    });

    function initComponent() {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.reCaptcha = new TestReCaptchaComponent() as any;
    }

    it('should start with setup properties', () => {
        initComponent();

        expect(component.hasEntryMessage).toBeFalse();
    });

    it('should setup register link item', () => {
        loginConfigMock.v2 = true;
        loginConfigMock.loginOptions = ['userpwdoption', 'connectcardoption'];
        initComponent();
        component.ngAfterViewInit();
        dslServiceMock.evaluateContent.next([{ text: 'regButton' }]);

        expect(component.registerLinkItem).toEqual({ text: 'regButton' } as ContentItem);
    });

    it('should prefill the username', () => {
        loginStoreServiceMock.LastVisitor = 'blablub';

        initComponent();
        expect(component.formGroup.get('username')!.value).toEqual('blablub');
    });

    it('should not check remember-me by default', () => {
        initComponent();

        expect(component.formGroup.get('rememberme')!.value).toEqual(false);
    });

    it('should prefill remember-me if previously expired', () => {
        cookieServiceMock.get.withArgs('rm-h').and.returnValue('haha');

        initComponent();

        expect(component.formGroup.get('rememberme')!.value).toEqual(true);
    });

    it('should prefill the username from LOGIN_PREFILL', () => {
        initComponent();

        nativeAppServiceMock.eventsFromNative.next({
            eventName: 'LOGIN_PREFILL',
            parameters: { username: 'blabla', password: 'Pa$$w0rd' },
        });

        expect(component.formGroup.get('username')!.value).toEqual('blabla');
        expect(component.formGroup.get('password')!.value).toEqual('Pa$$w0rd');
        expect(component.formGroup.get('rememberme')!.value).toEqual(true);
    });

    it('should not redirect if unauthenticated users', () => {
        userServiceMock.isAuthenticated = false;
        initComponent();
        expect(loginNavigationServiceMock.goToStoredReturnUrl).not.toHaveBeenCalled();
    });

    it('should invoke sdkAuth and track on continue with provider when connected', () => {
        loginConfigMock.providers = <any>{
            facebook: {
                redirectQueryParams: {
                    trigger: 'login',
                },
                sdkLogin: true,
            },
        };
        initComponent();

        const trackingOptions: TabbedLoginAction = {
            actionEvent: 'click',
            eventDetails: 'continue',
            positionEvent: 'existing account flow',
            locationEvent: 'facebook login confirmation screen',
        };

        component.invokeLoginWith(LoginProvider.FACEBOOK, true);

        expect(loginProvidersServiceMock.sdkAuth).toHaveBeenCalledWith({
            provider: LoginProvider.FACEBOOK,
            queryParams: { culture: 'en-US' },
            redirectQueryParams: { trigger: 'login' },
        });
        expect(loginProvidersServiceMock.urlAuth).not.toHaveBeenCalled();
        expect(trackingServiceMock.trackLoginWithProvider).toHaveBeenCalledWith(LoginProvider.FACEBOOK, trackingOptions);
    });

    it('usernameBlur() should set last attempted cookie', () => {
        initComponent();
        component.formGroup.get('username')?.setValue('test');
        component.usernameBlur();

        expect(loginStoreServiceMock.LastAttemptedVisitor).toBe('test');
    });

    it('isMobileChangedEvent() should change isMobileNumber property', fakeAsync(() => {
        initComponent();

        expect(component.isMobileNumber).toBeFalse();

        component.isMobileChangedEvent(true);
        tick();

        expect(component.isMobileNumber).toBeTrue();
        expect(trackingServiceMock.trackMobileNumberChanged).toHaveBeenCalledWith(true, component.loginOptions.length > 1);
    }));

    describe('ngOnInit', () => {
        it('should set selected tab if enabled', () => {
            initComponent();
            loginConfigMock.selectedTabEnabled = true;
            loginStoreServiceMock.SelectedTab = 'connectcardoption';
            const spy = spyOn(component, 'selectLoginOption');
            component.ngOnInit();

            expect(spy).toHaveBeenCalledWith('connectcardoption', false);
        });

        it('should NOT set selected tab if disabled', () => {
            initComponent();
            loginConfigMock.selectedTabEnabled = false;
            loginStoreServiceMock.SelectedTab = 'connectcardoption';
            const spy = spyOn(component, 'selectLoginOption');
            component.ngOnInit();

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('isFormInvalid', () => {
        it('should be false if disableLoginOnFormInvalid is false', () => {
            loginConfigMock.disableLoginOnFormInvalid = false;
            initComponent();

            expect(component.isFormInvalid).toBeFalse();
        });

        it('should be false if disableLoginOnFormInvalid is true and form is valid', () => {
            loginConfigMock.disableLoginOnFormInvalid = true;
            initComponent();
            component.formGroup.setValue({
                username: 'test',
                password: 'test',
                captcharesponse: 'fdsafda',
                rememberme: false,
                prefillusername: true,
                dateOfBirth: 'dfsafda',
            });

            fixture.detectChanges();

            expect(component.isFormInvalid).toBeFalse();
        });

        it('should be true if disableLoginOnFormInvalid is true and form is valid', () => {
            loginConfigMock.disableLoginOnFormInvalid = true;
            initComponent();

            expect(component.isFormInvalid).toBeTrue();
        });
    });

    describe('login method', () => {
        beforeEach(() => {
            initComponent();

            component.formGroup.get('username')!.setValue('test');
            component.formGroup.get('password')!.setValue('123123');
            component.formGroup.get('dateOfBirth')!.setValue('2018-01-01');
        });

        it('should call api.post login on login method called', () => {
            navigationServiceMock.location.search.set('brandId', 'BWIN');

            component.login();

            expect(loginSpinnerServiceMock.show).toHaveBeenCalled();
            loginResourceServiceMock.login.completeWith(loginResponse);
            expect(loginStoreServiceMock.LastVisitor).toEqual('test');
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.PRELOGIN,
                parameters: {
                    userName: component.formGroup.get('username')!.value,
                    password: component.formGroup.get('password')!.value,
                    prefillUserName: true,
                    rememberMe: false,
                },
            });

            expect(loginResourceServiceMock.login).toHaveBeenCalledWith(component.formGroup.value, {
                showSpinner: false,
                messageQueueScope: MessageScope.Login,
            });
            expect(component.formGroup.value.brandId).toBe('BWIN');
        });

        it('should call successResponse if isCompleted is true', () => {
            component.login();

            loginResourceServiceMock.login.completeWith({ isCompleted: true });

            expect(loginResourceServiceMock.login).toHaveBeenCalledWith(component.formGroup.value, {
                showSpinner: false,
                messageQueueScope: MessageScope.Login,
            });
        });

        it('should track login success when data.completed', () => {
            component.hasEntryMessage = true;
            component.selectedLoginOption = 'userpwd';
            component.login();
            loginResourceServiceMock.login.next({ isCompleted: true });
            expect(trackingServiceMock.trackLoginSuccess).toHaveBeenCalledWith({
                hasEntryMessage: component.hasEntryMessage,
            });
            expect(trackingServiceMock.trackLoginBtnClicked).toHaveBeenCalledWith('userpwd');
        });

        it('should track track fast-login setting when data.completed', () => {
            enableFastLoginOptions();
            initComponent();
            component.formGroup.get('username')?.setValue('username');
            component.formGroup.get('password')?.setValue('password');

            component.login();
            loginResourceServiceMock.login.next({ isCompleted: true });

            expect(trackingServiceMock.trackFastLoginSetting).toHaveBeenCalledWith(FastLoginValue.FastLoginDisabled);
        });

        it('should throw reCaptcha missing error', () => {
            component.login();

            loginResourceServiceMock.login.error({ data: { errorCode: 1911 } });
            expect(loginServiceMock.loginFailed).toHaveBeenCalled();
        });

        it('should throw password missing error', () => {
            component.login();

            loginResourceServiceMock.login.error({ data: { errorCode: 1910 } });
            expect(loginServiceMock.loginFailed).toHaveBeenCalled();
        });

        it('should reset login form', () => {
            loginConfigMock.resetLoginFormErrorCodes = ['1910'];
            component.formGroup.controls['username']?.markAsTouched();
            component.formGroup.controls['password']?.markAsTouched();

            component.login();
            loginResourceServiceMock.login.error({ errorCode: '1910' });

            expect(component.formGroup.controls['username']?.value).toBe('');
            expect(component.formGroup.controls['password']?.value).toBe('');
            expect(component.formGroup.controls['username']?.touched).toBeFalse();
            expect(component.formGroup.controls['password']?.touched).toBeFalse();
        });

        it('should show custom error message if username or password are empty', () => {
            component.formGroup.get('username')?.reset();
            component.formGroup.get('password')?.reset();

            const formTouchedSpy = spyOn(component.formGroup, 'markAllAsTouched');
            const formEnableSpy = spyOn(component.formGroup, 'enable');

            component.login();

            expect(formTouchedSpy).toHaveBeenCalled();
            expect(formEnableSpy).toHaveBeenCalled();
            expect(messageQueueServiceMock.clear).toHaveBeenCalled();
            expect(messageQueueServiceMock.add).toHaveBeenCalledOnceWith({
                scope: MessageScope.Login,
                html: 'Required',
                type: MessageType.Error,
                lifetime: MessageLifetime.Single,
            });
        });
    });

    describe('register', () => {
        beforeEach(() => {
            loginConfigMock.loginOptions = ['userpwdoption', 'connectcardoption'];
        });

        it('should show button when enabled', () => {
            loginConfigMock.showRegisterButton = true;
            initComponent();
            expect(component.showRegisterButton).toBeTrue();
        });

        it('should track when called', () => {
            initComponent();
            component.selectedLoginOption = 'userpwdoption';
            component.register();
            expect(trackingServiceMock.trackRegisterBtnClicked).toHaveBeenCalled();
            expect(trackingServiceMock.trackTabbedLoginAction).toHaveBeenCalledWith({
                actionEvent: 'click',
                locationEvent: 'connect card login screen',
                eventDetails: 'create an account link',
            });
        });

        it('should go to register page when called', () => {
            initComponent();
            component.register();
            expect(loginNavigationServiceMock.goToRegistration).toHaveBeenCalled();
        });

        it('should send native event when config.useOpenRegistrationEvent is true', () => {
            loginConfigMock.useOpenRegistrationEvent = true;
            initComponent();
            component.register();
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({ eventName: NativeEventType.OPENREGISTRATIONSCREEN });
        });
    });

    describe('password hints enabled:', () => {
        beforeEach(() => {
            loginConfigMock.passwordHintsOnNthAttempt = 1;
        });

        it('should configure password validators', () => {
            initComponent();
            expect(validationHelper.createValidators).toHaveBeenCalledWith('password');
            expect(validationHelper.createPasswordValidators).toHaveBeenCalledTimes(1);
        });

        it('should overwrite general error message', () => {
            loginContentServiceMock.content.form['password']!.validation![CommonMessagesMock.GeneralValidationErrorKey] = 'replace this';
            initComponent();
            expect(component.loginContentService.content.form['password']!.validation![CommonMessagesMock.GeneralValidationErrorKey]).toBeNull();
        });

        it('should be disabled when not all required controls have a value', () => {
            initComponent();

            const password = component.formGroup.get('username')!;
            const username = component.formGroup.get('password')!;
            const dob = component.formGroup.get('dateOfBirth')!;

            expect(component.disabled).toBeTrue();

            password.setErrors(null);
            expect(component.disabled).toBeTrue();

            username.setErrors(null);
            expect(component.disabled).toBeTrue();

            dob.setErrors(null);
            expect(component.disabled).toBeFalse();
        });

        it('login() should activate hints and highlight password message', () => {
            initComponent();

            const password = component.formGroup.get('password')!;
            component.formGroup.get('username')?.setValue('username');
            password?.setValue('password');
            password.setErrors({
                minlength: true,
            });

            component.login();

            expect(component.showValidationHint).toBeTrue();
            expect(component.highlightHints).toBeTrue();
        });

        it('login() should activate hints and highlight password message on 2nd attempt', () => {
            loginConfigMock.passwordHintsOnNthAttempt = 2;
            initComponent();

            const password = component.formGroup.get('password');
            component.formGroup.get('username')?.setValue('username');
            password?.setValue('password');
            password?.setErrors({
                minlength: true,
            });

            component.login();

            expect(component.showValidationHint).toBeFalsy();
            expect(component.highlightHints).toBeFalse();

            component.login();

            expect(component.showValidationHint).toBeTrue();
            expect(component.highlightHints).toBeTrue();
        });

        it('passwordfocus() should activate hints', () => {
            initComponent();
            component.passwordfocus();
            expect(component.showValidationHint).toBeTrue();
        });
    });

    it('onLoginMessagesLoaded() should call trackLoaded()', () => {
        initComponent();
        component.onLoginMessagesLoaded([{ html: 'markup' }] as any);
        expect(component.hasEntryMessage).toBeTrue();
    });

    it('should set login message when loginmessageKey passed', () => {
        initComponent();
        component.loginMessageKey = 'messageKey';
        component.ngOnInit();
        expect(loginMessagesServiceMock.setLoginMessage).toHaveBeenCalledWith('messageKey');
    });

    it('should set login message via url evaluation', () => {
        initComponent();
        expect(loginMessagesServiceMock.evaluateUrlAndAddMessage).toHaveBeenCalled();
    });

    describe('connect card:', () => {
        it('onConnectCardSubmitted(...) should call loginResponseHandlerService.handleResponse on success', () => {
            loginConfigMock.rememberMeEnabled = true;
            initComponent();
            component.selectedLoginOption = 'connectcardoption';
            const model = {
                connectCardNumber: '123',
                pin: 236,
                rememberme: true,
                captcharesponse: '6985413',
                loginType: LoginType.ConnectCard,
            };
            component.onConnectCardSubmitted(model);
            loginResourceServiceMock.login.completeWith(loginResponse);

            expect(loginResourceServiceMock.login).toHaveBeenCalledWith(model, {
                showSpinner: false,
                messageQueueScope: MessageScope.Login,
            });
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.PRELOGIN,
                parameters: {
                    userName: model.connectCardNumber,
                    password: model.pin,
                    prefillUserName: true,
                    rememberMe: true,
                },
            });
            expect(loginResponseHandlerMock.handleResponse).toHaveBeenCalledWith(loginResponse, undefined);
            expect(trackingServiceMock.trackLoginBtnClicked).toHaveBeenCalledWith('connectcardoption');
        });

        it('should call loginService.loginFailed on error', () => {
            initComponent();
            component.selectedLoginOption = 'connectcardoption';
            const model = {
                connectCardNumber: '123',
                pin: 236,
                rememberme: true,
                captcharesponse: '6985413',
                loginType: LoginType.ConnectCard,
            };
            component.onConnectCardSubmitted(model);
            loginResourceServiceMock.login.error('test');
            expect(loginServiceMock.loginFailed).toHaveBeenCalledWith({ reason: 'test', type: LoginType.ConnectCard });
            expect(loginSpinnerServiceMock.hide).toHaveBeenCalled();
        });
    });

    describe('fast login options:', () => {
        it('should select `fast login disabled` option when autologin and biometric authentication not selected', () => {
            enableFastLoginOptions();
            initComponent();

            expect(component.formGroup.get('fastloginenabled')!.value).toEqual(FastLoginValue.FastLoginDisabled);
        });

        it('should select `autologin` option when autologin is selected', () => {
            enableFastLoginOptions();
            wrapperSettingsServiceMock.current.keepMeSignedInEnabled = true;
            initComponent();

            expect(component.formGroup.get('fastloginenabled')!.value).toEqual(FastLoginValue.KeepMeSignedInEnabled);
        });

        it('should select `faceId` option when faceId is selected', () => {
            enableFastLoginOptions();
            wrapperSettingsServiceMock.current.deviceFaceSupported = true;
            wrapperSettingsServiceMock.current.isFaceIDLoginEnabled = true;
            initComponent();

            expect(component.formGroup.get('fastloginenabled')!.value).toEqual(FastLoginValue.IsFaceIDEnabled);
        });

        it('should select `touchId` option when touchId is selected', () => {
            enableFastLoginOptions();
            wrapperSettingsServiceMock.current.deviceTouchSupported = true;
            wrapperSettingsServiceMock.current.isTouchIDLoginEnabled = true;
            initComponent();

            expect(component.formGroup.get('fastloginenabled')!.value).toEqual(FastLoginValue.IsTouchIDEnabled);
        });

        it('should select `touchId` option when touchId and faceId are selected on android', () => {
            enableFastLoginOptions();
            wrapperSettingsServiceMock.current.deviceTouchSupported = true;
            wrapperSettingsServiceMock.current.isTouchIDLoginEnabled = true;
            wrapperSettingsServiceMock.current.deviceFaceSupported = true;
            wrapperSettingsServiceMock.current.isFaceIDLoginEnabled = true;
            initComponent();

            expect(component.formGroup.get('fastloginenabled')!.value).toEqual(FastLoginValue.IsTouchIDEnabled);
        });

        it('should select `faceId` option when touchId and faceId are selected on android', () => {
            enableFastLoginOptions();
            wrapperSettingsServiceMock.current.deviceTouchSupported = true;
            wrapperSettingsServiceMock.current.isTouchIDLoginEnabled = true;
            wrapperSettingsServiceMock.current.deviceFaceSupported = true;
            wrapperSettingsServiceMock.current.isFaceIDLoginEnabled = true;
            deviceServiceMock.isiOS = true;
            initComponent();

            expect(component.formGroup.get('fastloginenabled')!.value).toEqual(FastLoginValue.IsFaceIDEnabled);
        });
    });

    describe('prefill username toggle:', () => {
        beforeEach(() => {
            loginStoreServiceMock.LastVisitor = 'last visitor';
            loginConfigMock.prefillUsernameToggleEnabled = true;
        });

        it('should prefill username if not enabled', () => {
            loginConfigMock.prefillUsernameToggleEnabled = false;
            initComponent(); // act
            expect(component.formGroup.value.username).toEqual(loginStoreServiceMock.LastVisitor);
        });

        it('should not prefill initially', () => {
            initComponent(); // act
            expect(component.formGroup.value.username).toEqual('');
        });

        it('should prefill if cookie value is "true"', () => {
            cookieServiceMock.get.and.callFake((name: string) => '' + ('pf-u' === name));
            initComponent(); // act
            expect(component.formGroup.value.username).toEqual(loginStoreServiceMock.LastVisitor);
        });

        it('should call shouldPrefillUsername on loginService when true', () => {
            initComponent();
            const prefillToggle = component.formGroup.get('prefillusername')!;

            prefillToggle.setValue(true); // act

            expect(loginService2Mock.shouldPrefillUsername).toHaveBeenCalledWith(true);
        });

        it('should call shouldPrefillUsername on loginService when false', () => {
            initComponent();
            const prefillToggle = component.formGroup.get('prefillusername')!;

            prefillToggle.setValue(false); // act

            expect(loginService2Mock.shouldPrefillUsername).toHaveBeenCalledWith(false);
        });
    });

    describe('showConnectCardButton', () => {
        it('should show connect card button', () => {
            loginConfigMock.v2 = true;
            loginConfigMock.loginOptions = ['userpwdoption', 'connectcardoption'];
            initComponent();
            component.selectedLoginOption = 'userpwdoption';
            expect(component.showConnectCardButton).toBeTrue();
        });

        it('should not show connect card button if v2 disabled', () => {
            loginConfigMock.v2 = false;
            loginConfigMock.loginOptions = ['userpwdoption', 'connectcardoption'];
            initComponent();
            component.selectedLoginOption = 'userpwdoption';
            expect(component.showConnectCardButton).toBeFalse();
        });

        it('should not show connect card button if option already selected', () => {
            loginConfigMock.v2 = false;
            loginConfigMock.loginOptions = ['userpwdoption', 'connectcardoption'];
            initComponent();
            component.selectedLoginOption = 'connectcardoption';
            expect(component.showConnectCardButton).toBeFalse();
        });
    });

    describe('close', () => {
        it('should clear message queue and trigger relevant tracking', () => {
            loginConfigMock.loginOptions = ['connectcardoption'];
            initComponent();
            component.selectedLoginOption = 'connectcardoption';
            component.close();

            expect(messageQueueServiceMock.clear).toHaveBeenCalledWith({ clearPersistent: true });
            expect(trackingServiceMock.trackClosedAction).toHaveBeenCalled();
            expect(trackingServiceMock.trackLoginLoadClosedEvent).toHaveBeenCalledWith('close', undefined);
            expect(trackingServiceMock.trackTabbedLoginAction).toHaveBeenCalledWith({
                actionEvent: 'close',
                locationEvent: 'connect card login screen',
                eventDetails: 'connect card login screen',
            });
        });
    });

    describe('back', () => {
        it('should go back to userpwdoption', () => {
            loginConfigMock.v2 = true;
            loginConfigMock.loginOptions = ['userpwdoption', 'connectcardoption'];
            initComponent();
            component.selectedLoginOption = 'connectcardoption';
            component.back();

            expect(component.selectedLoginOption).toBe('userpwdoption');
            expect(trackingServiceMock.trackTabbedLoginAction).toHaveBeenCalledWith({
                actionEvent: 'back',
                locationEvent: 'connect card login screen',
                eventDetails: 'connect card login screen',
            });
        });
    });

    describe('loginWithConnectCard', () => {
        it('should go go to loginWithConnectCard option', () => {
            loginConfigMock.v2 = true;
            loginConfigMock.loginOptions = ['userpwdoption', 'connectcardoption'];
            initComponent();
            component.selectedLoginOption = 'userpwdoption';
            component.loginWithConnectCard();
            expect(component.selectedLoginOption).toBe('connectcardoption');
            expect(trackingServiceMock.trackConnectCardClicked).toHaveBeenCalled();
        });
    });

    describe('getToggleProvidersButtonValue', () => {
        it('should return value', () => {
            loginContentServiceMock.content.form['toggleprovidersbutton']!.values?.push({
                text: '3',
                value: 'visibleCount',
            });
            initComponent();

            const buttonValue = component.getToggleProvidersButtonValue('visibleCount');

            expect(buttonValue).toBe('3');
        });

        it('should return empty string if value not found', () => {
            loginContentServiceMock.content.form['toggleprovidersbutton']!.values?.push({
                text: 'more',
                value: 'More',
            });
            initComponent();

            const buttonValue = component.getToggleProvidersButtonValue('less');

            expect(buttonValue).toBe('');
        });
    });

    describe('getProviderIconStyle', () => {
        it('should return background image style', () => {
            (<any>loginContentServiceMock.content.children['facebookimage']) = {
                image: { src: LoginProvider.FACEBOOK },
            };
            initComponent();

            const backgroundImage = component.getProviderIconStyle(LoginProvider.FACEBOOK);

            expect(backgroundImage).toEqual({ 'background-image': `url(${LoginProvider.FACEBOOK})` });
        });

        it('should return null if item is missing', () => {
            initComponent();

            const backgroundImage = component.getProviderIconStyle(LoginProvider.YAHOO);

            expect(backgroundImage).toBeNull();
        });
    });

    describe('onShowMoreProvidersClick', () => {
        it('should toggle and track show more providers', () => {
            initComponent();

            expect(component.showLessProviders).toBeFalse();

            component.onShowMoreProvidersClick();

            expect(component.showLessProviders).toBeTrue();
            expect(trackingServiceMock.trackShowMoreProviders).toHaveBeenCalled();
        });
    });

    describe('ngOnDestroy', () => {
        it('should close login spinner', () => {
            initComponent();

            component.ngOnDestroy();

            expect(loginSpinnerServiceMock.hide).toHaveBeenCalled();
        });
    });

    function enableFastLoginOptions() {
        loginConfigMock.fastLoginOptionsEnabled = true;
        loginServiceMock.keepMeSignedInToggleVisible = true;
    }
});
