import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { CookieName } from '../../browser/cookie/cookie.models';
import { CookieService } from '../../browser/cookie/cookie.service';
import { ClientConfigService } from '../../client-config/client-config.service';
import { Page } from '../../client-config/page.client-config';
import { Logger } from '../../logging/logger';
import { NativeEventType } from '../../native-app/native-app.models';
import { NativeAppService } from '../../native-app/native-app.service';
import { GoToOptions } from '../../navigation/navigation.models';
import { NavigationService } from '../../navigation/navigation.service';
import { ParsedUrl } from '../../navigation/parsed-url';
import { UrlService } from '../../navigation/url.service';
import { TrackingService } from '../../tracking/tracking-core.service';
import { ClaimsConfig } from '../../user/claims.client-config';
import { ClaimTypeFullName } from '../../user/claims.models';
import { UserLoginEvent, UserPreHooksLoginEvent } from '../../user/user-events';
import { UserConfig } from '../../user/user.client-config';
import { UserService } from '../../user/user.service';
import { UtilsService } from '../../utils/utils.service';
import { LoginNavigationService } from '../login-navigation.service';
import { LoginStoreService } from '../login-store.service';
import { LoginRedirectInfo, LoginResponse } from '../login.models';
import { PostLoginActionsService } from '../post-login-actions.service';
import { RememberMeService } from '../remember-me.service';
import { LoginResponseHandlerContext, LoginResponseHandlerHook } from './login-response-handler-hook';
import { LoginResponseOptions } from './login-response-handler.models';

/**
 * @whatItDoes Provides handling of login response
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoginResponseHandlerService {
    private hooks: LoginResponseHandlerHook[] = [];

    constructor(
        private user: UserService,
        private loginStore: LoginStoreService,
        private nativeApplication: NativeAppService,
        private navigationService: NavigationService,
        private loginNavigation: LoginNavigationService,
        private clientConfig: ClientConfigService,
        private rememberMeService: RememberMeService,
        private logger: Logger,
        private postLoginActions: PostLoginActionsService,
        private urlService: UrlService,
        private page: Page,
        private router: Router,
        private cookieService: CookieService,
        private trackingService: TrackingService,
        private utils: UtilsService,
    ) {}

    /** Register login response hooks. */
    registerHooks(hooks: LoginResponseHandlerHook[]) {
        this.hooks = this.hooks.concat(hooks);
    }

    /** Handles login and returns redirect info */
    async handle(response: LoginResponse, options?: LoginResponseOptions): Promise<LoginRedirectInfo> {
        options = options || {};
        this.loginStore.PostLoginValues = response.postLoginValues || null;

        if (this.nativeApplication.isNative && options.additionalPostLoginCcbParameters) {
            this.cookieService.putObject(CookieName.AdditionalPostLoginOptions, options.additionalPostLoginCcbParameters);
        }

        // phase START
        // TODO Remove else statement after SF API rollout. It is needed for backward compatibility when the client side is rolled out but SF is not.
        if (response.claims) {
            this.setupClaimsAndUser(response);
        } else {
            const clientConfigsPromise = this.reloadClientConfigs(); // run in parallel
            await clientConfigsPromise;
            this.logger.infoRemote('LoginResponseHandlerService: remove unused code: this.reloadClientConfigs()');
        }

        if (!response.isCompleted) {
            if (!options.skipInterceptorTracking) {
                this.trackingService.triggerEvent('Event.Tracking', {
                    'component.CategoryEvent': 'login process',
                    'component.LabelEvent': 'authentication',
                    'component.ActionEvent': 'success',
                    'component.PositionEvent': 'not applicable',
                    'component.LocationEvent': 'login flow',
                    'component.EventDetails': 'pre login interceptor',
                    'component.URLClicked': response.redirectUrl,
                });
            }

            // TODO Remove response.claims from if statement after SF API rollout. It is needed for backward compatibility when the client side is rolled out but SF is not.
            if (response.claims) {
                await this.clientConfig.reload([UserConfig]);
            }
            this.applyUserLanguage(options);
            this.sendLoginInterceptorEvent();
            // phase WORKFLOW
            this.logInfo('handle', `Workflow phase`);
            const opts = Object.assign(options || {}, { replace: true });
            const redirectInfo = this.createRedirectInfo(response.redirectUrl, response.action, false, opts);
            return Promise.resolve(redirectInfo);
        }

        await this.setupRememberMeToken(response.rememberMeEnabled, options.skipRememberMeSetup);
        this.user.triggerEvent(new UserPreHooksLoginEvent());

        // phase POST LOGIN
        // TODO Remove if/else statement after SF API rollout. It is needed for backward compatibility when the client side is rolled out but SF is not.
        if (response.claims) {
            const clientConfigsPromise = this.reloadClientConfigs(false); // run in parallel
            const loginTrackingPromise = this.trackLoginSuccess(response);
            await clientConfigsPromise;
            await loginTrackingPromise;
        } else {
            await this.trackLoginSuccess(response);
            this.logger.infoRemote('LoginResponseHandlerService: remove unused code: this.trackLoginSuccess(response)');
        }
        this.applyUserLanguage(options);

        if (this.user.workflowType < 0) {
            this.sendLoginInterceptorEvent(true);
        }
        this.logInfo('handle', `Post login phase`);
        let willPossiblyRedirect = true;

        if (this.router.onSameUrlNavigation === 'ignore') {
            const futureRedirect = this.loginNavigation.getStoredLoginRedirect(false);

            /**
             * Remove query string used to force password reminder prompt
             * See {@link LoginDialogService#open}
             */
            futureRedirect.url?.search.delete('q');

            // will possibly redirect if culture is different or url is different
            willPossiblyRedirect = !!options.culture || futureRedirect.url?.absUrl() !== this.navigationService.location.absUrl();
            this.logInfo('handle', `willPossiblyRedirect: ${willPossiblyRedirect}`);
        }

        /// indicates that there are no more redirects/actions and that current handling is the last handling
        const isLastIteration = response.isCompleted && !response.redirectUrl && !response.action;
        const context = new LoginResponseHandlerContext(response, options ?? {}, willPossiblyRedirect, isLastIteration);

        await this.runHooks(context, 'onPostLogin');

        this.logInfo('handle', `Finished post login hooks`);

        if (isLastIteration) {
            this.loginStore.disablePostLoginCcbDelay();
        }

        this.user.triggerEvent(new UserLoginEvent());

        return this.createRedirectInfo(response.redirectUrl, response.action || 'goToRedirectUrl', true, options || {});
    }

    /** Handles login and redirects */
    async handleResponse(response: LoginResponse, options?: LoginResponseOptions) {
        const redirectInfo = await this.handle(response, options);
        redirectInfo.goTo();
    }

    /** Handles update of client configs */
    reloadClientConfigs(reloadClaimsConfig: boolean = true): Promise<any> {
        const configsToReload = reloadClaimsConfig ? [ClaimsConfig] : [];
        return this.clientConfig.reloadOnLogin(configsToReload);
    }

    /** runHooks. */
    runHooks(context: LoginResponseHandlerContext, phase: keyof LoginResponseHandlerHook): Promise<any> {
        return Promise.all(
            this.hooks.filter((hook: LoginResponseHandlerHook) => hook[phase]).map((hook: LoginResponseHandlerHook) => hook[phase]!(context)),
        );
    }

    private createRedirectInfo(
        url: string | ParsedUrl | undefined,
        action: string | undefined,
        isCompleted: boolean,
        options: GoToOptions,
    ): LoginRedirectInfo {
        let parsedUrl: ParsedUrl | undefined;

        if (url && typeof url === 'string') {
            parsedUrl = this.urlService.parse(url);
        }

        let goTo: () => void;

        if (parsedUrl) {
            this.logInfo(
                'createRedirectInfo',
                `goTo_parsedUrl => (parsedUrl: ${JSON.stringify(parsedUrl.absUrl())}, options: ${JSON.stringify(options)})`,
            );
            goTo = () => {
                if (parsedUrl) {
                    this.navigationService.goTo(parsedUrl, options);
                }
            };
        } else if (this.nativeApplication.isNativeApp && isCompleted) {
            this.logInfo('createRedirectInfo', `goTo_goToNativeApp => (options: ${JSON.stringify(options)})`);
            goTo = () => this.navigationService.goToNativeApp(options);
        } else {
            const args = [options];
            this.logInfo('createRedirectInfo', `goTo_postLoginActions => (action: ${action}, args: ${JSON.stringify(args)})`);
            goTo = () => this.postLoginActions.invoke(action, args);
        }

        return { url: parsedUrl, options, isCompleted, goTo };
    }

    private async setupRememberMeToken(rememberMeEnabled?: boolean, skipSetRemembermeSetup?: boolean) {
        if (rememberMeEnabled !== false && !skipSetRemembermeSetup) {
            try {
                await firstValueFrom(this.rememberMeService.setupTokenAfterLogin());
            } catch (error) {
                this.logger.errorRemote('Failed to setup remember-me token. User gets only regular auth session.', error);
            }
        }
    }

    private logInfo(method: string, message: string) {
        const infoMessage: string = `Class: LoginResponseHandlerService. Method: ${method}. Message: ${message}.`;
        this.logger.infoRemote(infoMessage);
    }

    private async trackLoginSuccess(response: LoginResponse) {
        const userName: string = this.loginStore.LastVisitor || this.user.username || '';
        const loginSubmissionType =
            this.loginStore.SelectedTab === 'connectcardoption'
                ? 'connectcard'
                : this.page.isLoginWithMobileEnabled && userName.match(/([+]\d+)?-(\d+)/)
                  ? 'mobile'
                  : this.utils.isEmail(userName)
                    ? 'email'
                    : 'userID';
        const loginType = this.cookieService.get(CookieName.LoginType);

        await this.trackingService.triggerEvent('Event.Login', {
            'login.type': loginType || `Login_${loginSubmissionType}`,
            'page.loginSubmissionType': loginSubmissionType,
            'page.siteSection': 'Authentication',
            'user.profile.accountID': response.claims?.[ClaimTypeFullName.AccountId],
            'user.profile.bal': response.balance?.accountBalance,
            'user.profile.currency': response.claims?.[ClaimTypeFullName.Currency],
            'user.profile.country': response.claims?.[ClaimTypeFullName.Country],
            'user.profile.loyaltyStatus': response.user?.loyaltyCategory,
            'user.hasPositiveBalance': (response.balance?.accountBalance ?? 0) > 0,
            'user.isAuthenticated': response.user?.isAuthenticated,
            'user.isExisting': !!this.cookieService.get(CookieName.LastVisitor),
        });
    }

    private sendLoginInterceptorEvent(isPostLogin: boolean = false) {
        this.nativeApplication.sendToNative({
            eventName: NativeEventType.LOGIN_INTERCEPTOR,
            parameters: { isPostLogin: isPostLogin, accountId: this.user.accountId },
        });
    }

    private setupClaimsAndUser(response: LoginResponse) {
        let configsToUpdate: { [key: string]: any } = {
            vnClaims: response.claims,
        };
        if (response.balance) {
            configsToUpdate['vnBalanceProperties'] = { balanceProperties: response.balance };
        }
        this.clientConfig.update(configsToUpdate, { keepExistingProperties: false });
        this.clientConfig.update(
            {
                vnUser: {
                    isAuthenticated: response.user?.isAuthenticated ?? false,
                    xsrfToken: response.claims?.[ClaimTypeFullName.SessionToken],
                },
            },
            { keepExistingProperties: true },
        );
    }

    private applyUserLanguage(options: LoginResponseOptions) {
        if (this.cookieService.get(CookieName.SkipUserLanguage) !== '1' && this.user.lang !== this.page.lang) {
            this.logInfo('createRedirectInfo', `Change page language to user language`);
            options.culture = this.user.lang;
        }
    }
}
