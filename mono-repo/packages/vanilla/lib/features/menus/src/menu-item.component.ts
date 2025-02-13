import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild, inject } from '@angular/core';

import {
    CookieName,
    CookieService,
    DeviceService,
    DslService,
    DynamicHtmlDirective,
    MenuContentItem,
    MenuDisplayMode,
    MenuItemsService,
    TimerService,
    TrackingService,
    WINDOW,
    WebAnalyticsEventType,
    toBoolean,
} from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { SvgComponent } from '@frontend/vanilla/features/svg';
import { AuthstateDirective } from '@frontend/vanilla/shared/auth';
import { HtmlAttrsDirective, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { TooltipsConfig } from '@frontend/vanilla/shared/tooltips';
import { NgxFloatUiModule } from 'ngx-float-ui';
import { Observable, firstValueFrom, of } from 'rxjs';

import { MenuItemBadgeDirective } from './menu-item-badge.directive';
import { MenuItemClickHandlerService } from './menu-item-click-handler.service';
import { MenuItemTextContentComponent } from './menu-item-text-content.component';

/**
 * @whatItDoes Renders a configurable menu item.
 *
 * @description
 *
 * This is a generic component that renders menu items. The data is usually provided by `IMenuFactory` from the server.
 * There are inputs which allow you to set whether icon and/or arrow should be shown, various element classes and
 * how click should be handled (by default it invokes menu action based on the item). The badge counter and active state
 * is handled in {@link MenuItemsService} using a section name that groups several menu items and the item `name`.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [
        AuthstateDirective,
        CommonModule,
        DynamicHtmlDirective,
        HtmlAttrsDirective,
        ImageComponent,
        MenuItemBadgeDirective,
        MenuItemTextContentComponent,
        NgxFloatUiModule,
        PopperContentComponent,
        SvgComponent,
        TrustAsHtmlPipe,
        IconCustomComponent,
    ],
    selector: 'vn-menu-item',
    templateUrl: 'menu-item.html',

    host: {
        '[class.menu-item]': 'true',
    },
})
export class MenuItemComponent implements OnInit, AfterViewInit {
    @ViewChild(PopperContentComponent) popperContent: PopperContentComponent;

    @Input() item: MenuContentItem;
    @Input() section: string;
    @Input({ transform: toMenuDisplayMode }) displayMode: MenuDisplayMode;
    @Input() badgePosition: 'icon' | 'beforeText' | 'afterText' | 'FastIcon' | undefined;
    @Input() badgeText: string | undefined;
    @Input() linkClass: string | string[];
    @Input() textClass: string | string[];
    @Input() iconClass: string | string[];
    @Input() badgeClass: string | string[];
    @Input() imageClass: string | string[];
    @Input() additionalIcon: string | string[];
    @Input() processClick: boolean | undefined;
    @Input() text: string | undefined;
    @Input() description: string | undefined;
    @Input() lazyLoadImage: boolean | undefined;
    @Input() addItemClassToLinkClasses: boolean = true;
    @Output() onClick = new EventEmitter<Event>();

    DisplayMode = MenuDisplayMode;
    linkClasses: { [key: string]: string };
    htmlAttributes: { [key: string]: string };
    lazyLoad: boolean;
    renderHtmlText: boolean | undefined;
    tooltipText: string | undefined;
    tooltipClass: string = 'tooltip-info';
    private tooltipType: string | undefined;
    iconName: string;
    iconName2: string | undefined;
    readonly #window = inject(WINDOW);

    constructor(
        private menuItemsService: MenuItemsService,
        private deviceService: DeviceService,
        private tooltipsConfig: TooltipsConfig,
        private cookieService: CookieService,
        private changeDetectorRef: ChangeDetectorRef,
        private dslService: DslService,
        private timerService: TimerService,
        private menuItemClickHandler: MenuItemClickHandlerService,
        private trackingService: TrackingService,
    ) {}

    @HostBinding('class') get class(): string {
        return this.item.parameters['menu-item-additional-class'] || '';
    }

    get isActive$(): Observable<boolean> {
        if (this.menuItemsService.isActive(this.section, this.item.name)) {
            return of(true);
        }

        if (this.item.parameters?.highlighted) {
            return this.dslService.evaluateExpression<boolean>(this.item.parameters.highlighted);
        }

        return of(false);
    }
    get isActive(): boolean {
        return this.menuItemsService.isActive(this.section, this.item.name);
    }

    get itemDescription(): string {
        return (
            this.menuItemsService.getDescription(this.section, this.item.name) ||
            this.description ||
            this.item.resources.description ||
            this.item.resources.subtitle ||
            ''
        );
    }

    get descriptionCssClass(): string | null {
        return this.menuItemsService.getDescriptionCssClass(this.section, this.item.name);
    }

    click(event: Event) {
        this.menuItemClickHandler.handleMenuTrack(this.item);
        this.menuItemClickHandler.handleMenuAction(event, this.item, this.section, this.processClick);

        if (toBoolean(this.item.parameters['save-url'])) {
            //TODO: Seems this is not used anywhere, remove it?
            this.cookieService.put(CookieName.PreviousPageUrl, this.#window.location.href);
        }

        if (toBoolean(this.item.parameters['disable-on-click'])) {
            this.linkClasses.disabled = 'true';
        }
        const textOnClick = this.item.parameters['text-on-click'];

        if (textOnClick) {
            this.text = textOnClick;
        }

        this.onClick.emit(event);
    }

    ngOnInit() {
        this.lazyLoad = !this.deviceService.isRobot && !!this.lazyLoadImage;
        this.renderHtmlText = toBoolean(this.item.parameters['render-html']);
        this.linkClasses = {};
        if (this.badgePosition !== 'FastIcon') {
            if (this.displayMode !== MenuDisplayMode.Icon && this.addItemClassToLinkClasses && this.item.class) {
                this.linkClasses[this.item.class] = 'true';
            }
        }
        if (this.linkClass) {
            (Array.isArray(this.linkClass) ? this.linkClass.slice(0) : [this.linkClass]).reduce((a, c) => {
                a[c] = 'true';

                return a;
            }, this.linkClasses);
        }

        const linkClass = this.item.parameters['link-class'];

        if (linkClass) {
            this.linkClasses[linkClass] = 'true';
        }

        this.imageClass = this.imageClass ?? this.item.parameters['image-class'];
        this.iconName = this.item.parameters.iconName ?? this.item.class;
        this.trackingService.trackEvents(this.item, WebAnalyticsEventType.load);
        this.iconName2 = this.item.parameters.iconName2;
    }

    async ngAfterViewInit() {
        await firstValueFrom(this.tooltipsConfig.whenReady);

        this.htmlAttributes = Object.fromEntries(
            Object.entries(this.item.parameters)
                .filter(([key]) => key.startsWith('attr.'))
                .map(([key, value]) => [key.replace('attr.', ''), value]),
        );

        if (this.tooltipsConfig.isOnboardingTooltipsEnabled) {
            this.timerService.setTimeout(() => {
                this.showOnboardingTooltips();
            }, 500);
        }
    }

    private showOnboardingTooltips() {
        this.tooltipClass = this.item.parameters['tooltip-class'] || this.tooltipClass;
        this.tooltipType = this.item.parameters.tooltip;

        if (this.tooltipType) {
            const tooltipsShown = this.cookieService.get(CookieName.OnBtt) || '';

            if (tooltipsShown.indexOf(this.tooltipType) > -1 || !this.tooltipsConfig.onboardings[this.tooltipType]) {
                return;
            }

            this.tooltipText = this.tooltipsConfig.onboardings[this.tooltipType]?.text;
            this.changeDetectorRef.detectChanges();
            this.popperContent?.content.show();

            const tooltipsArray = tooltipsShown.split(',');
            tooltipsArray.push(this.tooltipType);

            const expireDate = new Date();
            expireDate.setFullYear(expireDate.getFullYear() + 1);

            this.cookieService.put(CookieName.OnBtt, tooltipsArray.join(), { expires: expireDate });
        }
    }
}

function toMenuDisplayMode(value?: MenuDisplayMode): MenuDisplayMode {
    return value || MenuDisplayMode.Icon;
}
