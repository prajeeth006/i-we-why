import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DslService, DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { toNumber } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuTrackingService } from '../../account-menu-tracking.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-am-widgets',
    templateUrl: 'widgets.html',
})
export class AccountMenuWidgetsComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    items: MenuContentItem[] = [];
    showWidgets: boolean;

    private unsubscribe: Subject<void> = new Subject();

    constructor(
        private dslService: DslService,
        private accountMenuDataService: AccountMenuDataService,
        private accountMenuTrackingService: AccountMenuTrackingService,
    ) {
        super();
    }

    ngOnInit(): void {
        this.showWidgets = this.accountMenuDataService.routerMode || this.mode === 'page';
        this.dslService
            .evaluateContent(this.item.children)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((items) => {
                this.items = items;
                this.refresh();
                this.accountMenuTrackingService.trackWidgetsLoad(this.items);
            });
        this.accountMenuDataService.widgetUpdate.subscribe(() => {
            this.refresh();
        });
    }

    private refresh() {
        this.items = this.items.sort((a, b) => (toNumber(a.parameters['order'] ?? 10000) > toNumber(b.parameters['order'] ?? 10000) ? 1 : -1));
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
