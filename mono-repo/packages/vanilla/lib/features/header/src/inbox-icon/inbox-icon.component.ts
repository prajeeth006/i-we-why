import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { InboxService, UserService } from '@frontend/vanilla/core';
import { MenuItemBadgeDirective } from '@frontend/vanilla/features/menus';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemBadgeDirective],
    selector: 'lh-inbox-icon',
    templateUrl: 'inbox-icon.html',
})
export class InboxIconComponent extends HeaderItemBase {
    private isEnabled: boolean = false;
    get visible(): boolean {
        return this.isEnabled && this.user.isAuthenticated;
    }

    constructor(
        private inboxService: InboxService,
        private user: UserService,
    ) {
        super();
        this.inboxService.whenReady.subscribe(() => (this.isEnabled = this.inboxService.isEnabled));
    }

    showInbox() {
        this.inboxService.open({
            showBackButton: false,
            trackingEventName: 'Event.inbox.clicked_icon',
        });
    }
}
