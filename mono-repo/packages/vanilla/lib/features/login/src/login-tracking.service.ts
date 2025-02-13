import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { CookieName, CookieService, FastLoginValue, LoginFailedReason, TrackingService } from '@frontend/vanilla/core';
import { LoginConfig } from '@frontend/vanilla/shared/login';

/** @stable */
export enum LoginErrorCode {
    DUPLICATE_EMAIL = '604',
    SELF_EXCLUSION = '699',
    SELF_EXCLUSION_COOL_OFF = '1750',
    SELF_EXCLUSION_RG_CLOSED = '101',
    SELF_EXCLUSION_GAMSTOP_RG_CLOSED = '102',
    SELF_EXCLUSION_UNKNOWN_ERROR = '610',
}

export interface TabbedLoginAction {
    categoryEvent?: string;
    actionEvent?: string;
    labelEvent?: string;
    locationEvent?: string;
    positionEvent?: string;
    eventDetails?: string;
}

@Injectable({ providedIn: 'root' })
export class LoginTrackingService {
    constructor(
        private loginConfig: LoginConfig,
        private cookieService: CookieService,
        private trackingService: TrackingService,
    ) {}

    private static trackFieldRequired(formErrors: string[], formField: AbstractControl, trackFieldName: string) {
        const fieldInputErrors = formField && !formField.valid && formField.errors;
        if (fieldInputErrors) {
            if (fieldInputErrors['required']) {
                formErrors.push(trackFieldName);
            }
        }
    }

    trackClosedAction() {
        this.trackAction('Login_Centered_LoginClosed');
    }

    trackLoginLoadClosedEvent(action: string, dialogOpen: boolean) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'Login Process',
            'component.LabelEvent': 'Login screen',
            'component.ActionEvent': action,
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': dialogOpen ? 'Login cta' : 'redirect',
            'component.EventDetails': 'login screen',
            'component.URLClicked': 'not applicable',
        });
    }

    trackRegisterBtnClicked() {
        if (this.loginConfig.v2) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.CategoryEvent': 'Login Process',
                'component.LabelEvent': 'Login screen',
                'component.ActionEvent': 'click',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'footer',
                'component.EventDetails': 'create an account',
                'component.URLClicked': 'not applicable',
            });
        } else {
            this.trackAction('Login_Centered_Register_Clicked');
        }
    }

    trackRememberMeClicked(checked: boolean) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.ActionEvent': checked ? 'enable' : 'disable',
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login options',
            'component.LocationEvent': 'checkbox',
            'component.PositionEvent': 'not applicable',
            'component.EventDetails': 'remember me',
            'component.URLClicked': 'not applicable',
        });
    }

    trackRememberMeTooltipClicked() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.ActionEvent': 'click',
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.LocationEvent': 'tooltip',
            'component.PositionEvent': 'not applicable',
            'component.EventDetails': 'remember me',
            'component.URLClicked': 'not applicable',
        });
    }

    trackConnectCardClicked() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'not applicable',
            'component.EventDetails': 'log in with connect card',
            'component.URLClicked': 'not applicable',
        });
        this.setLoginType('Login_ConnectCard');
    }

    trackPrefillUsernameLoaded() {
        this.trackAction('RememberUsername_Loaded');
    }

    trackPrefillUsernameClicked(toggled: boolean) {
        if (this.loginConfig.v2) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.ActionEvent': 'click',
                'component.CategoryEvent': 'Login',
                'component.LabelEvent': 'Remember password',
                'component.LocationEvent': 'Login screen',
                'component.PositionEvent': toggled ? 'on' : 'off',
                'component.EventDetails': 'remember password toggle',
                'component.URLClicked': 'not applicable',
            });
        } else {
            this.trackAction('RememberUsername_Clicked');
        }
    }

    trackFastLoginToggle(toggled: any) {
        if (this.loginConfig.v2) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.ActionEvent': 'click',
                'component.CategoryEvent': 'Login',
                'component.LabelEvent': 'face id',
                'component.LocationEvent': 'Login screen',
                'component.PositionEvent': toggled ? 'on' : 'off',
                'component.EventDetails': 'face id toggle',
                'component.URLClicked': 'not applicable',
            });
        }
    }

    trackFastLoginSetting(fastLoginValue: FastLoginValue) {
        let action;
        switch (fastLoginValue) {
            case FastLoginValue.FastLoginDisabled:
                action = 'Login_off';
                break;
            case FastLoginValue.IsTouchIDEnabled:
                action = 'Login_TouchID';
                break;
            case FastLoginValue.IsFaceIDEnabled:
                action = 'Login_FaceID';
                break;
            case FastLoginValue.KeepMeSignedInEnabled:
                action = 'Login_Auto';
                break;
            default:
                action = 'Login_off';
                break;
        }
        this.trackAction(action, 'Event.FastLogin');

        if (action !== 'Login_off') {
            this.setLoginType(action);
        }
    }

    trackLoginSuccess(options?: { hasEntryMessage?: boolean }) {
        options = options || {};
        let action = 'Login_LoginSuccess';
        if (options.hasEntryMessage) {
            action += '_EntryMessage';
        }
        this.trackAction(action);
    }

    trackLoginFailed() {
        this.trackAction('Login_Header_LastField_Login');
        this.trackAction('Login_Centered_Credentials_Invalid');
    }

    trackRecaptchaShown() {
        this.trackAction('Login_Centered_Recaptcha_Shown');
    }

    trackDateChanged(type: 'Day' | 'Month' | 'Year') {
        switch (type) {
            case 'Day':
                this.trackAction('Login_Centered_LastField_DD');
                break;
            case 'Month':
                this.trackAction('Login_Centered_LastField_MM');
                break;
            case 'Year':
                this.trackAction('Login_Centered_LastField_YYYY');
                break;
        }
    }

    trackPasswordError(type: 'Number' | 'Letter' | 'MinMax') {
        this.trackAction(`Login_Password_error_${type}`);
    }

    trackTabbedLoginAction(options?: TabbedLoginAction) {
        options = options || {};
        if (options.eventDetails) {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.ActionEvent': options.actionEvent,
                'component.CategoryEvent': 'login process',
                'component.LabelEvent': 'login options',
                'component.LocationEvent': options.locationEvent,
                'component.PositionEvent': 'not applicable',
                'component.EventDetails': options.eventDetails,
                'component.URLClicked': 'not applicable',
                'page.siteSection': 'Authentication',
            });
        }
    }

    trackLoginBtnClicked(selectedLoginOption: string) {
        if (selectedLoginOption) {
            this.trackTabbedLoginAction({
                locationEvent: `${selectedLoginOption} login screen`,
                actionEvent: 'click',
                eventDetails: selectedLoginOption,
            });
        } else {
            this.trackingService.triggerEvent('Event.Tracking', {
                'component.CategoryEvent': 'Login Process',
                'component.LabelEvent': 'Login screen',
                'component.ActionEvent': 'click',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'login screen',
                'component.EventDetails': 'login',
                'component.URLClicked': 'not applicable',
            });
        }
    }

    trackTabbedLoginFailed(trackFields: { formField: AbstractControl | null; trackFieldName: string }[], selectedLoginOption?: string) {
        if (selectedLoginOption) {
            const formErrors: string[] = [];
            trackFields.forEach((trackField) => {
                if (trackField.formField != null) {
                    LoginTrackingService.trackFieldRequired(formErrors, trackField.formField, trackField.trackFieldName);
                }
            });
            this.trackTabbedLoginAction({
                actionEvent: formErrors.length ? formErrors.join('|') : 'Credentials',
                eventDetails: selectedLoginOption,
                locationEvent: 'Login Tabbed',
            });
        }
    }

    trackLoginWithProvider(provider: string, options?: TabbedLoginAction) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': options?.categoryEvent || 'login',
            'component.LabelEvent': options?.labelEvent || `${provider} login`,
            'component.LocationEvent': options?.locationEvent || 'login screen',
            'component.ActionEvent': options?.actionEvent,
            'component.PositionEvent': options?.positionEvent || 'not applicable',
            'component.EventDetails': options?.eventDetails,
            'component.URLClicked': 'not applicable',
        });
        this.setLoginType(`Login_${provider}`);
    }

    trackContinueWithProvider(provider: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'Login Process',
            'component.LabelEvent': provider,
            'component.LocationEvent': `${provider} login`,
            'component.ActionEvent': `login with ${provider} - clicked`,
            'component.PositionEvent': 'login screen',
            'component.EventDetails': `user has clicked on login with ${provider} cta`,
            'component.URLClicked': 'not applicable',
        });
        this.setLoginType(`Login_${provider}`);
    }

    trackProviderWelcomeScreen(provider: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login',
            'component.LabelEvent': `${provider} login`,
            'component.LocationEvent': 'existing account login screen',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'existing account flow',
            'component.EventDetails': 'existing account login screen',
            'component.URLClicked': 'not applicable',
        });
    }

    trackLoginWithDifferentProvider() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login',
            'component.LabelEvent': 'login process',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'login acceptance screen',
            'component.EventDetails': 'login with different method cta',
            'component.URLClicked': 'not applicable',
        });
    }

    trackCloseProviderWelcomeScreen() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login',
            'component.LabelEvent': 'login process',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'login acceptance screen',
            'component.EventDetails': 'close',
            'component.URLClicked': 'not applicable',
        });
    }

    trackShowMoreProviders() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login',
            'component.LabelEvent': 'other login options',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'login screen',
            'component.EventDetails': 'see more options link',
            'component.URLClicked': 'not applicable',
        });
    }

    trackMobileNumberChanged(isMobile: boolean, tabbedLogin: boolean) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.ActionEvent': 'field type changed',
            'component.PositionEvent': isMobile ? 'mobile number' : 'email',
            'component.LocationEvent': tabbedLogin ? 'login tabbed' : 'login standard',
            'component.EventDetails': isMobile ? 'use mobile to login' : 'use email to login',
            'component.URLClicked': 'not applicable',
        });
    }

    trackErrorCode(reason?: LoginFailedReason) {
        if (!reason?.errorCode) {
            return;
        }

        const trackingData = {
            'component.CategoryEvent': 'gambling controls',
            'component.LabelEvent': 'self exclusion interceptor',
            'component.ActionEvent': 'load',
            'component.LocationEvent': 'error message',
            'component.EventDetails': reason?.posApiErrorMessage || '',
            'component.URLClicked': 'not applicable',
        };

        switch (reason.errorCode) {
            case LoginErrorCode.DUPLICATE_EMAIL:
                this.trackingService.updateDataLayer({
                    'page.referringAction': 'Login_Header_DuplicateEmail_Error',
                    'page.siteSection': 'Authentication',
                });
                break;
            case LoginErrorCode.SELF_EXCLUSION:
            case LoginErrorCode.SELF_EXCLUSION_RG_CLOSED:
                this.trackingService.triggerEvent('contentView', {
                    ...trackingData,
                    'component.PositionEvent': 'not expired',
                });
                break;
            case LoginErrorCode.SELF_EXCLUSION_COOL_OFF:
                this.trackingService.triggerEvent('contentView', {
                    ...trackingData,
                    'component.PositionEvent': 'expired',
                });
                break;
            case LoginErrorCode.SELF_EXCLUSION_GAMSTOP_RG_CLOSED:
                this.trackingService.triggerEvent('contentView', {
                    ...trackingData,
                    'component.PositionEvent': 'not applicable',
                    'component.LocationEvent': 'gamstop interceptor',
                    'component.EventDetails': 'gamstop interceptor',
                });
                break;
            case LoginErrorCode.SELF_EXCLUSION_UNKNOWN_ERROR:
                this.trackingService.triggerEvent('contentView', {
                    ...trackingData,
                    'component.PositionEvent': 'not defined',
                });
                break;
        }
    }

    reportLoginError(reason?: LoginFailedReason) {
        const posApiErrorMessage = reason?.posApiErrorMessage || '';
        const loginAttemptsToBlock = reason?.errorValues?.find(
            (x: { [key: string]: string }) => x.key === 'REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK',
        );
        const loginAttemptsLeft = loginAttemptsToBlock ? ` - attempts left: ${loginAttemptsToBlock.value}` : '';

        this.trackingService.reportErrorObject({
            type: 'LoginError',
            message: posApiErrorMessage + loginAttemptsLeft,
            code: reason?.errorCode || '',
        });
    }

    private trackAction(action: string, eventName = 'Event.Functionality.Login') {
        this.trackingService.triggerEvent(eventName, {
            'page.referringAction': action,
            'page.siteSection': 'Authentication',
        });
    }

    private setLoginType(loginType: string) {
        this.cookieService.put(CookieName.LoginType, loginType);
    }
}
