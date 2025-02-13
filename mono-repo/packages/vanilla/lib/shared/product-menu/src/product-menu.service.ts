import { Injectable, Type, signal } from '@angular/core';

import {
    DslService,
    EventsService,
    MenuContentItem,
    MenuItemsService,
    MenuSection,
    SessionStoreService,
    VanillaEventNames,
} from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

import { ProductMenuConfig } from './product-menu.client-config';

const ProductMenuReturnUrlKey = 'vn.ProductMenuReturnUrl';

/**
 * @whatItDoes Provides functionality to manipulate the product menu.
 *
 * @description
 *
 * # Overview
 *
 * This service provides functionality for manipulating the product menu:
 *  - Toggle the menu
 *  - Switch tab
 *  - Open the menu as a page base on a route
 *  - Set counter for menu item
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ProductMenuService {
    readonly apps = signal<MenuContentItem | null>(null);
    readonly childTabs = signal<MenuContentItem[] | null>(null);

    get initialized(): Observable<boolean> {
        return this.initializedEvents;
    }

    get currentTab(): Observable<MenuContentItem | null> {
        return this.tabEvents;
    }

    get routerModeReturnUrl(): string | null {
        return this.sessionStoreService.get(ProductMenuReturnUrlKey);
    }

    get routerMode(): boolean {
        return this.productMenuConfig.routerMode;
    }

    get v2(): boolean {
        return this.productMenuConfig.v2;
    }

    get content(): Observable<MenuContentItem> {
        return this.contentEvents;
    }

    get tabCount(): number {
        return this.tabs.size;
    }

    private readonly childTabs$$ = new ReplaySubject<MenuContentItem[]>(1);
    readonly childTabs$ = this.childTabs$$.asObservable();

    private readonly apps$$ = new ReplaySubject<MenuContentItem>(1);
    readonly apps$ = this.apps$$.asObservable();

    private tabEvents = new BehaviorSubject<MenuContentItem | null>(null);
    private productMenuComponents = new Map<string, Type<any>>();
    private contentEvents = new ReplaySubject<MenuContentItem>(1);
    private tabs: Map<string, MenuContentItem> = new Map();
    private initializedEvents: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private menuItemsService: MenuItemsService,
        private eventsService: EventsService,
        private productMenuConfig: ProductMenuConfig,
        private sessionStoreService: SessionStoreService,
        private dslService: DslService,
    ) {}

    init() {
        if (this.v2) {
            this.dslService.evaluateContent(this.productMenuConfig.menu).subscribe((c) => {
                this.initTabs(c);
                this.contentEvents.next(c);
            });
        } else {
            this.initTabs(this.productMenuConfig.tabs);

            if (this.productMenuConfig.tabs && this.productMenuConfig.tabs.children) {
                this.dslService.evaluateContent(this.productMenuConfig.tabs.children).subscribe((childTabs: MenuContentItem[]) => {
                    this.childTabs$$.next(childTabs);
                    this.childTabs.set(childTabs);
                });
            }

            this.dslService.evaluateContent(this.productMenuConfig.apps).subscribe((apps: MenuContentItem) => {
                this.apps$$.next(apps);
                this.apps.set(apps);
            });
        }
    }

    openTab(tabName: string | null) {
        const tab = (tabName && this.tabs.get(tabName)) || null;

        if (this.v2) {
            this.menuItemsService.setActive(MenuSection.ProductMenu, tab ? tab.name : null);
        } else {
            this.menuItemsService.setActive(MenuSection.ProductMenuTop, tab ? tab.name : null);
        }

        this.tabEvents.next(tab);
    }

    isTab(item: MenuContentItem): boolean {
        const tab = this.tabs.get(item.name);

        return tab === item;
    }

    setTabItemCounter(tabName: string, count: any, cssClass?: string) {
        this.menuItemsService.setCounter(this.v2 ? MenuSection.ProductMenu : MenuSection.ProductMenuTop, tabName, count, cssClass);
    }

    setItemCounter(itemName: string, count: any, cssClass?: string) {
        this.menuItemsService.setCounter(MenuSection.ProductMenu, itemName, count, cssClass);
    }

    /** Set a component type for menu item type. */
    setProductMenuComponent(itemType: string, component: Type<any>) {
        this.productMenuComponents.set(itemType, component);
    }

    /** Gets a component type for menu item type. */
    getProductMenuComponent(itemType: string | undefined): Type<any> | null {
        itemType = itemType || 'default';

        return this.productMenuComponents.get(itemType) || null;
    }

    /** Set a description text and cssClass of the product menu item. If descriptionCssClass is null it will falback to default css class used. */
    setItemDescription(itemName: string, description: string | null, descriptionCssClass: string | null) {
        this.menuItemsService.setDescription(MenuSection.ProductMenu, itemName, description);
        this.menuItemsService.setDescriptionCssClass(MenuSection.ProductMenu, itemName, descriptionCssClass);
    }

    /** toggle */
    toggle(
        open?: boolean,
        options?: {
            initialTab?: string;
            animateFrom?: 'left' | 'bottom';
            disableCloseAnimation?: boolean;
        },
    ) {
        this.eventsService.raise({
            eventName: VanillaEventNames.ProductMenuToggle,
            data: {
                open,
                options,
            },
        });
    }

    private initTabs(menu: MenuContentItem) {
        this.tabs.clear();

        const tabs = this.v2 ? menu.children.find((c: MenuContentItem) => c.name === 'tabs') : menu;

        if (tabs?.children) {
            tabs.children.forEach((c: MenuContentItem) => this.tabs.set(c.name, c));
        }

        this.initializedEvents.next(true);
    }
}
