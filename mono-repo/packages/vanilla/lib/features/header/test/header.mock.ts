import { signal } from '@angular/core';

import { MenuContentItem, HeaderService as PublicHeaderService } from '@frontend/vanilla/core';
import { HeaderSearchService } from '@frontend/vanilla/shared/header';
import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { HeaderConfig } from '../src/header.client-config';
import { HeaderService } from '../src/header.service';

@Mock({ of: PublicHeaderService })
export class PublicHeaderServiceMock {
    unauthItems = signal<MenuContentItem[] | null>(null);
    productItems = signal<MenuContentItem[] | null>(null);
    pillItems = signal<MenuContentItem[] | null>(null);
    balance = signal<number | null>(null);
    bonusBalance = signal<number | null>(null);
    activeProduct = signal<MenuContentItem | null>(null);
    headerVisible = signal<boolean>(false);
    highlightedProduct = new BehaviorSubject<MenuContentItem | null>(null);
    whenReady: Subject<void> = new Subject();
    display: BehaviorSubject<boolean> = new BehaviorSubject(true);
    @Stub() getHeaderHeight: jasmine.Spy;
    @Stub() highlightProduct: jasmine.Spy;
    @Stub() applyStickiness: jasmine.Spy;
    @Stub() getHeaderComponent: jasmine.Spy;
    @Stub() setHeaderComponent: jasmine.Spy;
    @Stub() registerLazyCmp: jasmine.Spy;
    @Stub() getLazyComponent: jasmine.Spy;
    @Stub() preload: jasmine.Spy;
    @Stub() show: jasmine.Spy;
    @Stub() hide: jasmine.Spy;
    @Stub() itemDisabled: jasmine.Spy;
    @Stub() setHighlightedProduct: jasmine.Spy;
    @Stub() initProductHighlighting: jasmine.Spy;
    @Stub() initMenuItems: jasmine.Spy;
}

@Mock({ of: HeaderService })
export class HeaderServiceMock extends PublicHeaderServiceMock {}

@Mock({ of: HeaderSearchService })
export class HeaderSearchServiceMock {
    @Stub() click: jasmine.Spy;
}

@Mock({ of: HeaderConfig })
export class HeaderConfigMock extends HeaderConfig {
    override whenReady = new Subject<void>();

    constructor() {
        super();

        this.disabledItems = { disabled: 'TRUE', sections: ['header_sections'] };
        this.elements = { logo: { name: 'logo', clickAction: 'gotoHome' } } as any;
        this.products = [
            { name: 'sports', url: 'http://bwin.com/sports', text: 'Sportsbook', parameters: {}, resources: {} },
            { name: 'testweb', url: 'http://bwin.com/testweb', text: 'Vanilla Testweb', parameters: {}, resources: {} },
        ] as any;
    }
}
