import { Injectable } from '@angular/core';

import { Page } from '../client-config/page.client-config';
import { HomeService } from '../home/home.service';
import { GoToOptions } from '../navigation/navigation.models';
import { NavigationService } from '../navigation/navigation.service';
import { UrlService } from '../navigation/url.service';
import { ProductHomepagesConfig } from '../products/product-homepages.client-config';
import { LoginStoreService } from './login-store.service';
import { LoginRedirectInfo } from './login.models';
import { LoginGoToOptions, LoginService2 } from './login.service';

/**
 * @whatItDoes Provides login navigation methods.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoginNavigationService {
    private redirectAfterSessionTimeout: boolean = true;

    get isRedirectAfterSessionTimeoutEnabled() {
        return this.redirectAfterSessionTimeout;
    }

    constructor(
        private navigation: NavigationService,
        private loginService: LoginService2,
        private homeService: HomeService,
        private page: Page,
        private urlService: UrlService,
        private productHomepages: ProductHomepagesConfig,
        private loginStore: LoginStoreService,
    ) {}

    /** sets return URL in the login store */
    storeReturnUrl() {
        const url = this.navigation.location.absUrl();

        if (url.indexOf('/login') === -1 && !this.loginStore.ReturnUrlFromLogin) {
            this.loginStore.ReturnUrlFromLogin = url;
        }
    }

    /** gets return url from rurl|ReturnUrl query parameter, if set  */
    storeReturnUrlFromQuerystring() {
        // use either "rurl" or "ReturnUrl" (in case of Vanilla based unauth'd redirection)
        const rurlKeys = ['rurl', 'ReturnUrl'];

        const rurl = rurlKeys
            .map((key) => {
                const encoded = this.navigation.location.search.get(key);
                if (!encoded) return null;

                /** When returnUrl contains query parameter with encoded url, don't decode returnUrl one more time, because that will also decode encoded url in query parameter.
                 This can mess up query parameters of encoded url if they exist. */
                return this.queryParamContainsUrl(encoded) ? encoded : decodeURIComponent(encoded);
            })
            .find((v) => v != null);

        if (rurl && rurl.match(/(javascript|src|onerror|<|>)/g)) {
            return;
        }

        if (rurl && !this.urlService.parse(rurl).isSameTopDomain) {
            //Avoid redirects to external pages from login. INC646340
            return;
        }

        if (rurl) {
            this.loginStore.ReturnUrlFromLogin = rurl;
        }
    }

    // check if query paramters contains url
    private queryParamContainsUrl(url: string) {
        const queryParameters = this.urlService.parse(url).search;
        return queryParameters.keys().some((key) => {
            const value = queryParameters.get(key);
            if (value) {
                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
            }
            return false;
        });
    }

    /** Navigates to registration page. */
    goToRegistration(options?: GoToOptions, registrationUrl?: string) {
        this.navigation.goTo(registrationUrl ?? this.productHomepages.portal + '/mobileportal/register', options);
    }

    /** Navigates to login page. Calls goToNativeApp for native app */
    async goToLogin(options: LoginGoToOptions = {}): Promise<void> {
        await this.loginService.goTo(options);
    }

    /** Navigates to home page. Calls goToNativeApp for native app. For wrapper app navigates to app's product homepage */
    goToHome() {
        this.homeService.goTo();
    }

    /** Navigates to the return url stored in {@link LoginStoreService#ReturnUrlFromLogin-anchor LoginStoreService.ReturnUrlFromLogin} or falls back to '/' */
    goToStoredReturnUrl() {
        const redirectInfo = this.getStoredLoginRedirect();

        if (redirectInfo) {
            this.navigation.goTo(redirectInfo.url!, redirectInfo.options);
            return;
        }
    }

    /** Gets the return url stored in {@link LoginStoreService#ReturnUrlFromLogin-anchor LoginStoreService.ReturnUrlFromLogin} */
    getStoredLoginRedirect(clearStoredRedirect: boolean = true): LoginRedirectInfo {
        // get return url from session store
        const returnUrl = this.loginStore.ReturnUrlFromLogin;

        if (clearStoredRedirect) {
            // clear sessionStorage
            this.loginStore.ReturnUrlFromLogin = null;
        }

        if (!returnUrl || returnUrl === '/') {
            const homeUrl = this.homeService.getUrl();
            return { url: homeUrl, isCompleted: true, goTo: () => this.navigation.goTo(homeUrl) };
        }
        return this.getUrlWithCurrentLang(returnUrl)!;
    }

    /** Navigates to given url with switching to the current language  */
    goToWithCurrentLang(urlString: string) {
        const redirectInfo = this.getUrlWithCurrentLang(urlString);
        if (redirectInfo) {
            this.navigation.goTo(redirectInfo.url!, redirectInfo.options);
        }
    }

    /** Gets given url with switching to the current language  */
    getUrlWithCurrentLang(urlString: string | undefined): LoginRedirectInfo | null {
        if (!urlString) {
            return null;
        }

        //returnUrl or ReturnUrlFromLogin can be encoded more one time in rare cases
        urlString = this.fullyDecodeURI(urlString);

        const url = this.urlService.parse(urlString);

        // adapt return url to page/session language
        const options = { replace: true, culture: this.page.lang };
        return { url: url, options: options, isCompleted: true, goTo: () => this.navigation.goTo(url, options) };
    }

    disableRedirectAfterSessionTimeout() {
        this.redirectAfterSessionTimeout = false;
    }

    private isUriEncoded(uri: string): boolean {
        uri = uri || '';
        return uri !== decodeURIComponent(uri);
    }

    private fullyDecodeURI(uri: string): string {
        /** When returnUrl contains query parameter with encoded url, don't decode returnUrl one more time, because that will also decode encoded url in query parameter.
            This can mess up query parameters of encoded url if they exist. */
        if (this.queryParamContainsUrl(uri)) return uri;
        while (this.isUriEncoded(uri)) {
            uri = decodeURIComponent(uri);
        }
        return uri;
    }
}
