import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, Type } from '@angular/core';

import { AccountMenuService, DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, first, takeUntil } from 'rxjs/operators';

import { AccountMenuRouter, MenuRoute } from './account-menu-router';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-account-menu',
    templateUrl: 'account-menu.html',
    providers: [AccountMenuRouter],
})
export class AccountMenuComponent implements OnInit, OnChanges, OnDestroy {
    @Input() route: string;
    @Input() mode: string = 'menu';

    get content(): MenuContentItem | null {
        return this.currentRoute && this.currentRoute.item;
    }
    get version() {
        return this.accountMenuService.version;
    }
    isAvailable: boolean = false;

    private unsubscribe = new Subject<void>();
    private currentRoute: MenuRoute | null;

    constructor(
        public accountMenuService: AccountMenuService,
        private accountMenuRouter: AccountMenuRouter,
    ) {}

    ngOnInit() {
        this.accountMenuRouter.currentRoute
            .pipe(
                takeUntil(this.unsubscribe),
                distinctUntilChanged((previous, current) => JSON.stringify(previous?.item) === JSON.stringify(current?.item)),
            )
            .subscribe((r) => (this.currentRoute = r));
        this.accountMenuService.whenReady.subscribe(() => (this.isAvailable = true));
    }

    ngOnChanges() {
        this.accountMenuRouter.routerInitialized.pipe(first((c) => c)).subscribe(() => this.accountMenuRouter.setRoute(this.route || 'menu'));
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    getItemComponent(type: string): Type<any> | null {
        return this.accountMenuService.getAccountMenuComponent(type);
    }
}
