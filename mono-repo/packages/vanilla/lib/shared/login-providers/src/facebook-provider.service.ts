import { Injectable } from '@angular/core';

import { DynamicScriptsService, Logger, LoginProvider, LoginProviderProfile, NavigationService, TrackingService } from '@frontend/vanilla/core';
import { ProviderParameters } from '@frontend/vanilla/shared/login';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BaseLoginProviderService } from './base-login-provider.service';
import { AuthOptions, AuthResponse, FacebookProfileData } from './login-providers.models';

import LoginStatus = facebook.LoginStatus;
import StatusResponse = facebook.StatusResponse;

/**
 * @internal
 */
@Injectable({
    providedIn: 'root',
})
export class FacebookProviderService extends BaseLoginProviderService<StatusResponse> {
    get connectionStatus(): Observable<LoginStatus> {
        return this.connectionStatusSubject;
    }

    private connectionStatusSubject = new BehaviorSubject<LoginStatus>('unknown');

    constructor(
        private navigationService: NavigationService,
        private logger: Logger,
        dynamicScriptsService: DynamicScriptsService,
        trackingService: TrackingService,
    ) {
        super(dynamicScriptsService, trackingService);

        this.loginResponse.pipe(filter(Boolean)).subscribe((auth: AuthResponse<StatusResponse>) => {
            const authResponse = auth.response?.authResponse;
            const redirectUrl = auth.options.authUrl?.redirectUrl;

            if (authResponse?.accessToken && redirectUrl) {
                // Authenticate using SDK login
                redirectUrl.search.append('access_token', authResponse.accessToken);
                if (authResponse.signedRequest) {
                    redirectUrl.search.append('code', authResponse.signedRequest);
                }
                redirectUrl.search.append('expires_in', authResponse.expiresIn.toString());

                if (authResponse.data_access_expiration_time) {
                    redirectUrl.search.append('data_access_expiration_time', authResponse.data_access_expiration_time.toString());
                }

                this.trackSuccessLoginWithProvider(LoginProvider.FACEBOOK);
                this.navigationService.goTo(redirectUrl.absUrl());
            } else {
                this.logger.warn('Filed to login with Facebook provider; fallback to login with URI', auth);
                this.navigationService.goTo(auth.options.authUrl.url || '/');
            }
        });
    }

    /** Perform SDK login
     * @param {AuthOptions} options
     * Config: {@link https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix}
     */
    login(options: AuthOptions) {
        const config = options.providerParameters;

        if (config?.sdkLogin) {
            this.initSdk(typeof FB, config, { onloadCallback: () => this.initFacebookAuth(config) }).then(
                () => {
                    if (typeof FB !== 'undefined') {
                        FB.login((response: StatusResponse) => {
                            this.loginResponseSubject.next({ response, options });
                        });
                    } else {
                        this.loginResponseSubject.next(null);
                    }
                },
                (reason: any) => this.loginResponseSubject.next(reason),
            );
        } else {
            this.loginResponseSubject.next(null);
        }
    }

    /** Loads Facebook profile data
     * Config: {@link https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix}
     */
    initProfile(config?: ProviderParameters) {
        const profile: LoginProviderProfile = {
            provider: LoginProvider.FACEBOOK,
        };

        if (config?.sdkLogin) {
            this.initSdk(typeof FB, config, { onloadCallback: () => this.initFacebookAuth(config) }).then(
                () => {
                    if (typeof FB !== 'undefined') {
                        FB.getLoginStatus((response: StatusResponse) => this.connectionStatusSubject.next(response.status));

                        FB.api('/me', { fields: 'name,picture{url}' }, (response: FacebookProfileData) => {
                            profile.name = response?.name;
                            profile.pictureUrl = response?.picture?.data.url;

                            this.profileSubject.next(profile);
                        });
                    } else {
                        this.profileSubject.next(profile);
                    }
                },
                () => this.profileSubject.next(profile),
            );
        } else {
            this.profileSubject.next(profile);
        }
    }

    private initFacebookAuth(config: ProviderParameters) {
        FB?.init({
            appId: config.clientId,
            cookie: !!config.sdkCookie,
            xfbml: true,
            version: config.sdkVersion || 'v10.0',
        });

        FB?.Event.subscribe('auth.login', (response: StatusResponse) => this.connectionStatusSubject.next(response.status));
        FB?.Event.subscribe('auth.statusChange', (response: StatusResponse) => this.connectionStatusSubject.next(response.status));
        FB?.Event.subscribe('auth.authResponseChange', (response: StatusResponse) => this.connectionStatusSubject.next(response.status));
    }
}
