import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ProductMenuHeaderBarComponent } from '../src/sub-components/header-bar.component';
import { ListSectionComponent } from '../src/sub-components/list-section.component';
import { MenuItemComponent } from '../src/sub-components/menu-item.component';
import { TabContentComponent } from '../src/sub-components/tab-content.component';
import { LocalProductMenuServiceMock, ProductMenuConfigMock, ProductMenuServiceMock } from './product-menu.mock';

class Cmp {}

describe('ProductMenuItemComponent', () => {
    let fixture: ComponentFixture<ListSectionComponent | MenuItemComponent | ProductMenuHeaderBarComponent | TabContentComponent>;
    let productMenuServiceMock: ProductMenuServiceMock;
    let localProductMenuServiceMock: LocalProductMenuServiceMock;
    let item: MenuContentItem;
    let tab: MenuContentItem;

    beforeEach(() => {
        productMenuServiceMock = MockContext.useMock(ProductMenuServiceMock);
        localProductMenuServiceMock = MockContext.useMock(LocalProductMenuServiceMock);
        MockContext.useMock(ProductMenuConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            imports: [CommonModule, DynamicComponentDirective],
            schemas: [NO_ERRORS_SCHEMA],
        });

        item = <any>{
            url: 'url',
            clickAction: 'action',
            type: 'type',
            name: 'name',
            parameters: {},
        };

        tab = <any>{
            name: 'tab',
            text: 'title',
            children: [{ name: 'body' }],
        };

        productMenuServiceMock.getProductMenuComponent.withArgs('body').and.returnValue(Cmp);
        productMenuServiceMock.currentTab.next(tab);
    });

    function initComponent<T extends ListSectionComponent | MenuItemComponent | ProductMenuHeaderBarComponent | TabContentComponent>(type: Type<T>) {
        TestBed.overrideComponent(type, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });
        fixture = TestBed.createComponent(type);

        fixture.componentInstance.item = item;
        if ((fixture.componentInstance as any)['ngOnInit']) {
            (fixture.componentInstance as any)['ngOnInit']();
        }
    }

    describe('common', () => {
        describe('getItemComponent', () => {
            it('should forward to service', () => {
                initComponent(ListSectionComponent);

                expect(fixture.componentInstance.getItemComponent('body')).toBe(Cmp);
            });
        });

        describe('v2', () => {
            it('should return true if v2 is used', () => {
                productMenuServiceMock.v2 = true;
                initComponent(ListSectionComponent);

                expect(fixture.componentInstance.v2).toBeTrue();
            });
        });
    });

    describe('MenuItemComponent', () => {
        describe('click()', () => {
            it('should open close menu', () => {
                initComponent(MenuItemComponent);

                const component = fixture.componentInstance as MenuItemComponent;
                component.click();

                expect(localProductMenuServiceMock.toggle).toHaveBeenCalledWith();
            });

            it('should open tab if item is a tab with children', () => {
                initComponent(MenuItemComponent);

                item.children = [<any>{}];

                productMenuServiceMock.isTab.withArgs(item).and.returnValue(true);

                const component = fixture.componentInstance as MenuItemComponent;
                component.click();

                expect(localProductMenuServiceMock.toggle).not.toHaveBeenCalled();
                expect(productMenuServiceMock.openTab).toHaveBeenCalledWith('name');
            });

            it('should close the menu if item is tab without children', () => {
                initComponent(MenuItemComponent);

                productMenuServiceMock.isTab.withArgs(item).and.returnValue(true);

                const component = fixture.componentInstance as MenuItemComponent;
                component.click();

                expect(localProductMenuServiceMock.toggle).toHaveBeenCalled();
                expect(productMenuServiceMock.openTab).not.toHaveBeenCalled();
            });
        });
    });

    describe('ProductMenuHeaderBarComponent', () => {
        describe('init', () => {
            it('should take title from current tab', () => {
                initComponent(ProductMenuHeaderBarComponent);

                const component = fixture.componentInstance as ProductMenuHeaderBarComponent;

                expect(component.title).toBe('title');
            });

            it('should take title from the item if tab has no text', () => {
                tab.text = '';
                item.text = 'item title';
                initComponent(ProductMenuHeaderBarComponent);

                const component = fixture.componentInstance as ProductMenuHeaderBarComponent;

                expect(component.title).toBe('item title');
            });

            it('should take title from the item if there is no tab', () => {
                productMenuServiceMock.currentTab.next(null);
                item.text = 'item title';
                initComponent(ProductMenuHeaderBarComponent);

                const component = fixture.componentInstance as ProductMenuHeaderBarComponent;

                expect(component.title).toBe('item title');
            });
        });
    });

    describe('TabContentComponent', () => {
        describe('init', () => {
            it('should take content from current tab', () => {
                item.parameters['section'] = 'body';
                initComponent(TabContentComponent);

                const component = fixture.componentInstance as TabContentComponent;

                expect(component.content).toBe(tab.children[0]!);
            });
        });
    });
});
