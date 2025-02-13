import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MediaQueryService, NavigationService } from '@frontend/vanilla/core';
import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { Subscription, filter } from 'rxjs';

import { NavigationItem } from './models';
import { NavigationLayoutLeftMenuComponent } from './navigation-layout-left-menu.component';
import { NavigationLayoutPageComponent } from './navigation-layout-page.component';
import { NavigationLayoutService } from './navigation-layout.service';

@Component({
    standalone: true,
    imports: [CommonModule, NavigationLayoutLeftMenuComponent, LhHeaderBarComponent, NavigationLayoutPageComponent],
    selector: 'lh-navigation-layout-menu-page',
    templateUrl: 'navigation-layout-menu-page.component.html',
})
export class NavigationLayoutMenuPageComponent implements OnInit, OnDestroy {
    item: NavigationItem | null;
    showHeader: boolean;
    isDesktop: boolean;
    private watcher: Subscription;

    constructor(
        private media: MediaQueryService,
        private navigationService: NavigationService,
        public navigationLayoutService: NavigationLayoutService,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.navigationLayoutService.initialized.pipe(filter((isInitialized: boolean) => isInitialized)).subscribe(() => {
            const itemName = this.activatedRoute.snapshot.params['itemName'];
            this.item = this.navigationLayoutService.getItem(itemName);

            this.redirectToFirstMenuItem();
            this.watcher = this.media.observe().subscribe(() => {
                this.showHeader = this.media.isActive('xs');
                this.redirectToFirstMenuItem();
            });
        });
    }

    ngOnDestroy() {
        if (this.watcher) {
            this.watcher.unsubscribe();
        }
    }

    private redirectToFirstMenuItem() {
        this.isDesktop = this.media.isActive('gt-xs');

        if (this.isDesktop && this.item) {
            this.navigationService.goTo(this.item.leftMenuItems[0]!.url);
        }
    }
}
