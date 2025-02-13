import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem, Page, UtilsService } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { ProductMenuConfig, ProductMenuService } from '@frontend/vanilla/shared/product-menu';
import { Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductMenuAppsComponent } from './product-menu-apps.component';
import { ProductMenuBodyComponent } from './product-menu-body.component';
import { ProductMenuTabsComponent } from './product-menu-tabs.component';
import { ProductMenuTrackingService } from './product-menu-tracking.service';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        DynamicComponentDirective,
        ProductMenuBodyComponent,
        ProductMenuAppsComponent,
        ProductMenuTabsComponent,
        HeaderBarComponent,
    ],
    selector: 'vn-product-menu',
    templateUrl: 'product-menu.html',
})
export class ProductMenuComponent implements OnInit, OnDestroy {
    menu: MenuContentItem;
    title: string;
    closeButtonText: string | undefined;
    isAvailable: boolean;
    useFastIcon: boolean = false;
    content = inject(ProductMenuConfig);
    productMenuService = inject(ProductMenuService);

    private pageConfig = inject(Page);
    private productMenuTrackingService = inject(ProductMenuTrackingService);
    private unsubscribe = new Subject();

    async ngOnInit() {
        await firstValueFrom(this.content.whenReady);

        this.isAvailable = true;
        this.title = this.content?.header?.resources[this.pageConfig.product] || this.content.tabs?.text;
        this.closeButtonText = this.content.showCloseButtonAsText ? this.content?.header?.resources['close-button-text'] : undefined;
        this.useFastIcon = this.pageConfig.htmlSourceTypeReplace
            ? UtilsService.indexableTypeContainsKey(this.pageConfig.htmlSourceTypeReplace, 'bottom-nav')
            : false;
        this.productMenuService.content.pipe(takeUntil(this.unsubscribe)).subscribe((contentItem: MenuContentItem) => {
            this.menu = contentItem;
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }

    close() {
        this.productMenuService.toggle(false);
        this.productMenuTrackingService.trackProductMenuClose();
    }
}
