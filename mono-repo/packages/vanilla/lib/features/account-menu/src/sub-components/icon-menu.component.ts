import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';

import {
    DynamicComponentDirective,
    ElementRepositoryService,
    SwipeDirection,
    SwipeDirective,
    TimerService,
    VanillaElements,
    WINDOW,
} from '@frontend/vanilla/core';
import {
    AccountMenuDataService,
    AccountMenuTasksService,
    BOTTOM_DRAWER_HEIGHT,
    DrawerPosition,
    MenuRoute,
} from '@frontend/vanilla/shared/account-menu';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { AccountMenuDrawerService } from '../account-menu-drawer.service';
import { AccountMenuItemBase } from '../account-menu-item-base';
import { AccountMenuScrollService } from '../account-menu-scroll.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, SwipeDirective],
    selector: 'vn-am-icon-menu',
    templateUrl: 'icon-menu.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/animated-arrow-icon/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IconMenuComponent extends AccountMenuItemBase implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('linkContainer') linkContainer: ElementRef;
    private SWIPE_THRESHOLD = 25;
    private startY: number;
    private scrollTop: number = 0;
    private scrollMode: boolean = false;
    private unsubscribe = new Subject();
    readonly #window = inject(WINDOW);

    constructor(
        public accountMenuDrawerService: AccountMenuDrawerService,
        private accountMenuTasksService: AccountMenuTasksService,
        private accountMenuDataService: AccountMenuDataService,
        private accountMenuScrollService: AccountMenuScrollService,
        private elementRepositoryService: ElementRepositoryService,
        private timerService: TimerService,
    ) {
        super();
    }

    get templateVersion(): number {
        if (this.version === 1) {
            return 1;
        }

        if (this.version === 3 && this.accountMenuDataService.routerMode) {
            return 3;
        }

        return 2;
    }

    private get scrollOffset(): number {
        return this.scrollMode ? 25 : 0;
    }

    ngOnInit() {
        this.accountMenuScrollService.scroll.subscribe((scrollTop: number) => this.onScroll(scrollTop));
    }

    ngAfterViewInit() {
        if (this.version === 3) {
            this.accountMenuDrawerService.resetDrawerPosition.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
                this.timerService.setTimeout(() => {
                    this.accountMenuDrawerService.setDrawerPosition({
                        position: DrawerPosition.Middle,
                        height: this.getNextHeight(DrawerPosition.Middle),
                        isAutomaticallyOpened: true,
                    });
                });
            });
            this.accountMenuRouter.currentRoute
                .pipe(first((p: MenuRoute | null) => p !== null))
                .subscribe(() => this.accountMenuDrawerService.resetDrawer());
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }

    onTouchStart(event: any) {
        this.startY = event.changedTouches ? event.changedTouches[0].pageY : event.deltaY;
    }

    onTouchEnd(event: any) {
        const deltaY = event.changedTouches ? event.changedTouches[0].pageY - this.startY : event.deltaY;
        const absDeltaY = Math.abs(deltaY);
        const swipeDirection = absDeltaY >= this.SWIPE_THRESHOLD ? (deltaY > 0 ? SwipeDirection.Down : SwipeDirection.Up) : '';

        if (swipeDirection === SwipeDirection.Down && this.linkContainer.nativeElement.scrollTop === 0) {
            this.setNextHeight(DrawerPosition.Middle, SwipeDirection.Down);
        }
    }

    onSwipe(direction: SwipeDirection, position: DrawerPosition) {
        if (![SwipeDirection.Up, SwipeDirection.Down].includes(direction)) {
            return;
        }

        const shouldScroll = position === DrawerPosition.Middle && direction === SwipeDirection.Up;

        if (!shouldScroll) {
            this.setNextHeight(position, direction);
        }

        if (direction === SwipeDirection.Down && this.linkContainer.nativeElement.style.touchAction === 'manipulation') {
            this.setScroll(true);
        }
    }

    getIcon(position: DrawerPosition): string {
        switch (position) {
            case DrawerPosition.Bottom:
                return 'up';
            default:
                return 'down';
        }
    }

    setNextHeight(position: DrawerPosition, swipeDirection?: SwipeDirection) {
        this.accountMenuTasksService.expanded = false;
        const nextPosition = position === DrawerPosition.Bottom ? DrawerPosition.Middle : this.getNextPosition(position, swipeDirection);

        if (nextPosition === DrawerPosition.Middle) {
            this.setScroll(true);
        }

        this.timerService.setTimeout(() => {
            const height = this.getNextHeight(nextPosition);

            this.accountMenuDrawerService.setDrawerPosition({ position: nextPosition, height });
        });
    }

    private getNextHeight(position: DrawerPosition): number {
        const taskAnchor = this.elementRepositoryService.get(VanillaElements.ACCOUNT_MENU_TASKS_ANCHOR);

        if (taskAnchor && position === DrawerPosition.Middle) {
            return this.#window.document.documentElement.clientHeight - this.scrollTop - this.scrollOffset - this.getTopOffset(taskAnchor);
        }

        return BOTTOM_DRAWER_HEIGHT;
    }

    private onScroll(scrollTop: number) {
        this.scrollTop = scrollTop;
        this.scrollMode = scrollTop > 0;
    }

    private setScroll(isEnabled: boolean) {
        this.linkContainer.nativeElement.style.overflow = isEnabled ? 'auto' : 'hidden';
        this.linkContainer.nativeElement.style.touchAction = isEnabled ? 'manipulation' : 'none';
    }

    private getNextPosition(position: DrawerPosition, direction?: SwipeDirection): number {
        switch (direction) {
            case SwipeDirection.Up:
                return this.scrollMode ? DrawerPosition.Middle : Math.min(position + 1, DrawerPosition.Middle);
            case SwipeDirection.Down:
                return this.scrollMode || position === DrawerPosition.Bottom ? DrawerPosition.Bottom : position - 1;
            default:
                return DrawerPosition.Bottom;
        }
    }

    private getTopOffset(el: HTMLElement): number {
        return (el?.getBoundingClientRect().top || 0) + this.#window.scrollY;
    }
}
