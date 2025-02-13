import { Injectable } from '@angular/core';

import {
    CookieDBService,
    CookieList,
    CookieName,
    DslService,
    MenuContentItem,
    UserLogoutEvent,
    UserService,
    UserSessionExpiredEvent,
} from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';

/** @stable */
@Injectable({
    providedIn: 'root',
})
export class ProfilePageNudgesService {
    displayItems: ReplaySubject<MenuContentItem[]> = new ReplaySubject<MenuContentItem[]>();
    private items: MenuContentItem[] = [];
    private db: CookieList<string>;

    constructor(
        private accountMenuDataService: AccountMenuDataService,
        private user: UserService,
        dslService: DslService,
        cookieDBService: CookieDBService,
    ) {
        this.db = cookieDBService.createList(CookieName.AmHiddenNudges);
        const item = this.accountMenuDataService.getItem('nudges');

        if (!item) return;

        dslService.evaluateContent(item.children).subscribe((items: MenuContentItem[]) => {
            this.items = items;
            this.refreshItems();
        });

        this.user.events
            .pipe(filter((e) => e instanceof UserSessionExpiredEvent || e instanceof UserLogoutEvent))
            .subscribe(() => this.db.deleteAll());
    }

    /** Hides nudges item. */
    hide(item: MenuContentItem) {
        this.db.insert(item.name);
        this.refreshItems();
    }

    private refreshItems() {
        this.displayItems.next(this.items.filter((t) => !this.db.getAll().includes(t.name)));
    }
}
