import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import {
    EventsService,
    LoginDialogData,
    LoginStoreService,
    NavigationService,
    ResponsiveLoginDialogOptions,
    VanillaEventNames,
} from '@frontend/vanilla/core';
import { filter, take } from 'rxjs/operators';

import { LoginDialogComponent } from './login-dialog.component';

@Injectable()
export class LoginDialogService {
    private isOpened: boolean = false;
    private dialogRef: MatDialogRef<any>;

    constructor(
        // private loginConfig: LoginConfig,
        private dialog: MatDialog,
        private navigation: NavigationService,
        private loginStore: LoginStoreService,
        private eventsService: EventsService,
    ) {
        this.eventsService.events.pipe(filter((e) => e?.eventName === VanillaEventNames.LoginDialogClose)).subscribe(() => this.close());
    }

    get opened(): boolean {
        return this.isOpened;
    }

    /** Opens login dialog with options */
    open(options?: ResponsiveLoginDialogOptions): MatDialogRef<LoginDialogComponent, LoginDialogData> {
        const loginDialogOptions = options || {};

        // append dummy querystring to force browser password reminder prompt
        const url = this.navigation.location.clone();
        url.search.append('q', '1');

        this.loginStore.ReturnUrlFromLogin = loginDialogOptions.returnUrl || url.absUrl();

        this.openDialog(LoginDialogComponent, {
            autoFocus: loginDialogOptions.autoFocus ?? false, // Get from config
            ...(loginDialogOptions.restoreFocus != null ? { restoreFocus: loginDialogOptions.restoreFocus } : {}),
            data: {
                ...loginDialogOptions,
            },
        });

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
