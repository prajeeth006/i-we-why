import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
    DynamicComponentDirective,
    DynamicHtmlDirective,
    ElementKeyDirective,
    MenuContentItem,
    NavigationService,
    SwipeDirection,
    SwipeDirective,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { AccountMenuDataService, AccountMenuTasksService } from '@frontend/vanilla/shared/account-menu';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AccountMenuDrawerService } from '../../account-menu-drawer.service';
import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuTrackingService } from '../../account-menu-tracking.service';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        DynamicHtmlDirective,
        DynamicComponentDirective,
        ElementKeyDirective,
        TrustAsHtmlPipe,
        SwipeDirective,
        IconCustomComponent,
    ],
    selector: 'vn-am-tasks',
    templateUrl: 'tasks.html',
})
export class AccountMenuTasksComponent extends AccountMenuItemBase implements OnInit {
    count: number;
    urgentCount: number;
    items: MenuContentItem[] = [];

    constructor(
        public accountMenuTasksService: AccountMenuTasksService,
        private navigation: NavigationService,
        private accountMenuDataService: AccountMenuDataService,
        private accountMenuTrackingService: AccountMenuTrackingService,
        private accountMenuDrawerService: AccountMenuDrawerService,
        private webWorkerService: WebWorkerService,
        private destroyRef: DestroyRef,
    ) {
        super();

        this.accountMenuTasksService.displayItems
            .pipe(this.predicate(), takeUntilDestroyed(this.destroyRef))
            .subscribe((displayItems: MenuContentItem[]) => {
                this.items = displayItems;
                this.count = displayItems.length;

                this.webWorkerService.createWorker(WorkerType.AccountMenuTasksTimeout, { timeout: 100 }, () => {
                    this.urgentCount = displayItems.filter((i: MenuContentItem) => this.accountMenuTasksService.isUrgent(i)).length;
                    this.webWorkerService.removeWorker(WorkerType.AccountMenuTasksTimeout);
                });
            });
    }

    get template(): string {
        return this.accountMenuDataService.routerMode ? 'menu-mobile' : this.mode;
    }

    get pendingLabel(): string {
        return this.item.resources['status-pending'] || '';
    }

    get urgentLabel(): string {
        return this.item.resources['status-urgent'] || '';
    }

    get pendingMessage(): string {
        return this.item.resources['pending-tasks-message']?.replace('#COUNT', this.count.toString()).replace('#LABEL', this.pendingLabel) || '';
    }

    get tasksExpandoClass(): string {
        return this.accountMenuTasksService.expanded || this.items.length === 1 ? '' : 'ch-task-card-stack--closed';
    }

    ngOnInit() {
        this.accountMenuTasksService.expanded = this.accountMenuTasksService.expanded || this.navigation.location.search.get('expandtasks') === '1';

        // added debounceTime so the tasks are tracked only once
        this.accountMenuTasksService.displayItems
            .pipe(this.predicate(), debounceTime(1000), takeUntilDestroyed(this.destroyRef))
            .subscribe((displayItems: MenuContentItem[]) => {
                this.accountMenuTrackingService.trackTasksLoaded(displayItems);
            });
    }

    toggle() {
        this.accountMenuTasksService.expanded = !this.accountMenuTasksService.expanded;

        if (this.accountMenuDataService.routerMode) {
            this.accountMenuDrawerService.minimizeDrawer();
        }

        if (this.template == 'page') {
            this.accountMenuTrackingService.trackShowMoreClick(this.accountMenuTasksService.expanded);
        } else if (this.accountMenuTasksService.expanded) {
            this.accountMenuTrackingService.trackTaskStack(this.items);
        }
    }

    collapse() {
        this.accountMenuTasksService.expanded = false;
        this.accountMenuDrawerService.minimizeDrawer();
    }

    gotoProfile() {
        this.accountMenuTrackingService.trackTaskOpenProfile();
        this.navigation.goTo('/profile?expandtasks=1');
    }

    onSwipe(direction: SwipeDirection) {
        if (direction === SwipeDirection.Left) {
            this.hidePending();
        } else if (direction === SwipeDirection.Up) {
            this.collapse();
        }
    }

    hidePending() {
        if (!this.accountMenuTasksService.expanded) {
            const pendingTasks = this.items.filter((item: MenuContentItem) => !this.accountMenuTasksService.isUrgent(item));
            this.accountMenuTasksService.hide(pendingTasks);
        }
    }

    showAllHidden(event: Event) {
        event.stopPropagation();
        this.accountMenuTasksService.expanded = true;
        this.accountMenuTasksService.showAllHidden();
        this.accountMenuTrackingService.trackShowAll();
        this.accountMenuDrawerService.minimizeDrawer();
    }

    private predicate: <T>() => OperatorFunction<T, T> = () =>
        distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current));
}
