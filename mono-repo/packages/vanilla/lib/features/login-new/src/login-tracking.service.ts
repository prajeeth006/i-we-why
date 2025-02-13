import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

import { FormFieldTracking, LoginErrorCode, TabbedLoginAction } from './login.models';

@Injectable({ providedIn: 'root' })
export class LoginTrackingService {
    constructor(private trackingService: TrackingService) {}

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

    trackTabbedLoginAction(options?: TabbedLoginAction) {
        options ||= {};

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

    trackConnectCardBackClick() {
        this.trackTabbedLoginAction({
            actionEvent: 'back',
            locationEvent: 'connect card login screen',
            eventDetails: 'connect card login screen',
        });
    }

    trackTabbedLoginFailed(trackFields: FormFieldTracking[], selectedLoginOption?: string) {
        if (selectedLoginOption) {
            const formErrors: string[] = [];

            trackFields.forEach((trackField) => {
                const fieldInputErrors = trackField.formField && !trackField.formField.valid && trackField.formField.errors;

                if (fieldInputErrors && fieldInputErrors['required']) {
                    formErrors.push(trackField.trackFieldName);
                }
            });

            this.trackTabbedLoginAction({
                actionEvent: formErrors.length ? formErrors.join('|') : 'Credentials',
                eventDetails: selectedLoginOption,
                locationEvent: 'Login Tabbed',
            });
        }
    }

    trackLoginSuccess(options?: { hasEntryMessage?: boolean }) {
        options ||= {};
        let action = 'Login_LoginSuccess';

        if (options.hasEntryMessage) {
            action += '_EntryMessage';
        }

        this.trackAction(action);
    }

    trackRecaptchaShown() {
        this.trackAction('Login_Centered_Recaptcha_Shown');
    }

    trackLoginPinShown() {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'pin number screen',
            'component.EventDetails': 'pin number screen',
        });
    }

    trackFastLoginToggle(toggled: boolean) {
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

    trackErrorMessageShown(message: string) {
        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'error message',
            'component.EventDetails': message,
        });
    }

    trackErrorMessageOk(message: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'login process',
            'component.LabelEvent': 'login screen',
            'component.ActionEvent': 'click',
            'component.PositionEvent': message,
            'component.LocationEvent': 'error message',
            'component.EventDetails': 'ok',
        });
    }

    trackErrorCode(reason: any) {
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

    reportLoginError(reason: any) {
        const posApiErrorMessage = reason?.posApiErrorMessage || '';
        const loginAttemptsToBlock = reason?.errorValues?.find(
            (x: { [key: string]: string }) => x['key'] === 'REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK',
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
}
