import { Inject, Injectable } from '@angular/core';

import {
    AuthService,
    ClaimsService,
    CookieName,
    CookieService,
    LoginDialogService as CoreLoginDialogService,
    DeviceService,
    DynamicLayoutService,
    EventsService,
    LOGIN_RESPONSE_HANDLER_HOOK,
    Logger,
    LoginNavigationProvidersService,
    LoginNavigationService,
    LoginResponseHandlerHook,
    LoginResponseHandlerService,
    LoginService2,
    LoginStoreService,
    LogoutOptions,
    MenuAction,
    MenuActionsService,
    NativeAppService,
    NativeEvent,
    NativeEventType,
    NavigationService,
    ON_LOGIN_NAVIGATION_PROVIDER,
    OnFeatureInit,
    OnLoginNavigationProvider,
    PostLoginService,
    SimpleEvent,
    SlotName,
    UserEvent,
    UserLogoutEvent,
    UserService,
    toBoolean,
} from '@frontend/vanilla/core';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { first, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { BetstationLoginErrorOverlayService } from './betstation/betstation-login-error-overlay.service';
import { BetstationLoginOverlayService } from './betstation/betstation-login-overlay.service';
import {
    ANONYMOUS_IDENTIFIER,
    GridCardEventName,
    NFCCardType,
    ConnectCardEventName as NfcIdCardEventName,
} from './betstation/betstation-login.models';
import { IconComponent } from './header/sub-components/icon/icon.component';
import { LoginIntegrationService } from './integration/login-integration.service';
import { LoginContent } from './login-content.client-config';
import { LoginContentService } from './login-content.service';
import { LoginDialogService } from './login-dialog.service';
import { LoginMessagesService } from './login-messages.service';
import { LoginSpinnerComponent } from './login-spinner/login-spinner.component';
import { LoginService } from './login.service';
import { NewVisitorLabelSwitcherComponent } from './newvisitor-page/label-switcher/newvisitor-page-labelswitcher.component';
import { NewVisitorPageMenuItemComponent } from './newvisitor-page/menu-item/newvisitor-page-menuitem.component';

@Injectable()
export class LoginBootstrapService implements OnFeatureInit {
    constructor(
        private user: UserService,
        private nativeAppService: NativeAppService,
        private loginService: LoginService,
        private loginDialogService: LoginDialogService,
        private cookieService: CookieService,
        private loginStoreService: LoginStoreService,
        private navigation: NavigationService,
        private loginIntegrationService: LoginIntegrationService,
        private authService: AuthService,
        private menuActionsService: MenuActionsService,
        private loginMessagesService: LoginMessagesService,
        private loginService2: LoginService2,
        private loginConfig: LoginConfig,
        private loginContent: LoginContent,
        private loginNavigation: LoginNavigationService,
        private betstationLoginOverlayService: BetstationLoginOverlayService,
        private errorOverlayService: BetstationLoginErrorOverlayService,
        private eventsService: EventsService,
        private logger: Logger,
        private claimsService: ClaimsService,
        private coreLoginDialogService: CoreLoginDialogService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        private loginProvidedService: LoginNavigationProvidersService,
        private deviceService: DeviceService,
        private loginContentService: LoginContentService,
        private dynamicLayoutService: DynamicLayoutService,
        private postLoginService: PostLoginService,
        @Inject(LOGIN_RESPONSE_HANDLER_HOOK) private loginResponseHooks: LoginResponseHandlerHook[],
        @Inject(ON_LOGIN_NAVIGATION_PROVIDER) private loginNavigationProviders: OnLoginNavigationProvider[],
    ) {}

    async onFeatureInit() {
        this.loginService.setNewVisitorComponent('default', NewVisitorPageMenuItemComponent);
        this.loginService.setNewVisitorComponent('nv-label-switcher', NewVisitorLabelSwitcherComponent);
        this.loginService.setLoginComponent('default', IconComponent);
        this.loginService.setLoginComponent('icon', IconComponent);

        await Promise.all([
            firstValueFrom(this.loginConfig.whenReady),
            firstValueFrom(this.loginContent.whenReady),
            this.loginIntegrationService.init(),
            firstValueFrom(this.loginContentService.initialized),
        ]);

        this.loginService.logSuperCookie('LoginBootstrap');
        if (this.loginConfig.showLoginSpinner) {
            this.dynamicLayoutService.setComponent(SlotName.LoginSpinner, LoginSpinnerComponent);
        }
        this.loginResponseHandlerService.registerHooks(this.loginResponseHooks);
        this.loginProvidedService.registerProviders(this.loginNavigationProviders);
        this.coreLoginDialogService.set(this.loginDialogService);
        this.registerEvents();

        this.menuActionsService.register(MenuAction.GOTO_LOGIN, async (_origin: string, _url, _target, parameters) => {
            if (this.loginIntegrationService.redirectEnabled) {
                this.logMenuAction(MenuAction.GOTO_LOGIN, _origin, _url, _target, parameters);
                await this.loginIntegrationService.redirectToLogin();
            } else {
                await this.loginService.goToLogin(parameters);
            }
        });

        this.menuActionsService.register(MenuAction.GOTO_PRE_LOGIN, (_origin: string, url, _target, parameters) => {
            if (this.user.isAuthenticated || !this.deviceService.isMobilePhone) {
                this.logMenuAction(MenuAction.GOTO_PRE_LOGIN, _origin, url, _target, parameters);
                this.navigation.goTo(url);
            } else {
                const loginUrl = `/labelhost/prelogin?origin=${parameters.origin}&url=${url}`;
                this.logMenuAction(MenuAction.GOTO_PRE_LOGIN, _origin, loginUrl, _target, parameters);
                this.navigation.goTo(loginUrl);
            }
        });

        this.menuActionsService.register(MenuAction.LOGIN_AND_GOTO, (_origin: string, url) => {
            this.logMenuAction(MenuAction.LOGIN_AND_GOTO, _origin, url);

            if (this.user.isAuthenticated) {
                this.navigation.goTo(url);
            } else {
                this.loginDialogService.open({ returnUrl: url, autoFocus: this.loginConfig.autoFocusUsername || false });
            }
        });

        this.menuActionsService.register(MenuAction.LOGOUT, async (_origin: string, _url, _target, parameters) => {
            this.logMenuAction(MenuAction.LOGOUT, _origin, _url, _target, parameters);

            await this.loginIntegrationService.logout();

            const options: LogoutOptions = {
                redirectAfterLogout: parameters && parameters['redirect-after-logout'] ? !!toBoolean(parameters['redirect-after-logout']) : true,
                isManualLogout: parameters ? !!toBoolean(parameters.manualLogout) : false,
            };

            return this.authService.logout(options);
        });
    }

    private setLoginStoreReturnUrl() {
        const rurlKeys = ['rurl', 'ReturnUrl'];
        const rurl = rurlKeys
            .map((key) => {
                const encoded = this.navigation.location.search.get(key);
                return encoded ? decodeURIComponent(encoded) : null;
            })
            .find((v) => v != null);
        if (rurl && rurl.match(/(javascript|src|onerror|<|>)/g)) {
            return;
        }
        if (rurl) {
            this.loginStoreService.ReturnUrlFromLogin = rurl;
        } else {
            const url = this.navigation.location.absUrl();

            if (url.indexOf('/login') === -1 && !this.loginStoreService.ReturnUrlFromLogin) {
                this.loginStoreService.ReturnUrlFromLogin = url;
            }
        }
    }

    private handleEvent(cardNumber: string) {
        if (this.user.isAuthenticated) {
            this.loginNavigation.storeReturnUrl();
            const accBusinessPhase = this.claimsService.get('accbusinessphase');

            if (accBusinessPhase?.toLowerCase() === ANONYMOUS_IDENTIFIER) {
                //Should show pin dialog for anonymous users only
                this.betstationLoginOverlayService.show(cardNumber);
            } else {
                //User authenticated and not anonymous, do nothing is same user already logged in.
                if (this.loginStoreService.LastVisitor?.includes(cardNumber)) {
                    this.logger.info(`Same user is already logged in with card number: ${cardNumber}`);
                } else {
                    // If another player scans the Grid or connect card, logout current user.
                    // Saves card to loginStore in order to show overlay after page reload.
                    this.errorOverlayService.showLogoutInfoMessage();
                }
            }
        }
    }

    private registerEvents() {
        this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLogoutEvent)).subscribe(() => {
            this.cookieService.remove(CookieName.DisplayedInterceptors);
            this.loginStoreService.PostLoginValues = null;
            this.loginStoreService.LoginType = null;
            this.cookieService.remove(CookieName.AdditionalPostLoginOptions);
        });

        this.nativeAppService.eventsFromNative
            .pipe(first((e: NativeEvent) => e.eventName.toUpperCase() === NativeEventType.LOGIN))
            .subscribe(async (e: NativeEvent) => {
                if (!e.parameters) {
                    throw new Error('Parameters are required for login CCB.');
                }

                this.setLoginStoreReturnUrl();
                await this.loginService.autoLogin({
                    username: e.parameters.username,
                    password: e.parameters.password,
                    dateOfBirth: e.parameters.birthDate ? new Date(e.parameters.birthDate) : undefined,
                    isTouchIDEnabled: e.parameters.isTouchIDEnabled,
                    isFaceIDEnabled: e.parameters.isFaceIDEnabled,
                    rememberme: e.parameters.rememberMe,
                });
            });

        this.nativeAppService.eventsFromNative
            .pipe(first((e: NativeEvent) => e.eventName.toUpperCase() === NativeEventType.SSO_LOGIN))
            .subscribe(async (e: NativeEvent) => {
                if (!e.parameters) {
                    throw new Error('Parameters are required for SSO_LOGIN CCB.');
                }

                this.setLoginStoreReturnUrl();
                await this.loginService.autoLogin({
                    ssoToken: e.parameters.ssoToken,
                });
            });

        this.nativeAppService.eventsFromNative
            .pipe(filter((e: NativeEvent) => e.eventName.toUpperCase() === NativeEventType.OPEN_LOGIN_SCREEN))
            .subscribe(async (e: NativeEvent) => {
                const isLoginPageOpened = this.navigation.location.path().indexOf('/login') > -1;

                if (this.loginDialogService.opened || isLoginPageOpened) {
                    await this.loginMessagesService.setLoginMessage(e.parameters?.errorReason);
                } else {
                    await this.loginService2.goTo({
                        appendReferrer: true,
                        storeMessageQueue: true,
                        loginMessageKey: e.parameters?.errorReason,
                    });
                }
            });

        this.nativeAppService.eventsFromNative
            .pipe(filter((e: NativeEvent) => e.eventName.toUpperCase() === NativeEventType.RETRIEVE_POST_LOGIN))
            .subscribe(async () => {
                if (this.user.isAuthenticated) {
                    const postLoginValues = this.loginStoreService.PostLoginValues ?? {};
                    const addionalParameters = this.cookieService.getObject(CookieName.AdditionalPostLoginOptions) ?? {};

                    await this.postLoginService.sendPostLoginEvent(postLoginValues, addionalParameters);
                }
            });

        this.eventsService.events
            .pipe(filter((e: SimpleEvent | null) => e?.eventName.toUpperCase() === GridCardEventName.toUpperCase()))
            .subscribe((event: SimpleEvent | null) => {
                // SamplesGridBarcode: LA7878305175475
                let cardNumber: string = event?.data.barcode;
                cardNumber = cardNumber.replace(/\D+/g, '');
                cardNumber = cardNumber.substring(0, 12);

                this.handleEvent(cardNumber);
            });

        this.eventsService.events
            .pipe(filter((e: SimpleEvent | null) => e?.eventName.toUpperCase() === NfcIdCardEventName.toUpperCase()))
            .subscribe((event: SimpleEvent | null) => {
                // SampleConnectCardNfc: 80000000203540000040352000000080
                let cardNumber: string = event?.data.nfcString.replace(/\D+/g, '');

                if (event?.data.cardType?.toUpperCase() == NFCCardType.GRID) {
                    cardNumber = cardNumber.substring(0, 12);
                } else if (event?.data.cardType?.toUpperCase() == NFCCardType.CONNECT) {
                    cardNumber = cardNumber.substring(0, 16);
                } else {
                    this.logger.error(`Card type (${event?.data.cardType}) not specified as GRID or CONNECT: ${cardNumber}`);
                    return;
                }

                this.handleEvent(cardNumber);
            });
    }

    private logMenuAction(action: string, _origin: string, _url: string, _target?: string, parameters?: any) {
        this.logger.infoRemote(
            `LOGIN_INFO MenuAction ${action} with: origin=${_origin}; url=${_url}; target=${_target}; parameters=${JSON.stringify(parameters)}`,
        );
    }
}
