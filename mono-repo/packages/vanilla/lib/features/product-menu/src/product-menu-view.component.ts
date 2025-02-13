import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { MenuActionOrigin, MenuActionsService, Page } from '@frontend/vanilla/core';
import { ProductMenuConfig, ProductMenuService } from '@frontend/vanilla/shared/product-menu';
import { combineLatest, filter } from 'rxjs';

import { ProductMenuComponent } from './product-menu.component';

@Component({
    standalone: true,
    imports: [ProductMenuComponent],
    selector: 'vn-product-menu-view',
    templateUrl: 'product-menu-view.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/product-menu/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProductMenuViewComponent implements OnInit {
    constructor(
        private productMenuService: ProductMenuService,
        private productMenuConfig: ProductMenuConfig,
        private menuActionService: MenuActionsService,
        private page: Page,
    ) {}

    ngOnInit() {
        combineLatest([this.productMenuConfig.whenReady, this.productMenuService.initialized.pipe(filter((e: boolean) => e))]).subscribe(() => {
            if (this.productMenuConfig.routerMode) {
                this.productMenuService.openTab(this.page.product);
            } else {
                this.menuActionService.invoke('gotoHome', MenuActionOrigin.BottomNav);
            }
        });
    }
}
