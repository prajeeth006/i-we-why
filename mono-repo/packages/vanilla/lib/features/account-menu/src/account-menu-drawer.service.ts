import { Injectable, inject, signal } from '@angular/core';

import { CookieName, CookieService } from '@frontend/vanilla/core';
import { BOTTOM_DRAWER_HEIGHT, DrawerPosition, DrawerPositionSettings } from '@frontend/vanilla/shared/account-menu';
import { Observable, Subject } from 'rxjs';

import { AccountMenuTrackingService } from './account-menu-tracking.service';

/**
 * @whatItDoes Provides functionality to manipulate the account menu drawer.
 *
 * @description
 *
 * # Overview
 *
 * This service provides functionality for manipulating the account menu drawer:
 *  - Set drawer position
 *  - Minimize drawer
 *  - Reset drawer
 *
 * @stable
 */
@Injectable({ providedIn: 'root' })
export class AccountMenuDrawerService {
    private cookieService = inject(CookieService);
    private accountMenuTrackingService = inject(AccountMenuTrackingService);

    readonly drawerPosition = signal<DrawerPositionSettings>(
        this.cookieService.getObject(CookieName.AccountMenuDrawer) || {
            position: DrawerPosition.Bottom,
            height: BOTTOM_DRAWER_HEIGHT,
        },
    );

    /** Drawer reset events. */
    get resetDrawerPosition(): Observable<void> {
        return this.resetDrawerPositionEvents;
    }

    private resetDrawerPositionEvents = new Subject<void>();

    /** Sets drawer position according to the provided settings.
     * @param positionSettings Position settings: {@link DrawerPositionSettings}
     **/
    setDrawerPosition(positionSettings: DrawerPositionSettings) {
        this.drawerPosition.set(positionSettings);
        this.cookieService.putObject(CookieName.AccountMenuDrawer, positionSettings);
        this.accountMenuTrackingService.trackDrawer(positionSettings);
    }

    /** Minimize the drawer. */
    minimizeDrawer() {
        this.setDrawerPosition({
            position: DrawerPosition.Bottom,
            height: BOTTOM_DRAWER_HEIGHT,
            isAutomaticallyOpened: true,
        });
    }

    /** Broadcast drawer reset event. */
    resetDrawer() {
        this.resetDrawerPositionEvents.next();
    }
}
