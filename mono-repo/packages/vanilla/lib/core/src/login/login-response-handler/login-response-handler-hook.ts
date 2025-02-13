import { InjectionToken } from '@angular/core';

import { LoginResponse } from '../login.models';
import { LoginResponseOptions } from './login-response-handler.models';

/**
 * @stable
 */
export class LoginResponseHandlerContext {
    get willRedirectAfterLogin(): boolean {
        return !this.usesDefaultPostLoginAction || this.willPossiblyRedirect;
    }
    get usesDefaultPostLoginAction(): boolean {
        return !(this.response.action || this.response.redirectUrl);
    }

    constructor(
        public readonly response: LoginResponse,
        public options: LoginResponseOptions,
        private willPossiblyRedirect: boolean,
        public isLastIteration: boolean,
    ) {}
}

/**
 * @stable
 */
export interface LoginResponseHandlerHook {
    onPostLogin?(context: LoginResponseHandlerContext): void | Promise<void>;
}

export const LOGIN_RESPONSE_HANDLER_HOOK = new InjectionToken<LoginResponseHandlerHook>('vn-login-response-handler-hook');
