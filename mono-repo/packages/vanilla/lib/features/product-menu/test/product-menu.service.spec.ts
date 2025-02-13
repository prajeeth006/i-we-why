import { TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { ProductMenuService } from '@frontend/vanilla/shared/product-menu';
import { MockContext } from 'moxxi';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { SessionStoreServiceMock } from '../../../core/src/browser/store/test/session-store.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { ProductMenuConfigMock } from './product-menu.mock';

class SampleComponent {}

describe('ProductMenuService init', () => {
    let service: ProductMenuService;
    let productAccountMenuConfigMock: ProductMenuConfigMock;
    let dslServiceMock: DslServiceMock;

    beforeEach(() => {
        productAccountMenuConfigMock = MockContext.useMock(ProductMenuConfigMock);
        MockContext.useMock(SessionStoreServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        TestBed.configureTestingModule({
            providers: [...MockContext.providers, ProductMenuService],
        });
    });

    function initService() {
        service = TestBed.inject(ProductMenuService);
        service.init();
    }

    it('should emit tabs', () => {
        let serviceTabs: any;
        initService();
        dslServiceMock.evaluateContent.next(productAccountMenuConfigMock.tabs.children);
        service.childTabs$.pipe(take(1)).subscribe((_tabs) => {
            serviceTabs = _tabs;
        });

        expect(dslServiceMock.evaluateContent).toHaveBeenCalled();
        expect(serviceTabs).toEqual(productAccountMenuConfigMock.tabs.children);
    });

    it('should emit apps', () => {
        let serviceApps: any;
        productAccountMenuConfigMock.tabs = {} as MenuContentItem;
        initService();

        dslServiceMock.evaluateContent.next(productAccountMenuConfigMock.apps);
        service.apps$.pipe(take(1)).subscribe((_apps) => {
            serviceApps = _apps;
        });

        expect(dslServiceMock.evaluateContent).toHaveBeenCalledWith(productAccountMenuConfigMock.apps);
        expect(serviceApps).toEqual(productAccountMenuConfigMock.apps);
    });
});

describe('ProductMenuService', () => {
    let service: ProductMenuService;
    let overlayMock: OverlayFactoryMock;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let overlayRef: OverlayRefMock;
    let productAccountMenuConfigMock: ProductMenuConfigMock;
    let dslServiceMock: DslServiceMock;
    let tabSpy: jasmine.Spy;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        productAccountMenuConfigMock = MockContext.useMock(ProductMenuConfigMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        MockContext.useMock(SessionStoreServiceMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, ProductMenuService],
        });

        tabSpy = jasmine.createSpy();

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('v1', () => {
        beforeEach(() => {
            service = TestBed.inject(ProductMenuService);
            service.init();
            service.currentTab.subscribe(tabSpy);
        });

        describe('routerMode', () => {
            it('should return if router mode is enabled', () => {
                productAccountMenuConfigMock.routerMode = true;

                expect(service.routerMode).toBeTrue();
            });
        });

        describe('setTabItemCounter', () => {
            it('should forward to menu items service', () => {
                service.setTabItemCounter('item', 5, 'class');

                expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('ProductMenu_Top', 'item', 5, 'class');
            });
        });

        describe('setItemCounter', () => {
            it('should forward to menu items service', () => {
                service.setItemCounter('item', 5, 'class');

                expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('ProductMenu', 'item', 5, 'class');
            });
        });

        describe('setItemDescription', () => {
            it('should set item description', () => {
                service.setItemDescription('item', 'description', 'class');

                expect(menuItemsServiceMock.setDescription).toHaveBeenCalledWith('ProductMenu', 'item', 'description');
                expect(menuItemsServiceMock.setDescriptionCssClass).toHaveBeenCalledWith('ProductMenu', 'item', 'class');
            });
        });

        describe('openTab', () => {
            it('should notify subscribers about the tab if it exists', () => {
                service.openTab('sports');

                expect(tabSpy).toHaveBeenCalledWith(productAccountMenuConfigMock.tabs.children[0]);
                expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith('ProductMenu_Top', 'sports');
            });

            it('should notify subscribers if with null', () => {
                service.openTab(null);

                expect(tabSpy).toHaveBeenCalledWith(null);
            });
        });

        describe('templates', () => {
            it('should allow to set product menu templates', () => {
                service.setProductMenuComponent('type', SampleComponent);

                expect(service.getProductMenuComponent('type')).toBe(SampleComponent);
            });

            it('should allow to set default product menu template', () => {
                service.setProductMenuComponent('default', SampleComponent);

                expect(service.getProductMenuComponent(undefined)).toBe(SampleComponent);
            });
        });
    });

    describe('v2', () => {
        let menu: MenuContentItem;
        const contentEvents = new ReplaySubject<MenuContentItem>(1);

        beforeEach(() => {
            productAccountMenuConfigMock.v2 = true;
            productAccountMenuConfigMock.tabs = <any>{};
            productAccountMenuConfigMock.apps = <any>{};
            menu = {
                name: 'menu',
                children: [
                    {
                        name: 'tabs',
                        children: [
                            { name: 'sports', url: 'http://sports', text: 'Sportsbook', children: [] },
                            { name: 'testweb', url: 'http://testweb', text: 'Vanilla Testweb' },
                        ] as any,
                    } as MenuContentItem,
                    {
                        name: 'body',
                        children: [{ name: 'headerbar' }, { name: 'productcontent' }] as any,
                    } as MenuContentItem,
                ],
            } as MenuContentItem;

            productAccountMenuConfigMock.menu = <any>{ menu: 'undsled' };
            dslServiceMock.evaluateContent.withArgs(productAccountMenuConfigMock.menu).and.returnValue(contentEvents);
            contentEvents.next(menu);

            service = TestBed.inject(ProductMenuService);
            service.init();
            service.currentTab.subscribe(tabSpy);
        });

        describe('init', () => {
            it('should return config value', () => {
                expect(service.v2).toBeTrue();
            });
        });

        describe('openTab()', () => {
            it('should notify subscribers about the tab if it exists', () => {
                service.openTab('sports');

                expect(tabSpy).toHaveBeenCalledWith(menu.children[0]!.children[0]);
                expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith('ProductMenu', 'sports');
            });
        });

        describe('setTabItemCounter', () => {
            it('should forward to menu items service', () => {
                service.setTabItemCounter('item', 5, 'class');

                expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('ProductMenu', 'item', 5, 'class');
            });
        });

        describe('isTab()', () => {
            it('should return true if an item is a tab, false otherwise', () => {
                expect(service.isTab(menu.children[0]!.children[0]!)).toBeTrue();
                expect(service.isTab(menu.children[0]!.children[1]!)).toBeTrue();
                expect(service.isTab(menu.children[1]!.children[0]!)).toBeFalse();
                expect(service.isTab(menu.children[1]!.children[1]!)).toBeFalse();
            });
        });

        describe('content', () => {
            it('should notify subscribers when content changes', () => {
                const spy = jasmine.createSpy();
                service.content.subscribe(spy);

                const newContent = <any>{ new: 1, children: [] };
                contentEvents.next(newContent);

                expect(spy).toHaveBeenCalledWith(newContent);
            });
        });

        describe('tabCount', () => {
            it('should return number of tabs', () => {
                service.init();
                expect(service.tabCount).toBe(2);
            });
        });
    });
});
