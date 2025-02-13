import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CookieName, NativeEventType, SlotName, VanillaEventNames, WINDOW } from '@frontend/vanilla/core';
import { NavigationLayoutPageComponent, TopMenuVisibility } from '@frontend/vanilla/features/navigation-layout';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { AccountMenuDataServiceMock } from '../../account-menu/test/account-menu-data.mock';
import { PublicAccountMenuServiceMock as AccountMenuServiceMock } from '../../account-menu/test/account-menu.mock';
import { HeaderBarServiceMock } from '../../header-bar/test/header-bar.mocks';
import { PublicHeaderServiceMock } from '../../header/test/header.mock';
import { NavigationLayoutConfigMock } from './navigation-layout.client-config.mock';
import { NavigationLayoutServiceMock } from './navigation-layout.mocks';

describe('NavigationLayoutPageComponent', () => {
    let fixture: ComponentFixture<NavigationLayoutPageComponent>;
    let component: NavigationLayoutPageComponent;
    let navigationServiceMock: NavigationServiceMock;
    let navigationLayoutServiceMock: NavigationLayoutServiceMock;
    let navigationLayoutConfigMock: NavigationLayoutConfigMock;
    let accountMenuServiceMock: AccountMenuServiceMock;
    let windowMock: WindowMock;
    let headerServiceMock: PublicHeaderServiceMock;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let htmlNodeMock: HtmlNodeMock;
    let headerBarService: HeaderBarServiceMock;
    let nativeApplication: NativeAppServiceMock;
    let pageMock: PageMock;
    let mediaMock: MediaQueryServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let urlService: UrlServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;

    beforeEach(() => {
        navigationLayoutServiceMock = MockContext.useMock(NavigationLayoutServiceMock);
        navigationLayoutConfigMock = MockContext.useMock(NavigationLayoutConfigMock);
        accountMenuServiceMock = MockContext.useMock(AccountMenuServiceMock);
        nativeApplication = MockContext.useMock(NativeAppServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        windowMock = new WindowMock();
        headerServiceMock = MockContext.useMock(PublicHeaderServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        MockContext.useMock(UserServiceMock);
        headerBarService = MockContext.useMock(HeaderBarServiceMock);
        pageMock = MockContext.useMock(PageMock);
        MockContext.useMock(CommonMessagesMock);
        mediaMock = MockContext.useMock(MediaQueryServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        urlService = MockContext.useMock(UrlServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);

        TestBed.overrideComponent(NavigationLayoutPageComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    MockContext.providers,
                    {
                        provide: WINDOW,
                        useValue: windowMock,
                    },
                ],
            },
        });

        pageMock.product = 'testweb';
        navigationLayoutServiceMock.getItem.and.returnValue({ parent: { name: 'settings' } });
        cookieServiceMock.get.withArgs(CookieName.PreviousPageUrl).and.returnValue('https://dev-testweb.vanilla.intranet/en/menu/menu/settings');
        urlService.parse.and.returnValue({ culture: 'en' });
        urlService.current.and.returnValue({ culture: 'en' });
    });

    function initComponent() {
        fixture = TestBed.createComponent(NavigationLayoutPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    it('should set properties on ngOnInit', () => {
        accountMenuDataServiceMock.version = 1;

        initComponent();
        component.ngOnInit();
        accountMenuServiceMock.whenReady.next();
        navigationLayoutConfigMock.whenReady.next();
        navigationLayoutServiceMock.initialized.next(true);
        expect(component.version).toBe(1);
    });

    it('should set v2 on ngOnInit', () => {
        accountMenuDataServiceMock.version = 2;
        accountMenuDataServiceMock.hierarchy = { main: { menu: { account: { name: {} } } } };
        accountMenuDataServiceMock.getItem.and.returnValues(
            { name: 'name', text: 'text', parameters: { highlightable: 'true' }, children: [] },
            { name: 'name2', text: 'text2', parameters: { highlightable: 'true' }, children: [] },
        );
        const image = <any>{ src: 'http://google.com/imagesrc' };
        navigationLayoutConfigMock.elements = <any>{ header: { image: image } };

        initComponent();
        accountMenuServiceMock.whenReady.next();
        navigationLayoutConfigMock.whenReady.next();
        navigationLayoutServiceMock.initialized.next(true);
        expect(component.version).toBe(2);
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('navigation-layout-open', true);
        expect(component.headerImage).toBe(image);
        expect(component.item).toEqual(<any>{ pageTitle: 'text', headerTitle: 'text', selectedTopItem: 'name', topMenuItems: [] });
        expect(accountMenuServiceMock.setActiveItem).toHaveBeenCalledWith('name');
    });

    it('should swap footer', fakeAsync(() => {
        accountMenuDataServiceMock.version = 5;
        const image = <any>{ src: 'http://google.com/imagesrc' };
        navigationLayoutConfigMock.elements = <any>{ header: { image: image } };

        initComponent();
        accountMenuServiceMock.whenReady.next();
        navigationLayoutConfigMock.whenReady.next();
        navigationLayoutServiceMock.initialized.next(true);

        expect(component.version).toBe(5);

        eventsServiceMock.allEvents.next({ eventName: VanillaEventNames.FooterLoaded });

        tick();

        expect(dynamicLayoutServiceMock.swap).toHaveBeenCalledWith(SlotName.Footer, SlotName.NavLayoutFooter, jasmine.anything());
    }));

    it('should not swap footer', fakeAsync(() => {
        accountMenuDataServiceMock.version = 5;
        const image = <any>{ src: 'http://google.com/imagesrc' };
        navigationLayoutConfigMock.elements = <any>{ header: { image: image } };

        initComponent();
        fixture.componentRef.setInput('swapFooterComponent', false);
        accountMenuServiceMock.whenReady.next();
        navigationLayoutConfigMock.whenReady.next();
        navigationLayoutServiceMock.initialized.next(true);

        expect(component.version).toBe(5);

        eventsServiceMock.allEvents.next({ eventName: VanillaEventNames.FooterLoaded });

        tick();

        expect(dynamicLayoutServiceMock.swap).not.toHaveBeenCalled();
    }));

    it('should not set active item if router mode enabled', () => {
        accountMenuDataServiceMock.version = 2;
        accountMenuDataServiceMock.hierarchy = { main: { menu: { account: { name: {} } } } };
        accountMenuDataServiceMock.getItem.and.returnValues(
            { name: 'name', text: 'text', parameters: { highlightable: 'true' }, children: [] },
            { name: 'name2', text: 'text2', parameters: { highlightable: 'true' }, children: [] },
        );
        const image = <any>{ src: 'http://google.com/imagesrc' };
        navigationLayoutConfigMock.elements = <any>{ header: { image: image } };

        accountMenuServiceMock.routerMode = true;
        initComponent();
        accountMenuServiceMock.whenReady.next();
        expect(accountMenuServiceMock.setActiveItem).not.toHaveBeenCalled();
    });

    it('should call highlightProduct', fakeAsync(() => {
        initComponent();
        component.highlightProduct = 'promo';
        component.ngOnInit();
        accountMenuServiceMock.whenReady.next();
        navigationLayoutConfigMock.whenReady.next();
        navigationLayoutServiceMock.initialized.next(true);

        tick();
        expect(headerServiceMock.highlightProduct).toHaveBeenCalledWith('promo');

        component.ngOnDestroy();
        accountMenuServiceMock.whenReady.next();
        tick();
        expect(headerServiceMock.highlightProduct).toHaveBeenCalledWith(null);
        expect(accountMenuServiceMock.setActiveItem).toHaveBeenCalledWith('');
    }));

    it('should set headerEnabled and react to changes', () => {
        initComponent();
        accountMenuServiceMock.whenReady.next();
        navigationLayoutConfigMock.whenReady.next();
        navigationLayoutServiceMock.initialized.next(true);

        expect(component.headerEnabled).toBeTrue();

        navigationLayoutServiceMock.headerEnabled.next(false);

        expect(component.headerEnabled).toBeFalse();

        navigationLayoutServiceMock.headerEnabled.next(true);

        expect(component.headerEnabled).toBeTrue();
    });

    it('should reinit on sourceItem change', () => {
        initComponent();
        spyOn(component, 'ngOnInit');

        const changes = {
            sourceItem: { currentValue: 'deposit', previousValue: 'withdraw', firstChange: true, isFirstChange: () => true },
        } as SimpleChanges;

        component.ngOnChanges(changes);
        expect(component.ngOnInit).not.toHaveBeenCalled();

        changes['sourceItem']!.firstChange = false;
        component.ngOnChanges(changes);
        expect(component.ngOnInit).toHaveBeenCalled();
    });

    describe('back', () => {
        it('should history back if routerModeReturnUrl is set', () => {
            accountMenuDataServiceMock.routerModeReturnUrl = '/';
            initComponent();
            component.back();
            expect(windowMock.history.back).toHaveBeenCalled();
        });

        it('should history back if document referrer is set', () => {
            windowMock.document.referrer = '/';
            initComponent();
            component.back();
            expect(windowMock.history.back).toHaveBeenCalled();
        });

        it('should redirect to settings menu page', () => {
            initComponent();
            accountMenuServiceMock.whenReady.next();
            navigationLayoutConfigMock.whenReady.next();
            navigationLayoutServiceMock.initialized.next(true);
            component.back();
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('/settings/navigation/settings');
        });

        it('should not call back on header bar service if suppressDefaultBackBehaviour is true', () => {
            initComponent();
            component.suppressDefaultBackBehaviour = true;
            component.back();
            expect(windowMock.history.back).not.toHaveBeenCalled();
            expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
            expect(navigationServiceMock.goToLastKnownProduct).not.toHaveBeenCalled();
        });

        it('Should go back with new language if language change', () => {
            initComponent();
            pageMock.lang = 'sk';
            urlService.parse.and.returnValue({ culture: 'sk', pathName: '/en/menu/menu/settings' });
            urlService.current.and.returnValue({ culture: 'en' });
            component.suppressDefaultBackBehaviour = false;
            component.back();
            expect(windowMock.history.back).not.toHaveBeenCalled();
            expect(navigationServiceMock.goTo).not.toHaveBeenCalledWith('/sk/menu/menu/settings');
        });
    });

    describe('close', () => {
        it('should emit onClose if observers set', () => {
            initComponent();
            spyOn(component.onClose, 'emit');
            component.onClose.subscribe(() => {});
            component.close();
            expect(component.onClose.emit).toHaveBeenCalled();
            expect(headerBarService.close).toHaveBeenCalled();
            expect(nativeApplication.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.PAGECLOSED,
                parameters: { product: 'testweb' },
            });
        });

        it('should call close on header bar service', () => {
            initComponent();
            spyOn(component.onClose, 'emit');
            component.close();
            expect(component.onClose.emit).not.toHaveBeenCalled();
            expect(headerBarService.close).toHaveBeenCalled();
            expect(nativeApplication.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.PAGECLOSED,
                parameters: { product: 'testweb' },
            });
        });

        it('should not call close on header bar service if suppressDefaultCloseBehaviour is true', () => {
            initComponent();
            component.suppressDefaultCloseBehaviour = true;
            spyOn(component.onClose, 'emit');
            component.close();
            expect(component.onClose.emit).not.toHaveBeenCalled();
            expect(headerBarService.close).not.toHaveBeenCalled();
            expect(nativeApplication.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.PAGECLOSED,
                parameters: { product: 'testweb' },
            });
        });
    });

    describe('hideTopMenu', () => {
        beforeEach(() => {
            accountMenuDataServiceMock.getItem.and.returnValues(
                { name: 'name', text: 'text', parameters: { highlightable: 'true' }, children: [] },
                { name: 'name2', text: 'text2', parameters: { highlightable: 'true' }, children: [] },
            );
            navigationLayoutConfigMock.elements = <any>{ header: { image: '' } };
        });

        it('should hide if account menu version higher than 1 and is mobile', () => {
            accountMenuDataServiceMock.version = 2;
            mediaMock.isActive.and.returnValue(true);
            initComponent();
            accountMenuServiceMock.whenReady.next();
            navigationLayoutConfigMock.whenReady.next();
            navigationLayoutServiceMock.initialized.next(true);
            expect(component.hideTopMenu).toBeTrue();
        });
        it('should hide if visibility set to never', () => {
            initComponent();
            component.topMenuVisibility = TopMenuVisibility.Never;
            expect(component.hideTopMenu).toBeTrue();
        });
        it('should not hide if visibility set to always', () => {
            initComponent();
            component.topMenuVisibility = TopMenuVisibility.Always;
            expect(component.hideTopMenu).toBeFalse();
        });
        it('should hide if visibility set to desktop and user is on mobile', () => {
            initComponent();
            component.topMenuVisibility = TopMenuVisibility.Desktop;
            mediaMock.isActive.and.returnValue(true);
            expect(component.hideTopMenu).toBeTrue();
        });
    });
});
