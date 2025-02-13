import { Injectable, Type } from '@angular/core';

import {
    AutoLoginParameters,
    DeviceFingerprintService,
    DynamicComponentsRegistry,
    LoginDialogService,
    LoginFailedOptions,
    LoginMessageKey,
    LoginResponseHandlerService,
    LoginService2,
    LoginStoreService,
    LoginType,
    Message,
    MessageQueueService,
    NativeAppService,
    NativeEventType,
    ProductNavigationService,
    UserLoggingInEvent,
    UserLoginFailedEvent,
    UserService,
    VanillaDynamicComponentsCategory,
} from '@frontend/vanilla/core';
import { WrapperSettingsService } from '@frontend/vanilla/shared/native-app';
import { Observable, Subject } from 'rxjs';

import { BetstationLoginErrorOverlayService } from './betstation/betstation-login-error-overlay.service';
import { LoginMessagesService } from './login-messages.service';
import { LoginResourceService } from './login-resource.service';
import { LoginTrackingService } from './login-tracking.service';
import { LoginFailedEvent } from './login.models';

/**
 * @whatItDoes Provides functionality to manipulate login
 *
 * @description
 *
 * # Overview
 *
 * This service provides functionality for manipulating login:
 *  - Set/Get login component.
 *
 * @stable
 */
@Injectable()
export class LoginService {
    private loginFailedSubject: Subject<LoginFailedEvent> = new Subject();
    private incorrectPinSubject: Subject<string> = new Subject();

    constructor(
        private dynamicComponentsRegistry: DynamicComponentsRegistry,
        private betstationLoginErrorOverlayService: BetstationLoginErrorOverlayService,
        private loginResource: LoginResourceService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        private loginStore: LoginStoreService,
        private nativeApplication: NativeAppService,
        private user: UserService,
        private loginTrackingService: LoginTrackingService,
        private productNavigationService: ProductNavigationService,
        private messageQueueService: MessageQueueService,
        private wrapperSettingsService: WrapperSettingsService,
        private loginService2: LoginService2,
        private loginMessagesService: LoginMessagesService,
        private deviceFingerprintService: DeviceFingerprintService,
        private loginDialog: LoginDialogService,
    ) {}

    get loginFailed(): Observable<LoginFailedEvent> {
        return this.loginFailedSubject.asObservable();
    }

    get incorrectPin(): Observable<string> {
        return this.incorrectPinSubject.asObservable();
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

    get touchIdToggleVisible(): boolean {
        //wrapper sends isTouchIDLoginEnabled = false if it is enabled on DynaCon and not selected (so we should show it if it's false :( ) and (undefined or null) if disabled in DynaCon
        return (
            this.wrapperSettingsService.current &&
            this.wrapperSettingsService.current.deviceTouchSupported &&
            this.wrapperSettingsService.current.isTouchIDLoginEnabled !== undefined &&
            this.wrapperSettingsService.current.isTouchIDLoginEnabled !== null
        );
    }

    /** Set a component type for menu item type. */
    setLoginComponent(itemType: string, component: Type<any>) {
        this.dynamicComponentsRegistry.registerComponent(VanillaDynamicComponentsCategory.Login, itemType, component);
    }

    /** Gets a component type for menu item type. */
    getLoginComponent(itemType?: string) {
        return this.dynamicComponentsRegistry.get(VanillaDynamicComponentsCategory.Login, itemType || 'default');
    }

    getNewVisitorComponent(itemType?: string) {
        return this.dynamicComponentsRegistry.get(VanillaDynamicComponentsCategory.NewVisitorPage, itemType || 'default');
    }

    gridConnectLogin(model: any, onComplete: () => void) {
        this.user.triggerEvent(new UserLoggingInEvent());

        this.loginStore.LastVisitor = model.connectCardNumber;

        this.loginResource
            .login(model, { showSpinner: false })
            .subscribe({
                next: (data) => {
                    this.nativeApplication.sendToNative({
                        eventName: NativeEventType.PRELOGIN,
                        parameters: {
                            userName: model.username || model.connectCardNumber,
                            password: model.password || model.pin,
                        },
                    });

                    this.loginResponseHandlerService.handle(data).then((redirectInfo) => {
                        redirectInfo.goTo();
                    });
                },
                error: async (error) => {
                    await this.handleLoginFailed({ reason: error, type: LoginType.ConnectCard });

                    if (error.vnMessages?.length > 0) {
                        const message: Message = error.vnMessages[0];

                        // Do not close or show default error dialog when error is invalid attempts to block.
                        if (error.errorValues?.some((x: any) => x.key === 'REM_INVALID_PSWD_LOGIN_ATTEMPTS_TO_PSWD_BLOCK')) {
                            this.incorrectPinSubject.next(message.html);
                        } else {
                            this.betstationLoginErrorOverlayService.showError(message.html);
                        }
                    }
                },
            })
            .add(() => {
                onComplete();
            });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autoLogin(loginParameters: AutoLoginParameters, _: boolean = true) {
        loginParameters = Object.assign({}, loginParameters, {
            fingerprint: this.deviceFingerprintService.get(),
        });
        // Implement
    }

    async handleLoginFailed(options: LoginFailedOptions) {
        this.loginFailedSubject.next(new LoginFailedEvent(options));
        this.user.triggerEvent(new UserLoginFailedEvent());

        this.loginTrackingService.trackErrorCode(options.reason);
        this.loginTrackingService.reportLoginError(options.reason);

        const errorCode = options.reason?.errorCode || '';

        this.nativeApplication.sendToNative({
            eventName: NativeEventType.LOGINFAILED,
            parameters: {
                type: options.type,
                errorCode,
            },
        });

        if (options.reason?.redirectUrl) {
            this.productNavigationService.goTo(options.reason.redirectUrl);
        } else if (options.type === LoginType.Autologin) {
            // If there is error code show message from server.
            if (errorCode) {
                // Scope is set to autologin to prevent showing server error on login before handleLoginFailed is called.
                // If there is error code change scope to login to show the server error on login.
                this.messageQueueService.changeScope('autologin', 'login');
            }

            const loginMessageKey =
                this.touchIdOrFaceIdEnabled || options.touchIdOrFaceIdEnabled ? LoginMessageKey.AutoLoginErrorTouch : LoginMessageKey.AutoLoginError;

            if (this.loginDialog.opened) {
                this.loginMessagesService.setLoginMessage(loginMessageKey);
            } else {
                await this.loginService2.goTo({
                    appendReferrer: true,
                    storeMessageQueue: true,
                    loginMessageKey,
                });
            }
        }
    }
}
