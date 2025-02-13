import { Injectable } from '@angular/core';

import { MenuAction, MenuActionsService, MenuSection, OnFeatureInit, Page } from '@frontend/vanilla/core';
import { AnimateOverlayFrom } from '@frontend/vanilla/shared/overlay-factory';
import { ProductMenuConfig, ProductMenuService } from '@frontend/vanilla/shared/product-menu';

import { ProductMenuService as LocalProductMenuService } from './product-menu.service';
import { ProductMenuHeaderBarComponent } from './sub-components/header-bar.component';
import { ItemsComponent } from './sub-components/items.component';
import { ListSectionComponent } from './sub-components/list-section.component';
import { MenuItemComponent } from './sub-components/menu-item.component';
import { SitecoreBodyComponent } from './sub-components/sitecore-body.component';
import { TabContentComponent } from './sub-components/tab-content.component';
import { TabsComponent } from './sub-components/tabs.component';

@Injectable()
export class ProductMenuBootstrapService implements OnFeatureInit {
    constructor(
        private config: ProductMenuConfig,
        private productMenuService: ProductMenuService,
        private localProductMenuService: LocalProductMenuService,
        private menuActionsService: MenuActionsService,
        private page: Page,
    ) {}

    onFeatureInit() {
        this.config.whenReady.subscribe(() => {
            this.productMenuService.init();
            this.menuActionsService.register(MenuAction.TOGGLE_PRODUCT_MENU, (origin: string, _url, _target, parameters) => {
                let animateFrom = parameters?.['animate-from'];

                if (origin === MenuSection.Header) {
                    animateFrom = AnimateOverlayFrom.Left;
                } else if (origin === MenuSection.BottomNav) {
                    animateFrom = AnimateOverlayFrom.Bottom;
                }

                this.localProductMenuService.toggle({ options: { initialTab: this.page.product, animateFrom } });
            });

            this.productMenuService.setProductMenuComponent('default', MenuItemComponent);

            if (this.productMenuService.v2) {
                this.productMenuService.setProductMenuComponent('list', ListSectionComponent);
                this.productMenuService.setProductMenuComponent('items', ItemsComponent);
                this.productMenuService.setProductMenuComponent('tab-content', TabContentComponent);
                this.productMenuService.setProductMenuComponent('header', ProductMenuHeaderBarComponent);
                this.productMenuService.setProductMenuComponent('tabs', TabsComponent);
            } else {
                this.productMenuService.setProductMenuComponent('icon', MenuItemComponent);
                this.productMenuService.setProductMenuComponent('list-section', ListSectionComponent);
                this.productMenuService.setProductMenuComponent('sitecore-body', SitecoreBodyComponent);
            }
        });
    }
}
