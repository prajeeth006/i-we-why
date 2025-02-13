import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import {
    EventsService,
    LoginDialogData,
    LoginOAuthDialogData,
    LoginProviderProfile,
    LoginStoreService,
    NativeAppConfig,
    NativeAppService,
    NativeEventType,
    NavigationService,
    ResponsiveLoginDialogOptions,
    SimpleEvent,
    VanillaEventNames,
} from '@frontend/vanilla/core';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { filter, take } from 'rxjs/operators';

import { LoginDialogComponent } from './login-dialog.component';
import { LoginOAuthComponent } from './login-oauth.component';
import { LoginWelcomeDialogComponent } from './login-welcome-dialog.component';

@Injectable()
export class LoginDialogService {
    get opened(): boolean {
        return this.isOpened;
    }

    private isOpened: boolean = false;
    private dialogRef: MatDialogRef<any>;

    constructor(
        private loginConfig: LoginConfig,
        private dialog: MatDialog,
        private navigationService: NavigationService,
        private loginStoreService: LoginStoreService,
        private eventsService: EventsService,
        private nativeAppConfig: NativeAppConfig,
        private nativeAppService: NativeAppService,
    ) {
        this.eventsService.events.pipe(filter((e: SimpleEvent) => e?.eventName === VanillaEventNames.LoginDialogClose)).subscribe(() => this.close());
    }

    /**
     * Opens login dialog with options or sends `OPEN_LOGIN_DIALOG` event to native if `sendOpenLoginDialogEvent` config is enabled.
     * [See config]{@link https://admin.dynacon.prod.env.works/services/198137/features/122791/keys/200652/valuematrix?_matchAncestors=true}
     */
    open(options?: ResponsiveLoginDialogOptions): MatDialogRef<LoginDialogComponent, LoginDialogData> | void {
        if (this.nativeAppConfig.sendOpenLoginDialogEvent) {
            this.nativeAppService.sendToNative({ eventName: NativeEventType.OPENLOGINDIALOG });
        } else {
            const loginDialogOptions = options || {};

            // append dummy querystring to force browser password reminder prompt
            const url = this.navigationService.location.clone();
            url.search.append('q', '1');

            this.loginStoreService.ReturnUrlFromLogin = loginDialogOptions.returnUrl || url.absUrl();
            const autoFocus = loginDialogOptions.autoFocus ?? this.loginConfig.autoFocusUsername;

            this.openDialog(LoginDialogComponent, {
                ...(autoFocus != null ? { autoFocus } : {}),
                ...(loginDialogOptions.restoreFocus != null ? { restoreFocus: loginDialogOptions.restoreFocus } : {}),
                data: {
                    ...loginDialogOptions,
                },
            });

            return this.dialogRef;
        }
    }

    openOAuthDialog(data?: LoginOAuthDialogData): MatDialogRef<LoginOAuthComponent, LoginDialogData> {
        this.openDialog(LoginOAuthComponent, {
            data: {
                ...(data || {}),
            },
        });

        return this.dialogRef;
    }

    openWelcomeDialog(data: LoginProviderProfile): MatDialogRef<LoginWelcomeDialogComponent, LoginProviderProfile> {
        this.openDialog(LoginWelcomeDialogComponent, { data });

        return this.dialogRef;
    }

    close() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    private openDialog<T, C>(component: ComponentType<T>, config?: MatDialogConfig<C>) {
        this.isOpened = true;
        this.dialogRef = this.dialog.open(component, config);

        this.dialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe(() => {
                this.isOpened = false;
            });
    }
}
