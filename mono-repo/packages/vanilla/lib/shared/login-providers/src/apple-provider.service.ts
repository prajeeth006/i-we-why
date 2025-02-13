import { Injectable } from '@angular/core';

import {
    CookieName,
    CookieService,
    DynamicScriptsService,
    Logger,
    LoginProvider,
    LoginProviderProfile,
    NavigationService,
    TrackingService,
} from '@frontend/vanilla/core';
import { CryptoService } from '@frontend/vanilla/shared/crypto';
import { filter } from 'rxjs/operators';

import { BaseLoginProviderService } from './base-login-provider.service';
import { AuthOptions, AuthResponse } from './login-providers.models';

import SignInResponseI = AppleSignInAPI.SignInResponseI;
import UserI = AppleSignInAPI.UserI;

/**
 * @internal
 */
@Injectable({
    providedIn: 'root',
})
export class AppleProviderService extends BaseLoginProviderService<SignInResponseI> {
    constructor(
        private cookieService: CookieService,
        private cryptoService: CryptoService,
        private navigationService: NavigationService,
        private logger: Logger,
        dynamicScriptsService: DynamicScriptsService,
        trackingService: TrackingService,
    ) {
        super(dynamicScriptsService, trackingService);

        this.loginResponse.pipe(filter(Boolean)).subscribe((auth: AuthResponse<SignInResponseI>) => {
            const authorization = auth.response?.authorization;
            const redirectUrl = auth.options.authUrl?.redirectUrl;

            if (authorization && redirectUrl) {
                // Authenticate using SDK login
                redirectUrl.search.append('access_token', authorization.id_token);
                redirectUrl.search.append('code', authorization.code);

                if (auth.response?.user) {
                    const nonce = this.cookieService.get(CookieName.Nonce);

                    this.cryptoService.encrypt(JSON.stringify(auth.response.user), nonce).subscribe({
                        next: (encryptedUserData: string) => this.cookieService.put(CookieName.AppleUser, encryptedUserData),
                        complete: () => {
                            this.trackSuccessLoginWithProvider(LoginProvider.APPLE);
                            this.navigationService.goTo(redirectUrl.absUrl());
                        },
                        error: () => this.navigationService.goTo(redirectUrl.absUrl()),
                    });
                }
            } else {
                this.logger.warn('Filed to login with Apple provider; fallback to login with URI', auth?.response);
                this.navigationService.goTo(auth?.options.authUrl?.url?.absUrl() || '/');
            }
        });
    }

    /** Perform SDK login
     * @param {AuthOptions} options
     * Config: {@link https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix}
     */
    login(options: AuthOptions) {
        if (options.providerParameters?.sdkLogin) {
            this.initSdk(typeof AppleID, options.providerParameters, {
                onloadCallback: () =>
                    AppleID?.auth.init({
                        clientId: options.providerParameters?.clientId,
                        redirectURI: options.providerParameters?.redirectUrl,
                    }),
            }).then(() => {
                if (typeof AppleID !== 'undefined') {
                    AppleID.auth.signIn(options.providerParameters).then(
                        (response: SignInResponseI) => {
                            this.loginResponseSubject.next({ response, options });
                        },
                        (error: any) => this.loginResponseSubject.next({ error, options }),
                    );
                } else {
                    this.loginResponseSubject.next(null);
                }
            });
        } else {
            this.loginResponseSubject.next(null);
        }
    }

    /** Loads Apple profile data from cookies
     * Config: {@link https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix}
     */
    initProfile() {
        const encryptedUserData = this.cookieService.get(CookieName.AppleUser);
        const profile: LoginProviderProfile = {
            provider: LoginProvider.APPLE,
        };

        if (encryptedUserData) {
            const nonce = this.cookieService.get(CookieName.Nonce);

            this.cryptoService.decrypt(encryptedUserData, nonce).subscribe({
                next: (data: string) => {
                    const userData: UserI = JSON.parse(data);
                    profile.name = `${userData.name.firstName} ${userData.name.lastName}`;
                },
                complete: () => this.profileSubject.next(profile),
                error: () => this.profileSubject.next(profile),
            });
        } else {
            this.profileSubject.next(profile);
        }
    }
}
