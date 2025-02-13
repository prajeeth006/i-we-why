import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MockDslPipe } from '../../../core/test/browser/dsl.pipe.mock';
import { ProductMenuTabsComponent } from '../src/product-menu-tabs.component';
import { ProductMenuConfigMock, ProductMenuServiceMock } from './product-menu.mock';

describe('ProductMenuTabsComponent', () => {
    let fixture: ComponentFixture<ProductMenuTabsComponent>;
    let productMenuServiceMock: ProductMenuServiceMock;
    let item: MenuContentItem;

    beforeEach(() => {
        productMenuServiceMock = MockContext.useMock(ProductMenuServiceMock);
        MockContext.useMock(ProductMenuConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            declarations: [MockDslPipe],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(ProductMenuTabsComponent);
        item = { name: 'item' } as MenuContentItem;

        fixture.detectChanges();
    });

    describe('onClick', () => {
        it('should open tab if item has a layout', () => {
            item.layout = 'body';

            fixture.componentInstance.onClick(item);

            expect(productMenuServiceMock.openTab).toHaveBeenCalledWith('item');
        });

        it('should close the product menu if item has doesnt have a layout', () => {
            fixture.componentInstance.onClick(item);

            expect(productMenuServiceMock.toggle).toHaveBeenCalledWith(false);
        });
    });
});
