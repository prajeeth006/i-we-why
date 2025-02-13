import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MockDslPipe } from '../../../core/test/browser/dsl.pipe.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { ProductMenuComponent } from '../src/product-menu.component';
import { ProductMenuConfigMock, ProductMenuServiceMock, ProductMenuTrackingServiceMock } from './product-menu.mock';

class Cmp {}

describe('ProductMenuComponent', () => {
    let fixture: ComponentFixture<ProductMenuComponent>;
    let productAccountMenuConfigMock: ProductMenuConfigMock;
    let productMenuServiceMock: ProductMenuServiceMock;
    let productMenuTrackingServiceMock: ProductMenuTrackingServiceMock;
    let pageConfig: PageMock;

    beforeEach(() => {
        productAccountMenuConfigMock = MockContext.useMock(ProductMenuConfigMock);
        productMenuServiceMock = MockContext.useMock(ProductMenuServiceMock);
        productMenuTrackingServiceMock = MockContext.useMock(ProductMenuTrackingServiceMock);
        pageConfig = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            declarations: [MockDslPipe],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(ProductMenuComponent);

        productMenuServiceMock.getProductMenuComponent.withArgs('body').and.returnValue(Cmp);
        pageConfig.product = 'testweb';

        fixture.detectChanges();
    });

    describe('init', () => {
        it('should have content', fakeAsync(() => {
            const menu = <any>{ a: 1 };
            productMenuServiceMock.content.next(menu);
            productMenuServiceMock.tabCount = 2;
            productAccountMenuConfigMock.whenReady.next();
            tick();

            expect(fixture.componentInstance.content).toBe(productAccountMenuConfigMock);
            expect(fixture.componentInstance.menu).toBe(menu);
        }));

        it('should set title from tabs', fakeAsync(() => {
            productAccountMenuConfigMock.tabs = {
                text: 'test web',
            } as MenuContentItem;
            fixture.componentInstance.ngOnInit();
            productAccountMenuConfigMock.whenReady.next();
            tick();

            expect(fixture.componentInstance.title).toBe('test web');
        }));

        it('should set title from header', fakeAsync(() => {
            productAccountMenuConfigMock.header = {
                resources: <unknown>{
                    testweb: 'test webb',
                    sports: 'sports',
                },
            } as MenuContentItem;
            fixture.componentInstance.ngOnInit();
            productAccountMenuConfigMock.whenReady.next();
            tick();

            expect(fixture.componentInstance.title).toBe('test webb');
        }));
    });

    describe('close()', () => {
        it('should call close', () => {
            productAccountMenuConfigMock.routerMode = true;
            fixture.componentInstance.close();

            expect(productMenuServiceMock.toggle).toHaveBeenCalledWith(false);
            expect(productMenuTrackingServiceMock.trackProductMenuClose).toHaveBeenCalled();
        });
    });
});
