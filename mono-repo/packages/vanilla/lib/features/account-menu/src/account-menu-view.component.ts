import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HtmlNode } from '@frontend/vanilla/core';
import { AccountMenuComponent, DrawerPosition } from '@frontend/vanilla/shared/account-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuDrawerService } from './account-menu-drawer.service';
import { AccountMenuScrollService } from './account-menu-scroll.service';

/**
 * @whatItDoes Displays the account menu and sets routes base on the url path.
 */
@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuComponent],
    selector: 'vn-account-menu-view',
    templateUrl: 'account-menu-view.html',
    host: {
        '(scroll)': 'onScroll($event)',
    },
})
export class AccountMenuViewComponent implements OnInit, OnDestroy {
    @HostBinding('class.drawer-overlay') get drawerClass() {
        return this.accountMenuDrawerService.drawerPosition().position !== DrawerPosition.Bottom;
    }

    route: string;

    private unsubscribe = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private htmlNode: HtmlNode,
        private accountMenuScrollService: AccountMenuScrollService,
        private accountMenuDrawerService: AccountMenuDrawerService,
        private elementRef: ElementRef,
    ) {}

    ngOnInit() {
        this.activatedRoute.url.pipe(takeUntil(this.unsubscribe)).subscribe((url) => {
            let menuRoute = url.join('/');
            if (!menuRoute) {
                menuRoute = 'menu';
            }

            this.route = menuRoute;
            this.htmlNode.blockScrolling(true);
        });

        this.accountMenuScrollService.onScrollTo.subscribe((pos) => {
            this.elementRef.nativeElement.scrollTo({
                top: pos.y,
                left: pos.x,
                behavior: 'smooth',
            });
        });
    }

    onScroll(event: Event) {
        this.accountMenuScrollService.onScroll(event);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.htmlNode.blockScrolling(false);
    }
}
