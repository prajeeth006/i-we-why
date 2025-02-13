import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ProductMenuBodyComponent } from '../src/product-menu-body.component';
import { ProductMenuServiceMock } from './product-menu.mock';

class Cmp {}

describe('ProductMenuBodyComponent', () => {
    let fixture: ComponentFixture<ProductMenuBodyComponent>;
    let productMenuServiceMock: ProductMenuServiceMock;
    let item: MenuContentItem;

    beforeEach(() => {
        productMenuServiceMock = MockContext.useMock(ProductMenuServiceMock);

        TestBed.configureTestingModule({
            imports: [DynamicComponentDirective],
            providers: [MockContext.providers],
            declarations: [],
            schemas: [NO_ERRORS_SCHEMA],
        });

        item = { name: 'item', layout: 'body' } as MenuContentItem;
        productMenuServiceMock.getProductMenuComponent.withArgs('body').and.returnValue(Cmp);
        fixture = TestBed.createComponent(ProductMenuBodyComponent);

        fixture.detectChanges();
    });

    describe('component', () => {
        it('should be null initially', () => {
            expect(fixture.componentInstance.component).toBeNull();
        });

        it('should be resolved based on selected tab', () => {
            productMenuServiceMock.currentTab.next(item);

            expect(fixture.componentInstance.component).toBe(Cmp);
        });
    });
});
