import { LoginFailedOptions, LoginType, GoToOptions as VanillaGoToOptions } from '@frontend/vanilla/core';

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

/** @stable */
export interface GoToOptions extends VanillaGoToOptions {
    ignoreSpecialNativeHandling?: boolean;
    referrerNeedsLoggedInUser?: boolean;
    origin?: string;
    loginMessageKey?: string;
}
