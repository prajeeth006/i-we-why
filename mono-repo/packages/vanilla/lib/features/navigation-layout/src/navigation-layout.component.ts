import { BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation, inject, input } from '@angular/core';

import { ElementKeyDirective, ElementRepositoryService, MediaQueryService, TimerService, VanillaElements, WINDOW } from '@frontend/vanilla/core';
import { AccountMenuComponent } from '@frontend/vanilla/shared/account-menu';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { NavigationLayoutScrollService } from './navigation-layout-scroll.service';
import { NavigationLayoutService } from './navigation-layout.service';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuComponent, ElementKeyDirective],
    selector: 'lh-navigation-layout',
    templateUrl: 'navigation-layout.component.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/navigation-layout/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NavigationLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() bodyClass: string;
    @Input() hideLeftXs: boolean;
    @Input() hideRightXs: boolean;
    @Input() hideRightSection: boolean = false;
    @Input() sourceItem: string;
    @Input() hideLeftSection: boolean = false;
    @Input() hideMenu: boolean = false;
    @Input() scrolledToBottomPadding: number = 0; // To control when the scroll is considered at bottom
    @Input() version: number;
    @Input() mediaQueries: string[] = [];
    isProfilePage = input<boolean>(false);

    height: string;
    isMediaQueryActive: boolean = false;
    VanillaElements = VanillaElements;

    private unsubscribe = new Subject<void>();
    private onScrollSubject: Subject<HTMLElement> = new Subject<HTMLElement>();

    readonly #window = inject(WINDOW);

    constructor(
        private renderer: Renderer2,
        private navigationLayoutService: NavigationLayoutService,
        private navigationLayoutScrollService: NavigationLayoutScrollService,
        private elementRepositoryService: ElementRepositoryService,
        private mediaQueryService: MediaQueryService,
        private timerService: TimerService,
    ) {}

    ngAfterViewInit() {
        if (this.version === 3 || this.version === 5) {
            this.timerService.setTimeout(() => {
                const containerTopOffset = this.elementRepositoryService.get('NAV_LAYOUT_CONTAINER')?.getBoundingClientRect().top || 0;
                this.height = `${this.#window.innerHeight - containerTopOffset}px`;
            });
        }

        this.onScrollSubject.pipe(debounceTime(300)).subscribe((element: HTMLElement) => {
            this.navigationLayoutScrollService.sendScrollEvent(element, this.scrolledToBottomPadding);
        });
    }

    ngOnInit() {
        switch (this.version) {
            case 5:
            case 3:
                if (this.mediaQueries.length > 0) {
                    this.mediaQueryService
                        .observe(this.mediaQueries)
                        .pipe(takeUntil(this.unsubscribe))
                        .subscribe((result: BreakpointState) => {
                            this.isMediaQueryActive = result.matches;
                        });
                }
                break;
            case 4:
                if (this.bodyClass) {
                    this.renderer.addClass(this.#window.document.body, this.bodyClass);
                }
                const item = this.navigationLayoutService.getItem(this.sourceItem);
                this.hideLeftSection = this.hideLeftSection || !item || !item.leftMenuItems || item.leftMenuItems.length === 0;
                break;
        }
    }

    ngOnDestroy() {
        this.renderer.removeClass(this.#window.document.body, this.bodyClass);
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    onScroll(event: Event) {
        const element = event.target as HTMLElement;
        this.onScrollSubject.next(element);
    }
}
