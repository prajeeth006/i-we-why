import { Injectable, Type } from '@angular/core';

import {
    AutoLoginParameters,
    CookieName,
    CookieService,
    DeviceFingerprintService,
    DynamicComponentsRegistry,
    LoadingIndicatorHandler,
    LoadingIndicatorService,
    Logger,
    LoginDialogService,
    LoginFailedOptions,
    LoginNavigationService,
    LoginProviderProfile,
    LoginResponseHandlerService,
    LoginService2,
    LoginType,
    MessageQueueService,
    MessageScope,
    NativeAppService,
    NativeEventType,
    ProductNavigationService,
    SsoAutoLoginParameters,
    UserLoggingInEvent,
    UserLoginFailedEvent,
    UserService,
    VanillaDynamicComponentsCategory,
} from '@frontend/vanilla/core';
import { ReCaptchaConfig, RecaptchaAction, RecaptchaEnterpriseService } from '@frontend/vanilla/features/recaptcha';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { LoginProvidersService } from '@frontend/vanilla/shared/login-providers';
import { WrapperSettingsService } from '@frontend/vanilla/shared/native-app';
import { Observable, Subject, first, firstValueFrom } from 'rxjs';

import { LoginMessagesService } from './login-messages.service';
import { LoginResourceService } from './login-resource.service';
import { LoginTrackingService } from './login-tracking.service';
import { LoginFailedEvent } from './login.models';

/** @stable */
@Injectable({ providedIn: 'root' })
export class LoginService {
    private onLoginFailedSubject: Subject<LoginFailedEvent> = new Subject();
    private loadingIndicator?: LoadingIndicatorHandler;

    constructor(
        private cookieService: CookieService,
        private deviceFingerprintService: DeviceFingerprintService,
        private dynamicComponentsRegistry: DynamicComponentsRegistry,
        private loadingIndicatorService: LoadingIndicatorService,
        private loginConfig: LoginConfig,
        private loginDialogService: LoginDialogService,
        private loginMessagesService: LoginMessagesService,
        private loginNavigationService: LoginNavigationService,
        private loginProvidersService: LoginProvidersService,
        private loginResourceService: LoginResourceService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        private loginService: LoginService2,
        private loginTrackingService: LoginTrackingService,
        private messageQueueService: MessageQueueService,
        private nativeAppService: NativeAppService,
        private productNavigationService: ProductNavigationService,
        private userService: UserService,
        private wrapperSettingsService: WrapperSettingsService,
        private logger: Logger,
        private recaptchaConfig: ReCaptchaConfig,
        private recaptchaEnterpriseService: RecaptchaEnterpriseService,
    ) {}

    get onLoginFailed(): Observable<LoginFailedEvent> {
        return this.onLoginFailedSubject.asObservable();
    }

    get dialogOpened(): boolean {
        return this.loginDialogService.opened;
    }

    get touchIdToggleVisible(): boolean {
        //wrapper sends isTouchIDLoginEnabled = false if it is enabled on DynaCon and not selected (so we should show it if it's false :( ) and (undefined or null) if disabled in DynaCon
        return (
            this.wrapperSettingsService.current &&
            this.wrapperSettingsService.current.deviceTouchSupported &&
            this.wrapperSettingsService.current.isTouchIDLoginEnabled !== undefined &&
            this.wrapperSettingsService.current.isTouchIDLoginEnabled !== null
        );
    }

    get keepMeSignedInToggleVisible(): boolean {
        //wrapper sends keepMeSignedInEnabled = false if it is enabled on DynaCon and not selected by user (so we should show it if it's false :( ) and (undefined or null) if disabled in DynaCon
        return (
            this.wrapperSettingsService.current &&
            this.wrapperSettingsService.current.keepMeSignedInEnabled !== undefined &&
            this.wrapperSettingsService.current.keepMeSignedInEnabled !== null
        );
    }

    get faceIdToggleVisible(): boolean {
        //wrapper sends isFaceIDLoginEnabled = false if it is enabled on DynaCon and not selected (so we should show it if it's false :( ) and (undefined or null) if disabled in DynaCon
        return (
            this.wrapperSettingsService.current &&
            this.wrapperSettingsService.current.deviceFaceSupported &&
            this.wrapperSettingsService.current.isFaceIDLoginEnabled !== undefined &&
            this.wrapperSettingsService.current.isFaceIDLoginEnabled !== null
        );
    }

    get touchIdOrFaceIdEnabled(): boolean {
        return (
            this.wrapperSettingsService.current &&
            ((this.wrapperSettingsService.current.deviceTouchSupported &&
                this.wrapperSettingsService.current.isTouchIDLoginEnabled !== undefined &&
                this.wrapperSettingsService.current.isTouchIDLoginEnabled) ||
                (this.wrapperSettingsService.current.deviceFaceSupported &&
                    this.wrapperSettingsService.current.isFaceIDLoginEnabled !== undefined &&
                    this.wrapperSettingsService.current.isFaceIDLoginEnabled))
        );
    }

    get fastLoginEnabled(): boolean {
        return (
            this.touchIdOrFaceIdEnabled || (this.wrapperSettingsService.current && this.wrapperSettingsService.current.keepMeSignedInEnabled === true)
        );
    }

    async loginFailed(options: LoginFailedOptions) {
        this.onLoginFailedSubject.next(new LoginFailedEvent(options));
        this.userService.triggerEvent(new UserLoginFailedEvent());

        this.loginTrackingService.trackErrorCode(options.reason);
        this.loginTrackingService.reportLoginError(options.reason);

        this.nativeAppService.sendToNative({
            eventName: NativeEventType.LOGINFAILED,
            parameters: {
                type: options.type,
                errorCode: options.reason?.errorCode || '',
            },
        });

        if (options.reason?.redirectUrl) {
            this.productNavigationService.goTo(options.reason.redirectUrl);
        } else if (options.type === LoginType.Autologin) {
            let loginMessageKey = '';

            // if there is error code show message from server
            if (!options.reason?.errorCode) {
                // if there is no error code show autologin error
                loginMessageKey = this.touchIdOrFaceIdEnabled || options.touchIdOrFaceIdEnabled ? 'autologinerrortouch' : 'autologinerror';
            } else {
                // scope is set to autologin to prevent showing server error on login before loginFailed is called.
                // If there is error code change scope to login to show the server error on login.
                this.messageQueueService.changeScope(MessageScope.AutoLogin, MessageScope.Login);
            }

            if (this.loginDialogService.opened) {
                await this.loginMessagesService.setLoginMessage(loginMessageKey);
            } else {
                await this.loginService.goTo({
                    appendReferrer: true,
                    storeMessageQueue: true,
                    loginMessageKey,
                });
            }
        }
    }

    async goToLogin(parameters?: { [key: string]: string }) {
        if (!this.loginConfig.useProviderProfile || parameters?.welcomeCancel) {
            await this.openLogin(parameters);
        } else {
            this.loginProvidersService.providersProfile.subscribe(async (providersData: LoginProviderProfile[] | null) => {
                if (providersData) {
                    if (this.loginDialogService.opened) {
                        return;
                    }

                    const dialogData = providersData.find(
                        (profile: LoginProviderProfile) =>
                            profile.name && this.cookieService.get(CookieName.LoginType)?.toLowerCase().indexOf(profile.provider.toLowerCase()) > -1,
                    );

                    if (dialogData && this.loginConfig.providers[dialogData.provider]?.welcomeDialog) {
                        this.loginDialogService.openWelcomeDialog(dialogData);
                    } else {
                        await this.openLogin(parameters);
                    }

                    this.loadingIndicator?.done();
                    delete this.loadingIndicator;
                } else if (this.loadingIndicator) {
                    this.loadingIndicator.done();
                    delete this.loadingIndicator;
                } else {
                    this.loadingIndicator = this.loadingIndicatorService.start();
                    this.loginProvidersService.initProvidersProfile();
                }
            });
        }
    }

    async autoLogin(loginParameters: AutoLoginParameters | SsoAutoLoginParameters, redirectAfterLogin: boolean = true) {
        this.logger.infoRemote('LOGIN_INFO Autologin started.');

        await firstValueFrom(this.recaptchaConfig.whenReady);

        if (!this.recaptchaConfig.instrumentationOnPageLoad) {
            this.recaptchaEnterpriseService.initReCaptchaAPI();
        }

        await firstValueFrom(this.recaptchaEnterpriseService.scriptLoaded.pipe(first((ready: boolean) => ready)));
        this.recaptchaEnterpriseService.executeRecaptcha(RecaptchaAction.AutoLogin, this.recaptchaConfig.enterpriseSiteKey);

        loginParameters = Object.assign({}, loginParameters, {
            fingerprint: this.deviceFingerprintService.get(),
            captchaResponse: await firstValueFrom(this.recaptchaEnterpriseService.recaptchaToken),
        });

        const retryNumber = loginParameters.isTouchIDEnabled
            ? this.loginConfig.failedLoginRetryCount.touchId
            : loginParameters.isFaceIDEnabled
              ? this.loginConfig.failedLoginRetryCount.faceId
              : this.loginConfig.failedLoginRetryCount.autoLogin;

        this.userService.triggerEvent(new UserLoggingInEvent());

        try {
            // scope is set to autologin to prevent showing server error on login before loginFailed is called.
            // If there is error code change scope to login to show the server error on login.
            const loginResponse = await firstValueFrom(
                this.loginResourceService.login(loginParameters, {
                    messageQueueScope: MessageScope.AutoLogin,
                    retryCount: retryNumber || 0,
                    showSpinner: !this.loginConfig.showLoginSpinner,
                }),
            );

            if ('username' in loginParameters) {
                this.nativeAppService.sendToNative({
                    eventName: NativeEventType.PRELOGIN,
                    parameters: {
                        userName: loginParameters.username,
                        password: loginParameters.password,
                    },
                });
            }

            if (loginParameters.isTouchIDEnabled || loginParameters.isFaceIDEnabled) {
                this.cookieService.put(CookieName.LoginType, loginParameters.isTouchIDEnabled ? 'Login_TouchID' : 'Login_FaceID');
            }

            const redirectInfo = await this.loginResponseHandlerService.handle(loginResponse);
            this.logger.infoRemote('LOGIN_INFO Autologin HandleResponse successful.');

            if (redirectAfterLogin) {
                redirectInfo.goTo();
            }
        } catch (error: any) {
            this.logger.infoRemote(`LOGIN_INFO Autologin HandleResponse failed. ${error}`);

            this.loginFailed({
                reason: error,
                type: LoginType.Autologin,
                touchIdOrFaceIdEnabled: loginParameters.isTouchIDEnabled || loginParameters.isFaceIDEnabled || false,
            });
        }
    }

    setNewVisitorComponent(itemType: string, component: Type<any>) {
        this.dynamicComponentsRegistry.registerComponent(VanillaDynamicComponentsCategory.NewVisitorPage, itemType, component);
    }

    getNewVisitorComponent(itemType: string | undefined): Type<any> | null {
        return this.dynamicComponentsRegistry.get(VanillaDynamicComponentsCategory.NewVisitorPage, itemType || 'default');
    }

    /** Set a component type for login item type. */
    setLoginComponent(itemType: string, component: Type<any>) {
        this.dynamicComponentsRegistry.registerComponent(VanillaDynamicComponentsCategory.Login, itemType, component);
    }

    /** Gets a component type for login item type. */
    getLoginComponent(itemType: string | undefined): Type<any> | null {
        return this.dynamicComponentsRegistry.get(VanillaDynamicComponentsCategory.Login, itemType || 'default');
    }

    /* @internal */
    logSuperCookie(triggerPoint: string) {
        const superCookie = this.cookieService.get(CookieName.SuperCookie);
        this.logger.infoRemote(`SuperCookie value - ${triggerPoint}: ${superCookie?.replace(/.(?=.{4})/g, '*')}`);
    }

    private async openLogin(parameters?: { [key: string]: string }) {
        if (parameters?.forceRedirect) {
            await this.loginNavigationService.goToLogin();
        } else {
            this.loginDialogService.open(parameters);
        }
    }
}
