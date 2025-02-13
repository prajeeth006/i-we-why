import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { DslService, HtmlNode, MenuContentItem, MenuDisplayMode, MenuSection, Page, UtilsService, trackByProp } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BottomNavConfig } from './bottom-nav.client-config';
import { BottomNavService } from './bottom-nav.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DslPipe, MenuItemComponent],
    selector: 'vn-bottom-nav',
    templateUrl: 'bottom-nav.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/bottom-nav/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BottomNavComponent implements OnInit, OnDestroy {
    MenuSection = MenuSection;
    visible: boolean;
    readonly trackByText = trackByProp<MenuContentItem>('text');
    useFastIcon: boolean = false;
    private unsubscribe = new Subject<void>();

    constructor(
        private bottomNavService: BottomNavService,
        public content: BottomNavConfig,
        private htmlNode: HtmlNode,
        private dslService: DslService,
        public page: Page,
    ) {}

    ngOnInit() {
        combineLatest([this.dslService.evaluateExpression<boolean>(this.content.isEnabledCondition), this.bottomNavService.inputEvents])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((e: any[]) => {
                const enabled = e[0];
                const show = e[1].state === 'show';
                this.useFastIcon = UtilsService.indexableTypeContainsKey(this.page.htmlSourceTypeReplace, 'bottom-nav');
                this.visible = enabled && show;
                this.htmlNode.setCssClass('bottom-nav-shown', this.visible);
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.htmlNode.setCssClass('bottom-nav-shown', false);
    }

    getDisplayMode(displayMode?: string): MenuDisplayMode {
        return displayMode ? (displayMode as MenuDisplayMode) : MenuDisplayMode.Icon;
    }
}
