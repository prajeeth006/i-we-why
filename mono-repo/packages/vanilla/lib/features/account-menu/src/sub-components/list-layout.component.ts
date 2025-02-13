import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { DynamicComponentDirective, MediaQueryService, toBoolean } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { AccountMenuDataService, MenuRoute } from '@frontend/vanilla/shared/account-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuItemBase } from '../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, HeaderBarComponent],
    selector: 'vn-am-list-layout',
    templateUrl: 'list-layout.html',
})
export class ListLayoutComponent extends AccountMenuItemBase implements OnInit, OnDestroy {
    showBack: boolean = false;
    showCloseV4: boolean = false;
    showBackV4: boolean = false;
    private currentRoute: MenuRoute | null;
    private unsubscribe = new Subject();

    constructor(
        private accountMenuDataService: AccountMenuDataService,
        public media: MediaQueryService,
    ) {
        super();

        this.accountMenuRouter.currentRoute.pipe(takeUntil(this.unsubscribe)).subscribe((r) => (this.currentRoute = r));
    }

    ngOnInit() {
        const hideCloseButton = !!toBoolean(this.item.parameters['hide-close']);
        this.showBack = !this.accountMenuDataService.singlePageMode;
        this.showCloseV4 = !this.accountMenuDataService.singlePageMode && this.media.isActive('lt-md') && !hideCloseButton;
        this.showBackV4 = !this.accountMenuDataService.singlePageMode || this.media.isActive('lt-md');
    }

    goBack() {
        const menuRoute = this.currentRoute?.parent?.item.menuRoute;

        if (menuRoute) {
            this.accountMenuRouter.navigateToRoute(menuRoute, true, this.item.menuRouteParent);
        }
    }

    close() {
        this.accountMenuService.toggle(false, {
            closedWithButton: true,
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }
}
