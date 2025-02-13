import { Injectable } from '@angular/core';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { Page } from '../client-config/page.client-config';
import { NativeAppConfig } from '../native-app/native-app.client-config';
import { NativeEventType } from '../native-app/native-app.models';
import { NativeAppService } from '../native-app/native-app.service';
import { GoToOptions } from '../navigation/navigation.models';
import { NavigationService } from '../navigation/navigation.service';
import { LoginNavigationProvidersService } from './login-navigation-providers.service';

/** @stable */
export interface LoginGoToOptions extends GoToOptions {
    ignoreSpecialNativeHandling?: boolean;
    referrerNeedsLoggedInUser?: boolean;
    origin?: string;
    loginMessageKey?: string;
    /* Indicates url where user will be redirected, if close button is clicked on login page. */
    cancelUrl?: string;
}

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoginService2 {
    constructor(
        private navigation: NavigationService,
        private page: Page,
        private nativeApp: NativeAppService,
        private loginNavigationProviderService: LoginNavigationProvidersService,
        private cookieService: CookieService,
        private nativeAppSettings: NativeAppConfig,
    ) {}

    /** Navigates to login page. Calls goToNativeApp for native app */
    async goTo(options: LoginGoToOptions = {}): Promise<void> {
        await this.loginNavigationProviderService.invoke();
        await this.goToInternal(options);
    }

    shouldPrefillUsername(value: boolean) {
        if (value === true) {
            const expires = new Date();
            expires.setFullYear(expires.getFullYear() + 10);
            this.cookieService.put(CookieName.PfU, '' + value, { expires });
        } else {
            this.cookieService.remove(CookieName.PfU);
        }
    }

    private async goToInternal(options: LoginGoToOptions = {}) {
        if (this.nativeAppSettings.sendOpenLoginDialogEvent) {
            this.nativeApp.sendToNative({ eventName: NativeEventType.OPENLOGINDIALOG });
        } else if (this.nativeApp.isNativeApp && !options.ignoreSpecialNativeHandling) {
            this.navigation.goToNativeApp({
                storeMessageQueue: true,
                ...options,
            });
        } else {
            let url = this.page.loginUrl;

            if (options.referrerNeedsLoggedInUser) {
                // linking back to referrer (rurl) should be avoided as it will result in endless loop
                // (e.g. automatic forward back to login)
                url += '?rurlauth=1';
            }

            if (options.cancelUrl) {
                // append closeUrl query parameter
                // where to redirect when close button on login page is clicked
                url += `${url.indexOf('?') < 0 ? '?' : '&'}cancelUrl=${encodeURIComponent(options.cancelUrl)}`;
            }

            if (options.loginMessageKey) {
                //Append sitecore loginmessage key to query string to be used as condition to show messages
                url += `${url.indexOf('?') < 0 ? '?' : '&'}msg=${options.loginMessageKey}`;
            }

            await this.navigation.goTo(url, options);
        }
    }
}
