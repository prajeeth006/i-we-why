import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HtmlNode } from '@frontend/vanilla/core';
import { CashierIframeComponent } from '@frontend/vanilla/shared/cashier';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NavigationLayoutPageComponent } from './navigation-layout-page.component';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [NavigationLayoutPageComponent, CashierIframeComponent],
    selector: 'lh-navigation-layout-cashier',
    templateUrl: 'navigation-layout-cashier.html',
})
export class NavigationLayoutCashierComponent implements OnInit, OnDestroy {
    page: string;
    showLoadingIndicator: boolean = true;
    private unsubscribe = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private htmlNode: HtmlNode,
    ) {}

    ngOnInit() {
        this.htmlNode.setCssClass('has-cashier-iframe', true);
        this.page = this.activatedRoute.snapshot.params['page'] || '';
        this.activatedRoute.params.pipe(takeUntil(this.unsubscribe)).subscribe((params) => {
            this.page = params['page'] || '';
        });
    }

    ngOnDestroy() {
        this.htmlNode.setCssClass('has-cashier-iframe', false);
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    hideLoadingIndicator() {
        this.showLoadingIndicator = false;
    }
}
