import { Injectable } from '@angular/core';

import { CookieDBService, CookieList, MenuContentItem } from '@frontend/vanilla/core';
import { toNumber } from 'lodash-es';
import { ReplaySubject } from 'rxjs';

import { AccountMenuDataService } from './account-menu-data.service';
import { AccountMenuTaskStatus } from './account-menu.models';

/** @stable */
@Injectable({
    providedIn: 'root',
})
export class AccountMenuTasksService {
    expanded: boolean;

    get totalCount(): number {
        return this.items.length;
    }

    get totalUrgentCount(): number {
        return this.items.filter((x) => x.parameters['status'] === AccountMenuTaskStatus.URGENT).length;
    }

    displayItems: ReplaySubject<MenuContentItem[]> = new ReplaySubject<MenuContentItem[]>();

    private items: MenuContentItem[] = [];
    private db: CookieList<string>;

    constructor(
        private accountMenuDataService: AccountMenuDataService,
        cookieDBService: CookieDBService,
    ) {
        this.db = cookieDBService.createList('am-hidden-tasks');
        this.accountMenuDataService.content.subscribe(() => {
            const item = this.accountMenuDataService.getItem('tasks');

            if (item && item.children) {
                this.items = this.items = this.items
                    .filter((existingItem) => item.children.some((child) => child.name === existingItem.name))
                    .concat(item.children.filter((child) => !this.items.some((existingItem) => existingItem.name === child.name)));
                this.refreshItems();
            }
        });
    }

    /** Hides task items. */
    hide(items: MenuContentItem[]) {
        items.forEach((item) => this.db.insert(item.name));
        this.refreshItems();
    }

    /** Shows all tasks. */
    showAllHidden() {
        this.db.deleteAll();
        this.refreshItems();
    }

    /** Indicates if there are hidden tasks. */
    hasHidden() {
        return this.db.getAll().length > 0;
    }

    /** Updates task item. */
    update(item: MenuContentItem) {
        this.items[this.items.indexOf(item)] = item;
        this.refreshItems();
    }

    /** Determines if item is urgent. */
    isUrgent(item: MenuContentItem): boolean {
        return item.parameters['status'] === AccountMenuTaskStatus.URGENT;
    }

    private refreshItems() {
        this.displayItems.next(
            this.items.filter((t) => !this.db.getAll().includes(t.name)).sort((a, b) => this.getItemOrder(a) - this.getItemOrder(b)),
        );
    }

    private getItemOrder(item: MenuContentItem): number {
        const order = toNumber(item.parameters['order'] ?? '10');
        const status = item.parameters['status'] ?? AccountMenuTaskStatus.PENDING;
        const statusMultiplier = status === AccountMenuTaskStatus.URGENT ? 1 : 100;

        return order * statusMultiplier;
    }
}
