import { Injectable } from '@angular/core';

import {
    ClientConfigService,
    CookieName,
    CookieService,
    DeviceService,
    DslService,
    GenericListItem,
    Logger,
    MediaQueryService,
    MenuContentItem,
    UserLoginEvent,
    UserService,
} from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, switchMap, takeUntil } from 'rxjs/operators';

import { AccountMenuConfig } from './account-menu.client-config';

/** @stable */
@Injectable({
    providedIn: 'root',
})
export class AccountMenuDataService {
    topItemsLoaded: BehaviorSubject<MenuContentItem[]> = new BehaviorSubject<MenuContentItem[]>([]);
    menuContentUpdated: Subject<void> = new Subject();
    private lookup = new Map<string, MenuContentItem>();
    private onWidgetUpdate: Subject<void> = new Subject();
    private itemHierarchy: any;
    private contentEvents = new BehaviorSubject<MenuContentItem | null>(null);
    private topItems: MenuContentItem[] = [];
    private unsubscribe = new Subject<void>();
    private singlePageModeEnabled: boolean = false;

    constructor(
        private menuContent: AccountMenuConfig,
        private dslService: DslService,
        private user: UserService,
        private clientConfigService: ClientConfigService,
        private log: Logger,
        private deviceService: DeviceService,
        private cookieService: CookieService,
        private media: MediaQueryService,
    ) {}

    /** Indicates widget item update */
    get widgetUpdate(): Observable<void> {
        return this.onWidgetUpdate;
    }

    get isDesktop() {
        return this.media.isActive('gt-sm');
    }

    /** Indicates that the menu will operate in router mode (e.g. it will open as a route rather than overlay) */
    get routerMode(): boolean {
        return this.deviceService.isMobilePhone;
    }

    get routerModeReturnUrl(): string {
        return this.cookieService.get(CookieName.VnMenuReturnUrl);
    }

    /** Translated strings from sitecore related to the account menu. */
    get resources(): GenericListItem {
        return this.version === 1 ? this.menuContent.resources : { messages: this.menuContent.account.root.resources };
    }

    get vipLevels(): MenuContentItem[] {
        return this.menuContent.vipLevels;
    }

    get hierarchy(): any {
        return this.itemHierarchy;
    }

    get version(): number {
        return this.menuContent.account.version;
    }

    get content(): Observable<MenuContentItem> {
        return this.contentEvents.pipe(
            filter(Boolean),
            distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)),
        );
    }

    get topMenuItems(): MenuContentItem[] {
        return this.topItems;
    }

    get profilePageItemsPosition(): { [key: string]: number } {
        return this.menuContent.account.profilePageItemsPosition;
    }

    /** Indicates whether single page mode is enabled or not */
    get singlePageMode(): boolean {
        return this.singlePageModeEnabled;
    }

    set singlePageMode(singlePageMode: boolean) {
        this.singlePageModeEnabled = singlePageMode;
    }

    init() {
        this.dslService
            .evaluateContent(this.menuContent.account.root)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((c) => this.forceRefresh(c));

        this.user.events.pipe(first((e) => e instanceof UserLoginEvent)).subscribe(() =>
            this.clientConfigService.reload([AccountMenuConfig]).then(() => {
                this.menuContentUpdated.next();
                this.unsubscribe.next();
                this.unsubscribe.complete();
                this.forceRefresh(this.menuContent.account.root);
                this.dslService.evaluateContent(this.menuContent.account.root).subscribe((c) => this.forceRefresh(c));
            }),
        );

        this.topItemsLoaded
            .pipe(
                distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)),
                switchMap((topItems) => {
                    this.topItems = []; //Clear list before evaluating new content to avoid old items showing up till evaluation happens.
                    return this.dslService.evaluateContent(topItems);
                }),
            )
            .subscribe((items) => {
                this.topItems = items;
            });
    }

    /** Refreshes account menu widgets section. */
    refreshWidgets() {
        this.onWidgetUpdate.next();
    }

    /** Sets the menu's return url cookie to the supplied url value. */
    setReturnUrlCookie(url: string) {
        this.cookieService.put(CookieName.VnMenuReturnUrl, url);
    }

    /** Remove the menu return url cookie. */
    removeReturnUrlCookie() {
        this.cookieService.remove(CookieName.VnMenuReturnUrl);
    }

    getItem(name: string): MenuContentItem | null {
        return this.lookup.get(name) || null;
    }

    private forceRefresh(c: MenuContentItem) {
        this.lookup.clear();
        this.itemHierarchy = {};

        this.initMenu(c, this.itemHierarchy);
        this.contentEvents.next(c);
    }

    private initMenu(item: MenuContentItem, hierarchy: any) {
        if (this.lookup.has(item.name)) {
            this.log.warn(`Menu contains multiple items with the same name: ${item.name}`);
        }

        this.lookup.set(item.name, item);

        if (item.children) {
            const childHierarchy = {};
            item.children.forEach((i) => this.initMenu(i, childHierarchy));
            hierarchy[item.name] = childHierarchy;
        } else {
            hierarchy[item.name] = null;
        }
    }
}
