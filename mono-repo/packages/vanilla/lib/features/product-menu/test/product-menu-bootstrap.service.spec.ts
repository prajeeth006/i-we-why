import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { ProductMenuBootstrapService } from '../src/product-menu-bootstrap.service';
import { ProductMenuHeaderBarComponent } from '../src/sub-components/header-bar.component';
import { ItemsComponent } from '../src/sub-components/items.component';
import { ListSectionComponent } from '../src/sub-components/list-section.component';
import { MenuItemComponent } from '../src/sub-components/menu-item.component';
import { SitecoreBodyComponent } from '../src/sub-components/sitecore-body.component';
import { TabContentComponent } from '../src/sub-components/tab-content.component';
import { TabsComponent } from '../src/sub-components/tabs.component';
import { LocalProductMenuServiceMock, ProductMenuConfigMock, ProductMenuServiceMock } from './product-menu.mock';

describe('ProductMenuBootstrapService', () => {
    let service: ProductMenuBootstrapService;
    let productMenuServiceMock: ProductMenuServiceMock;
    let productMenuConfigMock: ProductMenuConfigMock;
    let menuActionsServiceMock: MenuActionsServiceMock;

    beforeEach(() => {
        productMenuServiceMock = MockContext.useMock(ProductMenuServiceMock);
        productMenuConfigMock = MockContext.useMock(ProductMenuConfigMock);
        MockContext.useMock(LocalProductMenuServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProductMenuBootstrapService],
        });

        service = TestBed.inject(ProductMenuBootstrapService);
    });

    describe('run()', () => {
        it('should setup product menu templates', () => {
            service.onFeatureInit();
            productMenuConfigMock.whenReady.next();

            expect(menuActionsServiceMock.register).toHaveBeenCalled();
            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('default', MenuItemComponent);
            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('icon', MenuItemComponent);
            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('list-section', ListSectionComponent);
            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('sitecore-body', SitecoreBodyComponent);
        });

        it('should setup product menu templates for v2', () => {
            productMenuServiceMock.v2 = true;

            service.onFeatureInit();
            productMenuConfigMock.whenReady.next();

            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('list', ListSectionComponent);
            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('items', ItemsComponent);
            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('tab-content', TabContentComponent);
            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('header', ProductMenuHeaderBarComponent);
            expect(productMenuServiceMock.setProductMenuComponent).toHaveBeenCalledWith('tabs', TabsComponent);
        });
    });
});
