import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductMenuItemBase } from './product-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-pm-tab-content',
    templateUrl: 'tab-content.html',
})
export class TabContentComponent extends ProductMenuItemBase implements OnInit, OnDestroy {
    content: MenuContentItem | null;

    private unsubscribe = new Subject();

    constructor() {
        super();
    }

    ngOnInit() {
        const section = this.item.parameters['section'];

        this.productMenuService.currentTab.pipe(takeUntil(this.unsubscribe)).subscribe((t) => {
            if (t) {
                this.content = t.children.find((c) => c.name === section) || null;
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }
}
