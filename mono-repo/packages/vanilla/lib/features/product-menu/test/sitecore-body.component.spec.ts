import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MockDslPipe } from '../../../core/test/browser/dsl.pipe.mock';
import { SitecoreBodyComponent } from '../src/sub-components/sitecore-body.component';
import { ProductMenuServiceMock } from './product-menu.mock';

class Cmp {}

describe('SitecoreBodyComponent', () => {
    let fixture: ComponentFixture<SitecoreBodyComponent>;
    let productMenuServiceMock: ProductMenuServiceMock;
    let item: MenuContentItem;

    beforeEach(() => {
        productMenuServiceMock = MockContext.useMock(ProductMenuServiceMock);

        TestBed.configureTestingModule({
            imports: [DynamicComponentDirective],
            providers: [MockContext.providers],
            declarations: [MockDslPipe],
            schemas: [NO_ERRORS_SCHEMA],
        });

        item = { name: 'item', children: [{ name: 'child' }] } as MenuContentItem;
        productMenuServiceMock.getProductMenuComponent.withArgs('body').and.returnValue(Cmp);
        fixture = TestBed.createComponent(SitecoreBodyComponent);

        fixture.detectChanges();
    });

    describe('content', () => {
        it('should be null initially', () => {
            expect(fixture.componentInstance.content).toBeNull();
        });

        it('should be set based on selected tab', () => {
            productMenuServiceMock.currentTab.next(item);

            expect(fixture.componentInstance.content).toBe(item.children);
        });
    });

    describe('getItemComponent', () => {
        it('should forward to service', () => {
            expect(fixture.componentInstance.getItemComponent('body')).toBe(Cmp);
        });
    });
});
