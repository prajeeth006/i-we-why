import { signal } from '@angular/core';

import { MenuContentItem } from '@frontend/vanilla/core';
import { ProductMenuConfig, ProductMenuService } from '@frontend/vanilla/shared/product-menu';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

import { ProductMenuTrackingService } from '../src/product-menu-tracking.service';
import { ProductMenuService as LocalProductMenuService } from '../src/product-menu.service';

@Mock({ of: ProductMenuService })
export class ProductMenuServiceMock {
    v2: boolean;
    tabCount: number;
    currentTab = new BehaviorSubject<MenuContentItem | null>(null);
    content = new ReplaySubject<MenuContentItem>(1);
    routerModeReturnUrl: string;
    initialized = new BehaviorSubject<boolean>(false);
    childTabs$ = new ReplaySubject<MenuContentItem[]>(1);
    apps$ = new ReplaySubject<MenuContentItem>(1);
    apps = signal<MenuContentItem | null>(null);
    childTabs = signal<MenuContentItem[] | null>(null);
    @Stub() openTab: jasmine.Spy;
    @Stub() isTab: jasmine.Spy;
    @Stub() setItemCounter: jasmine.Spy;
    @Stub() setTabItemCounter: jasmine.Spy;
    @Stub() getProductMenuComponent: jasmine.Spy;
    @Stub() setProductMenuComponent: jasmine.Spy;
    @Stub() toggle: jasmine.Spy;
    @Stub() init: jasmine.Spy;
}

@Mock({ of: LocalProductMenuService })
export class LocalProductMenuServiceMock {
    @Stub() toggle: jasmine.Spy;
}

@Mock({ of: ProductMenuTrackingService })
export class ProductMenuTrackingServiceMock {
    @Stub() trackProductMenuClose: jasmine.Spy;
}

@Mock({ of: ProductMenuConfig })
export class ProductMenuConfigMock extends ProductMenuConfig {
    override whenReady = new Subject<void>();

    constructor() {
        super();

        this.tabs =
            ({
                children: [
                    { name: 'sports', url: 'http://sports', text: 'Sportsbook', children: [] },
                    { name: 'testweb', url: 'http://testweb', text: 'Vanilla Testweb' },
                ] as any,
            } as MenuContentItem) || null;

        this.apps =
            ({
                children: [
                    { name: 'casino', url: 'http://casino', text: 'Casino' },
                    { name: 'sports', url: 'http://sports', text: 'Sportsbook' },
                ] as any,
            } as MenuContentItem) || null;

        this.numberOfApps = 5;
    }
}
