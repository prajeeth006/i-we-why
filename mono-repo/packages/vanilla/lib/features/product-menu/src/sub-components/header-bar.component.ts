import { Component, OnDestroy, OnInit } from '@angular/core';

import { MenuContentItem } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { ProductMenuConfig } from '@frontend/vanilla/shared/product-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductMenuService } from '../product-menu.service';
import { ProductMenuItemBase } from './product-menu-item-base';

@Component({
    standalone: true,
    imports: [HeaderBarComponent],
    selector: 'vn-pm-header-bar',
    templateUrl: 'header-bar.html',
})
export class ProductMenuHeaderBarComponent extends ProductMenuItemBase implements OnInit, OnDestroy {
    title: string;

    private unsubscribe = new Subject();

    constructor(
        public config: ProductMenuConfig,
        public localProductMenuService: ProductMenuService,
    ) {
        super();
    }

    ngOnInit() {
        this.productMenuService.currentTab.pipe(takeUntil(this.unsubscribe)).subscribe((menuItem: MenuContentItem | null) => {
            this.title = menuItem?.text || this.item.text;
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }
}
