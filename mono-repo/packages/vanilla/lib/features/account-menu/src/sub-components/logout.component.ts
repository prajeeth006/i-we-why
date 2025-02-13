import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { CommonMessages, MenuActionOrigin } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-am-logout',
    templateUrl: 'logout.html',
})
export class LogoutComponent extends AccountMenuItemBase {
    msg: any;
    wait: boolean;

    constructor(commonMessages: CommonMessages) {
        super();

        this.msg = commonMessages;
    }

    logout() {
        if (this.wait) {
            return;
        }

        this.wait = true;

        this.menuActionsService
            .invoke('logout', MenuActionOrigin.Menu, [undefined, undefined, { manualLogout: 'true' }])
            .then(() => (this.wait = false));
    }
}
