import { signal } from '@angular/core';

import { BOTTOM_DRAWER_HEIGHT, DrawerPosition, DrawerPositionSettings } from '@frontend/vanilla/shared/account-menu';
import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { AccountMenuDrawerService } from '../src/account-menu-drawer.service';

@Mock({ of: AccountMenuDrawerService })
export class AccountMenuDrawerServiceMock {
    drawerPosition = signal<DrawerPositionSettings>({
        position: DrawerPosition.Bottom,
        height: BOTTOM_DRAWER_HEIGHT,
    });
    resetDrawerPosition = new Subject<void>();

    @Stub() setDrawerPosition: jasmine.Spy;
    @Stub() minimizeDrawer: jasmine.Spy;
    @Stub() resetDrawer: jasmine.Spy;
}
