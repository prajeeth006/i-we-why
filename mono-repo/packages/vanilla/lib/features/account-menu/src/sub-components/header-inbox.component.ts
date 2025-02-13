import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { InboxService } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-am-header-inbox',
    templateUrl: 'header-inbox.html',
})
export class HeaderInboxComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    newMessagesCount: number = 0;
    newMessagesText: string;

    private unsubscribe = new Subject<void>();

    constructor(private inboxService: InboxService) {
        super();
    }

    ngOnInit() {
        this.inboxService.whenReady.subscribe(() => {
            this.inboxService.count.pipe(takeUntil(this.unsubscribe)).subscribe((count: number) => {
                this.newMessagesCount = count || 0;
                this.newMessagesText = this.item.resources['NewMessagesText']!.replace('_COUNT_', this.newMessagesCount.toString());
            });
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
