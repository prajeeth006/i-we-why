import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { InboxService, MenuContentItem, TrackingService } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { AccountMenuTasksService } from '@frontend/vanilla/shared/account-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    standalone: true,
    imports: [MenuItemComponent, CommonModule],
    selector: 'vn-inbox-card',
    templateUrl: 'inbox-card.html',
})
export class InboxCardComponent implements OnInit, OnDestroy {
    @Input() item: MenuContentItem;
    inboxMessagesText: string | undefined;
    private unsubscribe = new Subject<void>();

    constructor(
        private inboxService: InboxService,
        private accountMenuTasksService: AccountMenuTasksService,
        private trackingService: TrackingService,
    ) {}

    ngOnInit() {
        this.inboxService.whenReady.subscribe(() => {
            this.inboxService.count.pipe(takeUntil(this.unsubscribe)).subscribe((count: number) => {
                this.inboxMessagesText = this.item.resources['Text']!.replace('_COUNT_', (count || 0).toString());
            });
        });

        this.trackingService.triggerEvent('contentView', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my hub',
            'component.ActionEvent': 'load',
            'component.PositionEvent': `pending tasks ${this.accountMenuTasksService.totalCount} - urgent tasks ${this.accountMenuTasksService.totalUrgentCount}`,
            'component.LocationEvent': 'my hub page',
            'component.EventDetails': 'my inbox section',
            'component.URLClicked': 'not applicable',
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
