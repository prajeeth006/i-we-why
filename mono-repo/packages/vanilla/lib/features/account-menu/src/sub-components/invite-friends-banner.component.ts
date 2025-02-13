import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, ImageComponent, IconCustomComponent],
    selector: 'vn-am-invite-friends-banner',
    templateUrl: 'invite-friends-banner.html',
})
export class InviteFriendsBannerComponent extends AccountMenuItemBase {
    constructor() {
        super();
    }
}
