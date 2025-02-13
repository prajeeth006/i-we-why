import { TestBed } from '@angular/core/testing';

import { FastLoginValue, LoginProvider } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { LoginErrorCode, LoginTrackingService } from '../src/login-tracking.service';
import { LoginConfigMock } from './login.mocks';

describe('LoginTrackingService', () => {
    let service: LoginTrackingService;
    let trackingServiceMock: TrackingServiceMock;
    let loginConfigMock: LoginConfigMock;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        loginConfigMock = MockContext.useMock(LoginConfigMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [LoginTrackingService, MockContext.providers],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(LoginTrackingService);
    });

    it('should not be undefined', () => {
        expect(service).toBeDefined();
    });

    it('should track closed', () => {
        service.trackClosedAction();
        expectTrackedEvent('Login_Centered_LoginClosed');
    });

    it('should track rememberme button clicked', () => {
        service.trackRememberMeClicked(true);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.ActionEvent': 'enable',
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login options',
            'component.LocationEvent': 'checkbox',
            'component.PositionEvent': 'not applicable',
            'component.EventDetails': 'remember me',
            'component.URLClicked': 'not applicable',
        });

        service.trackRememberMeClicked(false);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.ActionEvent': 'disable',
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login options',
            'component.LocationEvent': 'checkbox',
            'component.PositionEvent': 'not applicable',
            'component.EventDetails': 'remember me',
            'component.URLClicked': 'not applicable',
        });
    });

    it('should track prefill username clicked v2', () => {
        loginConfigMock.v2 = true;
        service.trackPrefillUsernameClicked(true);
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.ActionEvent': 'click',
            'component.CategoryEvent': 'Login',
            'component.LabelEvent': 'Remember password',
            'component.LocationEvent': 'Login screen',
            'component.PositionEvent': 'on',
            'component.EventDetails': 'remember password toggle',
            'component.URLClicked': 'not applicable',
        });
    });

    it('should track register button clicked', () => {
        service.trackRegisterBtnClicked();
        expectTrackedEvent('Login_Centered_Register_Clicked');
    });

    describe('should track fast login', () => {
        it('disabled by default', () => {
            service.trackFastLoginSetting(<any>undefined);
            expectTrackedEvent('Login_off', 'Event.FastLogin');
            expect(cookieServiceMock.put).not.toHaveBeenCalled();
        });
        it('disabled', () => {
            service.trackFastLoginSetting(FastLoginValue.FastLoginDisabled);
            expectTrackedEvent('Login_off', 'Event.FastLogin');
            expect(cookieServiceMock.put).not.toHaveBeenCalled();
        });
        it('touch id enabled', () => {
            service.trackFastLoginSetting(FastLoginValue.IsTouchIDEnabled);
            expectTrackedEvent('Login_TouchID', 'Event.FastLogin');
            expect(cookieServiceMock.put).toHaveBeenCalledWith('loginType', 'Login_TouchID');
        });
        it('keep me signed in enabled', () => {
            service.trackFastLoginSetting(FastLoginValue.KeepMeSignedInEnabled);
            expectTrackedEvent('Login_Auto', 'Event.FastLogin');
            expect(cookieServiceMock.put).toHaveBeenCalledWith('loginType', 'Login_Auto');
        });
    });

    it('should track login success', () => {
        service.trackLoginSuccess();
        expectTrackedEvent('Login_LoginSuccess');
    });

    it('should track login success with entry message suffix', () => {
        service.trackLoginSuccess({ hasEntryMessage: true });
        expectTrackedEvent('Login_LoginSuccess_EntryMessage');
    });

    it('should track login failed', () => {
        service.trackLoginFailed();
        expectTrackedEvent('Login_Header_LastField_Login');
        expectTrackedEvent('Login_Centered_Credentials_Invalid');
    });

    it('should track reCaptcha shown', () => {
        service.trackRecaptchaShown();
        expectTrackedEvent('Login_Centered_Recaptcha_Shown');
    });

    describe('should track date', () => {
        it('day changed', () => {
            service.trackDateChanged('Day');
            expectTrackedEvent('Login_Centered_LastField_DD');
        });
        it('month changed', () => {
            service.trackDateChanged('Month');
            expectTrackedEvent('Login_Centered_LastField_MM');
        });
        it('year changed', () => {
            service.trackDateChanged('Year');
            expectTrackedEvent('Login_Centered_LastField_YYYY');
        });
    });

    describe('should track password error', () => {
        it('Number', () => {
            service.trackPasswordError('Number');
            expectTrackedEvent(`Login_Password_error_Number`);
        });
        it('Letter', () => {
            service.trackPasswordError('Letter');
            expectTrackedEvent('Login_Password_error_Letter');
        });
        it('MinMax', () => {
            service.trackPasswordError('MinMax');
            expectTrackedEvent('Login_Password_error_MinMax');
        });
    });

    describe('tabbed login', () => {
        it('trackTabbedLoginAction', () => {
            service.trackTabbedLoginAction({
                actionEvent: 'action',
                locationEvent: 'location',
                eventDetails: 'event',
            });
            expectTabbedLoginEvent({ action: 'action', location: 'location', eventDetails: 'event' });
        });

        it('should track login button clicked', () => {
            service.trackLoginBtnClicked('selectedOption');
            expectTabbedLoginEvent({
                action: 'click',
                eventDetails: 'selectedOption',
                location: 'selectedOption login screen',
            });
        });

        it('should track login failed', () => {
            service.trackTabbedLoginFailed(
                [{ formField: { valid: false, errors: { required: true } } as any, trackFieldName: 'username' }],
                'selectedOption',
            );
            expectTabbedLoginEvent({ action: 'username', eventDetails: 'selectedOption', location: 'Login Tabbed' });
        });
    });

    describe('trackLoginWithProvider', () => {
        it('should track login', () => {
            service.trackLoginWithProvider(LoginProvider.YAHOO, {
                actionEvent: 'ae',
                eventDetails: 'ed',
            });

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'login',
                'component.LabelEvent': `${LoginProvider.YAHOO} login`,
                'component.ActionEvent': 'ae',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'login screen',
                'component.EventDetails': 'ed',
                'component.URLClicked': 'not applicable',
            });

            expect(cookieServiceMock.put).toHaveBeenCalledWith('loginType', `Login_${LoginProvider.YAHOO}`);
        });
    });

    describe('trackContinueWithProvider', () => {
        it('should track and put `loginType` cookie', () => {
            service.trackContinueWithProvider(LoginProvider.FACEBOOK);

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'Login Process',
                'component.LabelEvent': LoginProvider.FACEBOOK,
                'component.LocationEvent': `${LoginProvider.FACEBOOK} login`,
                'component.ActionEvent': `login with ${LoginProvider.FACEBOOK} - clicked`,
                'component.PositionEvent': 'login screen',
                'component.EventDetails': `user has clicked on login with ${LoginProvider.FACEBOOK} cta`,
                'component.URLClicked': 'not applicable',
            });

            expect(cookieServiceMock.put).toHaveBeenCalledWith('loginType', `Login_${LoginProvider.FACEBOOK}`);
        });
    });

    describe('trackProviderWelcomeScreen', () => {
        it('should track', () => {
            service.trackProviderWelcomeScreen(LoginProvider.FACEBOOK);

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'login',
                'component.LabelEvent': `${LoginProvider.FACEBOOK} login`,
                'component.LocationEvent': 'existing account login screen',
                'component.ActionEvent': 'load',
                'component.PositionEvent': 'existing account flow',
                'component.EventDetails': 'existing account login screen',
                'component.URLClicked': 'not applicable',
            });
        });
    });

    describe('trackLoginWithDifferentProvider', () => {
        it('should track', () => {
            service.trackLoginWithDifferentProvider();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'login',
                'component.LabelEvent': 'login process',
                'component.ActionEvent': 'click',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'login acceptance screen',
                'component.EventDetails': 'login with different method cta',
                'component.URLClicked': 'not applicable',
            });
        });
    });

    describe('trackCloseProviderWelcomeScreen', () => {
        it('should track', () => {
            service.trackCloseProviderWelcomeScreen();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'login',
                'component.LabelEvent': 'login process',
                'component.ActionEvent': 'click',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'login acceptance screen',
                'component.EventDetails': 'close',
                'component.URLClicked': 'not applicable',
            });
        });
    });

    describe('trackShowMoreProviders()', () => {
        it('should track click', () => {
            service.trackShowMoreProviders();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
                'component.CategoryEvent': 'login',
                'component.LabelEvent': 'other login options',
                'component.ActionEvent': 'click',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'login screen',
                'component.EventDetails': 'see more options link',
                'component.URLClicked': 'not applicable',
            });
        });
    });

    describe('trackConnectCardClicked', () => {
        it('should store value in the cookies', () => {
            service.trackConnectCardClicked();

            expect(cookieServiceMock.put).toHaveBeenCalledWith('loginType', 'Login_ConnectCard');
        });
    });

    describe('trackErrorCode', () => {
        const trackingData = {
            'component.CategoryEvent': 'gambling controls',
            'component.LabelEvent': 'self exclusion interceptor',
            'component.ActionEvent': 'load',
            'component.LocationEvent': 'error message',
            'component.EventDetails': 'the end is nigh!',
            'component.URLClicked': 'not applicable',
        };

        it('should not track if error code is missing', () => {
            service.trackErrorCode({ errorCode: '', posApiErrorMessage: 'the end is nigh!' });

            expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
        });

        it('should update data layer on DUPLICATE_EMAIL error', () => {
            service.trackErrorCode({ errorCode: LoginErrorCode.DUPLICATE_EMAIL, posApiErrorMessage: 'the end is nigh!' });

            expect(trackingServiceMock.updateDataLayer).toHaveBeenCalledWith({
                'page.referringAction': 'Login_Header_DuplicateEmail_Error',
                'page.siteSection': 'Authentication',
            });
        });

        it('should should track SELF_EXCLUSION error', () => {
            service.trackErrorCode({ errorCode: LoginErrorCode.SELF_EXCLUSION, posApiErrorMessage: 'the end is nigh!' });
            service.trackErrorCode({ errorCode: LoginErrorCode.SELF_EXCLUSION_RG_CLOSED, posApiErrorMessage: 'the end is nigh!' });

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledTimes(2);
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
                ...trackingData,
                'component.PositionEvent': 'not expired',
            });
        });

        it('should should track SELF_EXCLUSION_COOL_OFF error', () => {
            service.trackErrorCode({ errorCode: LoginErrorCode.SELF_EXCLUSION_COOL_OFF, posApiErrorMessage: 'the end is nigh!' });

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
                ...trackingData,
                'component.PositionEvent': 'expired',
            });
        });

        it('should should track SELF_EXCLUSION_GAMSTOP_RG_CLOSED error', () => {
            service.trackErrorCode({ errorCode: LoginErrorCode.SELF_EXCLUSION_GAMSTOP_RG_CLOSED, posApiErrorMessage: 'the end is nigh!' });

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
                ...trackingData,
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'gamstop interceptor',
                'component.EventDetails': 'gamstop interceptor',
            });
        });

        it('should should track SELF_EXCLUSION_UNKNOWN_ERROR error', () => {
            service.trackErrorCode({ errorCode: LoginErrorCode.SELF_EXCLUSION_UNKNOWN_ERROR, posApiErrorMessage: 'the end is nigh!' });

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
                ...trackingData,
                'component.PositionEvent': 'not defined',
            });
        });
    });

    describe('reportLoginError', () => {
        it('shoud track error object', () => {
            service.reportLoginError({
                posApiErrorMessage: 'wrong passowrd',
                errorValues: [{ key: 'REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK', value: '2' }],
                errorCode: '601',
            });

            expect(trackingServiceMock.reportErrorObject).toHaveBeenCalledWith({
                type: 'LoginError',
                message: 'wrong passowrd - attempts left: 2',
                code: '601',
            });
        });
    });

    function expectTrackedEvent(action: string, eventName = 'Event.Functionality.Login') {
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith(eventName, {
            'page.referringAction': action,
            'page.siteSection': 'Authentication',
        });
    }

    function expectTabbedLoginEvent(event: { action?: string; location?: string; eventDetails?: string }) {
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.ActionEvent': event.action,
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login options',
            'component.LocationEvent': event.location,
            'component.PositionEvent': 'not applicable',
            'component.EventDetails': event.eventDetails,
            'component.URLClicked': 'not applicable',
            'page.siteSection': 'Authentication',
        });
    }
});
