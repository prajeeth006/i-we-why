import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { ProductMenuService } from '@frontend/vanilla/shared/product-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    standalone: true,
    imports: [CommonModule, DslPipe, DynamicComponentDirective],
    selector: 'vn-pm-sitecore-body',
    templateUrl: 'sitecore-body.html',
})
export class SitecoreBodyComponent implements OnInit, OnDestroy {
    content: MenuContentItem[] | null;
    readonly trackByText = trackByProp<MenuContentItem>('text');

    private unsubscribe = new Subject();

    constructor(private productMenuService: ProductMenuService) {}

    ngOnInit() {
        this.productMenuService.currentTab.pipe(takeUntil(this.unsubscribe)).subscribe((tab) => {
            this.content = null;

            if (tab) {
                this.content = tab.children || null;
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }

    getItemComponent(type: string): Type<any> | null {
        return this.productMenuService.getProductMenuComponent(type);
    }
}
