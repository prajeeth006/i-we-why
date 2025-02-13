import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MockDslPipe } from '../../../core/test/browser/dsl.pipe.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { ProductMenuViewComponent } from '../src/product-menu-view.component';
import { ProductMenuConfigMock, ProductMenuServiceMock } from './product-menu.mock';

describe('ProductMenuViewComponent', () => {
    let fixture: ComponentFixture<ProductMenuViewComponent>;
    let productAccountMenuConfigMock: ProductMenuConfigMock;
    let productMenuServiceMock: ProductMenuServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let pageMock: PageMock;

    beforeEach(() => {
        productAccountMenuConfigMock = MockContext.useMock(ProductMenuConfigMock);
        productMenuServiceMock = MockContext.useMock(ProductMenuServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        pageMock = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            declarations: [MockDslPipe],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(ProductMenuViewComponent);
    });

    describe('init', () => {
        it('should invoke menu action if not enabled', fakeAsync(() => {
            productAccountMenuConfigMock.routerMode = false;
            fixture.componentInstance.ngOnInit();
            productAccountMenuConfigMock.whenReady.next();
            productMenuServiceMock.initialized.next(true);
            tick();
            expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('gotoHome', 'BottomNav');
        }));

        it('should open tab for current product', fakeAsync(() => {
            productAccountMenuConfigMock.routerMode = true;
            pageMock.product = 'sports';
            fixture.componentInstance.ngOnInit();
            productAccountMenuConfigMock.whenReady.next();
            productMenuServiceMock.initialized.next(true);
            tick();
            expect(productMenuServiceMock.openTab).toHaveBeenCalledWith('sports');
        }));
    });
});
