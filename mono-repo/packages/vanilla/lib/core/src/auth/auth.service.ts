import { Injectable, Type } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { ClientConfigService } from '../client-config/client-config.service';
import { SharedFeaturesApiService } from '../http/shared-features-api.service';
import { NativeEventType } from '../native-app/native-app.models';
import { NativeAppService } from '../native-app/native-app.service';
import { NavigationService } from '../navigation/navigation.service';
import { TrackingService } from '../tracking/tracking-core.service';
import { ClaimsConfig } from '../user/claims.client-config';
import { UserLoggingOutEvent, UserLogoutEvent } from '../user/user-events';
import { UserConfig } from '../user/user.client-config';
import { UserService } from '../user/user.service';
import { LogoutProvidersService, LogoutStage } from './logout-providers.service';

/**
 * Additional options for {@link AuthService}
 *
 * @stable
 */
export interface LogoutOptions {
    /**
     * Whether to redirect to `/` after user is logged out (default). If false, stay on the same url after logout is completed.
     */
    redirectAfterLogout: boolean;
    /**
     * Indicates if user ma logout happened.
     */
    isManualLogout?: boolean;
    /**
     * Indicates if auto logout happened.
     */
    isAutoLogout?: boolean;
}

const defaultLogoutOptions: LogoutOptions = {
    redirectAfterLogout: true, // TODO: Consider using NavigationService.routeData options to decide if redirection is needed.
    isAutoLogout: false,
};

/**
 * @whatItDoes Provides auth functions (logout).
 *
 * @howToUse
 *
 * ```
 * function doLogout(){
 *     AuthService.logout()
 *         .then(function(){
 *             // do stuff after user was logged out
 *         });
 * }
 * ```
 *
 * @description
 *
 * Only logout function is available from vanilla framework. Login is handled in portal.
 * Sent {@link NativeEventType.LOGOUT} with `systemLogout: false`
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private logoutInProgress: boolean = false;
    private redirectUrlAfterLogout: string = '/';
    private configsToReloadOnLogin: Set<Type<any>> = new Set([UserConfig, ClaimsConfig]);

    constructor(
        private user: UserService,
        private navigationService: NavigationService,
        private apiService: SharedFeaturesApiService,
        private logoutProvidersService: LogoutProvidersService,
        private nativeApp: NativeAppService,
        private clientConfig: ClientConfigService,
        private cookieService: CookieService,
        private trackingService: TrackingService,
    ) {}

    /**
     * Logs out the user from the application.
     *
     * See {@link LogoutOptions} for additional options.
     */
    async logout(options?: LogoutOptions): Promise<void> {
        if (!this.user.username || this.logoutInProgress) {
            return Promise.resolve();
        }

        this.logoutInProgress = true;
        const opts = Object.assign({}, defaultLogoutOptions, options);

        this.user.triggerEvent(new UserLoggingOutEvent());
        this.cookieService.remove(CookieName.SsoToken);

        await this.logoutProvidersService.invoke(LogoutStage.BEFORE_LOGOUT);
        await firstValueFrom(this.apiService.post('auth/logout'));
        await this.logoutProvidersService.invoke(LogoutStage.AFTER_LOGOUT);

        this.logoutInProgress = false;
        await this.trackingService.triggerEvent('Event.Logout', {
            'component.CategoryEvent': 'logout',
            'component.LabelEvent': 'success',
            'component.ActionEvent': 'attempt',
            'logout.type': options?.isAutoLogout ? 'auto logout' : 'standard logout',
            'component.LocationEvent': this.navigationService.location.path(),
        });
        this.user.triggerEvent(new UserLogoutEvent(opts.isManualLogout));

        this.nativeApp.sendToNative({
            eventName: NativeEventType.LOGOUT,
            parameters: {
                systemLogout: false,
            },
        });

        if (this.cookieService.get(CookieName.RmLp) == '1') {
            opts.redirectAfterLogout = false;
        }

        if (opts.redirectAfterLogout) {
            this.navigationService.goTo(this.redirectUrlAfterLogout, { forceReload: true });
        } else {
            await this.reloadClientConfigs();
        }
    }

    /**
     * Checks if the users is authenticated by making an API call to the server.
     */
    async isAuthenticated(): Promise<boolean> {
        const result = await firstValueFrom(this.apiService.get('auth/check'));
        return result.isAuthenticated;
    }

    /**
     * Returns login duration in `hh:mm:ss` format. Fails for unauthenticated user.
     */
    async duration(): Promise<string> {
        const result = await firstValueFrom(this.apiService.get('auth/duration'));
        return result.duration;
    }

    /**
     * Returns login start time. Fails for unauthenticated user.
     */
    async loginStartTime(): Promise<string> {
        const result = await firstValueFrom(this.apiService.get('auth/loginstarttime'));
        return result.startTime;
    }

    /* Specifies url where user will be redirected after logout. */
    changeRedirectUrlAfterLogout(url: string) {
        this.redirectUrlAfterLogout = url;
    }

    /**
     * If called in the second half of the auth session expiration, it will prolong the session..
     */
    async ping() {
        await firstValueFrom(this.apiService.get('ping', null, { prefix: '' }));
    }

    async sessionTimeLeft(): Promise<number> {
        const result = await firstValueFrom(this.apiService.get('auth/sessiontimeleft'));
        return result.timeLeftInMiliseconds;
    }

    private reloadClientConfigs() {
        return this.clientConfig.reload(Array.from(this.configsToReloadOnLogin));
    }
}
