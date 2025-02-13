import { Injectable } from '@angular/core';

import { DynamicScriptsService, Logger, LoginProvider, LoginProviderProfile, NavigationService, TrackingService } from '@frontend/vanilla/core';
import { ProviderParameters } from '@frontend/vanilla/shared/login';
import { filter } from 'rxjs/operators';

import { BaseLoginProviderService } from './base-login-provider.service';
import { AuthOptions } from './login-providers.models';

import AuthResponse = gapi.auth2.AuthResponse;
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

/**
 * @internal
 */
@Injectable({
    providedIn: 'root',
})
export class GoogleProviderService extends BaseLoginProviderService<AuthResponse> {
    constructor(
        private navigationService: NavigationService,
        private logger: Logger,
        dynamicScriptsService: DynamicScriptsService,
        trackingService: TrackingService,
    ) {
        super(dynamicScriptsService, trackingService);

        this.loginResponse.pipe(filter(Boolean)).subscribe((auth) => {
            const redirectUrl = auth.options.authUrl.redirectUrl;

            if (auth.response && redirectUrl) {
                // Authenticate using SDK login

                redirectUrl.search.append('access_token', auth.response.access_token);
                redirectUrl.search.append('code', auth.response.id_token);
                redirectUrl.search.append('expires_in', auth.response.expires_in.toString());
                redirectUrl.search.append('data_access_expiration_time', auth.response.expires_at.toString());

                this.trackSuccessLoginWithProvider(LoginProvider.GOOGLE);
                this.navigationService.goTo(redirectUrl.absUrl());
            } else {
                this.logger.warn('Filed to login with Google provider; fallback to login with URI', auth);
                this.navigationService.goTo(auth.options.authUrl.url?.absUrl() || '/');
            }
        });
    }

    /** Perform SDK login
     * @param {AuthOptions} options
     * Config: {@link https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix}
     */
    login(options: AuthOptions) {
        if (options.providerParameters?.sdkLogin) {
            this.initAuth(options.providerParameters).then(
                (googleAuth: GoogleAuth | null) => {
                    if (googleAuth) {
                        googleAuth.signIn(options.signInOptions).then(
                            (response: GoogleUser) => {
                                this.loginResponseSubject.next({ response: response.getAuthResponse(), options });
                            },
                            (error: any) => this.loginResponseSubject.next({ error, options }),
                        );
                    } else {
                        this.loginResponseSubject.next(null);
                    }
                },
                (error: any) => this.loginResponseSubject.next({ error, options }),
            );
        } else {
            this.loginResponseSubject.next(null);
        }
    }

    /** Loads Google profile data
     * Config: {@link https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix}
     */
    initProfile(config?: ProviderParameters) {
        const profile: LoginProviderProfile = {
            provider: LoginProvider.GOOGLE,
        };

        if (config?.sdkLogin) {
            this.initAuth(config).then(
                (googleAuth: GoogleAuth | null) => {
                    const user = googleAuth?.currentUser.get().getBasicProfile();

                    const googleProfile: LoginProviderProfile = {
                        ...profile,
                        name: user?.getName() || '',
                        pictureUrl: user?.getImageUrl() || '',
                    };
                    this.profileSubject.next(googleProfile);
                },
                () => this.profileSubject.next(profile),
            );
        } else {
            this.profileSubject.next(profile);
        }
    }

    private initAuth(config: ProviderParameters): Promise<GoogleAuth | null> {
        return new Promise((resolve) => {
            if (typeof gapi === 'undefined') {
                this.initSdk(typeof gapi, config).then(
                    () => {
                        if (typeof gapi !== 'undefined') {
                            gapi.load('auth2', () => {
                                resolve(
                                    gapi.auth2.init({
                                        client_id: config.clientId,
                                    }),
                                );
                            });
                        } else {
                            resolve(null);
                        }
                    },
                    () => this.loginResponseSubject.next(null),
                );
            } else {
                resolve(
                    gapi.auth2.init({
                        client_id: config.clientId,
                    }),
                );
            }
        });
    }
}
