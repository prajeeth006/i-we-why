import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Type } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';
import { ProductMenuService } from '@frontend/vanilla/shared/product-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-product-menu-body',
    templateUrl: 'product-menu-body.html',
})
export class ProductMenuBodyComponent implements OnInit, OnDestroy {
    component: Type<any> | null;
    @Input() useFastIconType: boolean;
    private unsubscribe = new Subject();

    constructor(private productMenuService: ProductMenuService) {}

    ngOnInit() {
        this.productMenuService.currentTab.pipe(takeUntil(this.unsubscribe)).subscribe((menuItem: MenuContentItem | null) => {
            this.component = null;

            if (menuItem?.layout) {
                this.component = this.productMenuService.getProductMenuComponent(menuItem.layout);
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }
}
