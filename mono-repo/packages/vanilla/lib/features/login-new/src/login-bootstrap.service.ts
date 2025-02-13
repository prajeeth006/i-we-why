import { Injectable } from '@angular/core';

import {
    LoginDialogService as CoreLoginDialogService,
    MenuAction,
    MenuActionsService,
    NativeAppConfig,
    NativeAppService,
    NativeEventType,
    OnFeatureInit,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { LoginDialogService } from './login-dialog/login-dialog.service';
import { LoginConfig } from './login.client-config';

@Injectable()
export class LoginBootstrapService implements OnFeatureInit {
    private parameters: any;

    constructor(
        private config: LoginConfig,
        // private loginService: LoginNewService,
        private loginDialogService: LoginDialogService,
        private coreLoginDialogService: CoreLoginDialogService,
        private menuActionsService: MenuActionsService,
        private nativeApplication: NativeAppService,
        private nativeAppSettings: NativeAppConfig,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.coreLoginDialogService.set(this.loginDialogService);
        // this.loginService.setLoginComponent('default', LoginNewComponent);

        // this.loginService.setLoginComponent('fast-login', FastLoginComponent);
        // this.loginService.setLoginComponent('links', LoginLinksComponent);
        // this.loginService.setLoginComponent('oauth', LoginOAuthComponent);
        // this.loginService.setLoginComponent('welcome-dialog', LoginWelcomeDialogComponent);
        // this.loginService.setLoginComponent('betstation-pin-card', BetstationLoginCardPinComponent);
        // this.loginService.setLoginComponent('betstation-login-error', BetstationLoginErrorOverlayComponent);
        // this.loginService.setLoginComponent('betstation-logout-info', BetstationLogoutInfoOverlayComponent);
        // this.loginService.setLoginComponent('danskespil', DanskeSpilLoginOptionComponent);
        // this.loginService.setLoginComponent('danskespil-login-success', DanskeSpilLoginSuccessComponent);
        // this.loginService.setLoginComponent('connect-card', ConnectCardLoginOptionComponent);
        // this.loginService.setLoginComponent('tabs', LoginOptionTabsComponent);

        this.registerMenuActions();
    }

    private registerMenuActions() {
        this.menuActionsService.register(MenuAction.GOTO_LOGIN, (_origin, _url, _target, parameters) => {
            this.parameters = parameters || {};

            this.openLoginDialog(this.parameters);
        });
    }

    private openLoginDialog(parameters: { [key: string]: string }) {
        if (this.nativeAppSettings.sendOpenLoginDialogEvent) {
            this.nativeApplication.sendToNative({ eventName: NativeEventType.OPENLOGINDIALOG });
        } else {
            this.loginDialogService.open({
                returnUrl: parameters.returnUrl || null,
            });
        }
    }
}
