import { InjectionToken } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { FastLoginValue, LoginFailedOptions, LoginType } from '@frontend/vanilla/core';

export const BETSTATION_LOGIN_ERROR = new InjectionToken<String>('BETSTATION_LOGIN_ERROR');
export const CARD_NUMBER = new InjectionToken<string>('CARD_NUMBER');

/**
 * @whatItDoes Represents an event triggered when the login fails.
 *
 * @stable
 */
export class LoginFailedEvent {
    reason: { errorCode?: string; [x: string]: any } | undefined;
    loginType: LoginType | undefined;

    constructor(options: LoginFailedOptions) {
        if (options) {
            this.reason = options.reason;
            this.loginType = options.type;
        }
    }
}

/**
 * @stable
 */
export interface TabbedLoginAction {
    categoryEvent?: string;
    actionEvent?: string;
    labelEvent?: string;
    locationEvent?: string;
    positionEvent?: string;
    eventDetails?: string;
}

export interface FormFieldTracking {
    formField: AbstractControl | null;
    trackFieldName: string;
}

export interface FastLoginField {
    text?: string;
    checked?: boolean;
    value: FastLoginValue;
}

export enum LoginOption {
    ConnectCardOption = 'connectcardoption',
    DanskeSpilOption = 'danskespiloption',
}

/** @stable */
export enum LoginErrorCode {
    DUPLICATE_EMAIL = '604',
    SELF_EXCLUSION = '699',
    SELF_EXCLUSION_COOL_OFF = '1750',
    SELF_EXCLUSION_RG_CLOSED = '101',
    SELF_EXCLUSION_GAMSTOP_RG_CLOSED = '102',
    SELF_EXCLUSION_UNKNOWN_ERROR = '610',
}
