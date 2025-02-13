import { inject } from '@angular/core';

import { MenuContentItem, SwipeDirection } from '@frontend/vanilla/core';
import { AccountMenuDataService, AccountMenuTaskStatus, AccountMenuTasksService } from '@frontend/vanilla/shared/account-menu';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuTrackingService } from '../../account-menu-tracking.service';

export class AccountMenuTaskBaseComponent extends AccountMenuItemBase {
    tasksService = inject(AccountMenuTasksService);

    private accountMenuTrackingService = inject(AccountMenuTrackingService);
    private accountMenuDataService = inject(AccountMenuDataService);

    constructor() {
        super();
    }

    get resources(): { [k: string]: string } | undefined {
        return this.accountMenuDataService.getItem('tasks')?.resources;
    }

    onSwipe(direction: SwipeDirection, item: MenuContentItem) {
        if (!this.tasksService.isUrgent(item) && direction === SwipeDirection.Left) {
            this.accountMenuTrackingService.trackTaskSwiped();
            this.tasksService.hide([item]);
        }
    }

    close(item: MenuContentItem) {
        this.accountMenuTrackingService.trackTaskClosed(item.name);
        this.tasksService.hide([item]);
    }

    refreshItem(order: number, status: AccountMenuTaskStatus, description: string | null = null) {
        this.item.parameters.order = order.toString();
        this.item.parameters.status = status;

        if (description) {
            this.item.resources.Description = description;
        }

        this.tasksService.update(this.item);
    }
}
