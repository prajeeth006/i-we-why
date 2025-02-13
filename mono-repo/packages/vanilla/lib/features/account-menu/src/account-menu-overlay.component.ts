import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { NavigationService } from '@frontend/vanilla/core';
import { AccountMenuComponent } from '@frontend/vanilla/shared/account-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountMenuScrollService } from './account-menu-scroll.service';
import { INITIAL_ROUTE } from './account-menu-tokens';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, AccountMenuComponent],
    selector: 'vn-account-menu-overlay',
    templateUrl: 'account-menu-view.html',
    host: {
        '(scroll)': 'onScroll($event)',
        'class': 'th-scroll',
    },
})
export class AccountMenuOverlayComponent implements OnInit, OnDestroy {
    route: string;

    private unsubscribe = new Subject<void>();

    constructor(
        private overlayRef: OverlayRef,
        private navigationService: NavigationService,
        private accountMenuScrollService: AccountMenuScrollService,
        @Inject(INITIAL_ROUTE) initialRoute: string,
    ) {
        this.route = initialRoute;
    }

    ngOnInit() {
        this.navigationService.locationChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.overlayRef.detach();
        });
    }

    onScroll(event: Event) {
        this.accountMenuScrollService.onScroll(event);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
