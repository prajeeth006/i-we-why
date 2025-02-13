import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { LazyServiceProviderBase } from '../lazy/service-providers/lazy-service-provider-base';
import { EventsService, VanillaEventNames } from '../utils/events.service';
import { LoginDialogData, LoginOAuthDialogData, LoginProviderProfile, ResponsiveLoginDialogOptions } from './login.models';

/**
 * @whatItDoes Provides login dialog opening
 *
 * Optionally, an observable result can be returned after the dialog was closed. It will contain the options initially provided in the open method.
 *
 *  ```
 *  this.dlgService.open({
 *          openedBy: 'betslip'
 *      }).afterClosed().subscribe(result => {
 *          console.log(`${JSON.stringify(result, null, 2)}`);
 *      });
 *
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoginDialogService extends LazyServiceProviderBase {
    get opened(): boolean {
        return this.isOpened;
    }

    private isOpened: boolean = false;

    constructor(private eventsService: EventsService) {
        super();
    }

    /** Opens login dialog with options */
    open(options?: ResponsiveLoginDialogOptions): MatDialogRef<any, LoginDialogData> {
        const dialogRef = this.inner.open({
            returnUrl: options?.returnUrl,
            openedBy: options?.openedBy,
            loginMessageKey: options?.loginMessageKey,
            autoFocus: options?.autoFocus,
            restoreFocus: options?.restoreFocus,
            username: options?.username,
        });
        this.isOpened = true;
        dialogRef.afterClosed().subscribe(() => (this.isOpened = false));

        return dialogRef;
    }

    openOAuthDialog(options?: LoginOAuthDialogData): MatDialogRef<any, LoginDialogData> {
        return this.inner.openOAuthDialog(options);
    }

    openWelcomeDialog(data: LoginProviderProfile): MatDialogRef<any, LoginProviderProfile> {
        return this.inner.openWelcomeDialog(data);
    }

    close() {
        this.eventsService.raise({ eventName: VanillaEventNames.LoginDialogClose });
    }
}
