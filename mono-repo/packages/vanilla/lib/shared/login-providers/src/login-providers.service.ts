import { Injectable } from '@angular/core';

import {
    CommonMessages,
    CookieName,
    CookieService,
    LoginProvider,
    LoginProviderProfile,
    MessageLifetime,
    MessageQueueService,
    MessageScope,
    MessageType,
    NavigationService,
    ParsedUrl,
    UrlService,
    UtilsService,
} from '@frontend/vanilla/core';
import { LoginConfig, ProviderParameters } from '@frontend/vanilla/shared/login';
import { BehaviorSubject, combineLatest } from 'rxjs';

import { AppleProviderService } from './apple-provider.service';
import { FacebookProviderService } from './facebook-provider.service';
import { GoogleProviderService } from './google-provider.service';
import { AuthUrl, ProviderLoginOptions } from './login-providers.models';

import SigninOptions = AppleSignInAPI.ClientConfigI;

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoginProvidersService {
    readonly providersProfile = new BehaviorSubject<LoginProviderProfile[] | null>(null);

    constructor(
        private loginConfig: LoginConfig,
        private commonMessages: CommonMessages,
        private urlService: UrlService,
        private cookieService: CookieService,
        private utilsService: UtilsService,
        private navigationService: NavigationService,
        private messageQueueService: MessageQueueService,
        private appleProviderService: AppleProviderService,
        private googleProviderService: GoogleProviderService,
        private facebookProviderService: FacebookProviderService,
    ) {}

    /**
     * Initialize user profiles when available and `sdkLogin` config is enabled.
     **/
    initProvidersProfile() {
        combineLatest([this.appleProviderService.profile, this.googleProviderService.profile, this.facebookProviderService.profile]).subscribe(
            ([appleProfile, googleProfile, facebookProfile]) => {
                if (googleProfile && facebookProfile && appleProfile) {
                    this.providersProfile.next([appleProfile, googleProfile, facebookProfile]);
                }
            },
        );

        this.appleProviderService.initProfile();
        this.googleProviderService.initProfile(this.loginConfig.providers[LoginProvider.GOOGLE]);
        this.facebookProviderService.initProfile(this.loginConfig.providers[LoginProvider.FACEBOOK]);
    }

    /**
     * Invokes login with via URL for a given provider.
     * Appends passed queryParams parameter values to the URL provided via {@link ProviderLoginOptions}.
     **/
    urlAuth(options: ProviderLoginOptions) {
        const providerConfig = this.loginConfig.providers[options.provider];

        if (providerConfig?.appendNonce) {
            this.updateNonce();
        }

        const authUrl = this.getAuthUrl(options, providerConfig);

        if (authUrl?.url?.absUrl()) {
            if (options.provider === LoginProvider.YAHOO) {
                this.appendToUri(authUrl.url, [CookieName.Nonce, CookieName.LoginHint, CookieName.IdTokenHint]);
            }

            this.navigationService.goTo(authUrl.url.absUrl());
        } else {
            this.showLoginError();
        }
    }

    /** Invokes login with via SDK for a given provider. */
    sdkAuth(options: ProviderLoginOptions) {
        const providerParameters = this.loginConfig.providers[options.provider];

        if (providerParameters?.appendNonce) {
            this.updateNonce();
        }

        const authUrl = this.getAuthUrl(options, providerParameters);

        if (!authUrl?.url && !authUrl?.redirectUrl) {
            this.showLoginError();
        } else if (options.provider === LoginProvider.APPLE) {
            const signInOptions: SigninOptions = {
                ...options.loginOptions,
                clientId: providerParameters?.clientId,
                nonce: authUrl?.url?.search.get(CookieName.Nonce) || undefined,
            };
            this.appleProviderService.login({
                signInOptions,
                providerParameters,
                authUrl,
            });
        } else if (options.provider === LoginProvider.GOOGLE) {
            this.googleProviderService.login({
                signInOptions: options.loginOptions,
                providerParameters,
                authUrl,
            });
        } else if (options.provider === LoginProvider.FACEBOOK) {
            this.facebookProviderService.login({
                signInOptions: options.loginOptions,
                providerParameters,
                authUrl,
            });
        }
    }

    private getAuthUrl(options: ProviderLoginOptions, providerConfig?: ProviderParameters): AuthUrl | null {
        if (!providerConfig) {
            return null;
        }

        const redirectUrl = this.urlService.parse(providerConfig.redirectUrl);

        for (const key in options.redirectQueryParams) {
            const redirectQuery = options.redirectQueryParams[key];

            if (redirectQuery) {
                redirectUrl.search.append(key, redirectQuery);
            }
        }

        const url = this.urlService.parse(providerConfig.loginUrl);
        url.search.append('client_id', providerConfig.clientId);
        url.search.append('redirect_uri', redirectUrl.absUrl());

        for (const key in options.queryParams) {
            const query = options.queryParams[key];

            if (query) {
                url.search.append(key, query);
            }
        }

        if (providerConfig.appendNonce) {
            url.search.append(CookieName.Nonce, this.cookieService.get(CookieName.Nonce));
        }

        return { url, redirectUrl };
    }

    /** Appends values of cookies with the listed keys and deletes those cookies. */
    private appendToUri(url: ParsedUrl, cookieKeys: string[] = []) {
        cookieKeys.forEach((cookieName: string) => {
            const value = this.cookieService.get(cookieName);

            if (value) {
                url.search.append(cookieName, value);
                this.cookieService.remove(cookieName);
            }
        });
    }

    /**
     * Updates the 'nonce' cookie.
     *
     * A unique, single-use string to associate a client session with the user's identity token.
     * This value is also used to prevent replay attacks and allows you to correlate the initial authentication request
     * with the identity token provided in the authorization response.
     **/
    private updateNonce() {
        this.cookieService.remove(CookieName.Nonce);

        const guid = this.utilsService.generateGuid();
        this.cookieService.put(CookieName.Nonce, guid);
    }

    private showLoginError() {
        this.messageQueueService.clear();
        this.messageQueueService.add({
            scope: MessageScope.Login,
            html: this.commonMessages.LoginError || '',
            type: MessageType.Error,
            lifetime: MessageLifetime.Single,
        });
    }
}
