import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, computed, inject, input } from '@angular/core';

import {
    AccountMenuService,
    CommonMessages,
    ContentImage,
    DynamicLayoutService,
    DynamicLayoutSlotComponent,
    EventsService,
    HeaderService,
    HtmlNode,
    MediaQueryService,
    MenuContentItem,
    NativeAppService,
    NativeEventType,
    NavigationService,
    Page,
    SimpleEvent,
    SlotName,
    TimerService,
    TrackingEventData,
    UserService,
    VanillaEventNames,
    WINDOW,
    toBoolean,
} from '@frontend/vanilla/core';
import { FooterComponent } from '@frontend/vanilla/features/footer';
import { HeaderBarComponent, HeaderBarService, LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { Subject, combineLatest } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';

import { NavigationItem } from './models';
import { NavigationLayoutLeftMenuComponent } from './navigation-layout-left-menu.component';
import { NavigationLayoutTopMenuV2Component } from './navigation-layout-top-menu-v2.component';
import { NavigationLayoutConfig } from './navigation-layout.client-config';
import { NavigationLayoutComponent } from './navigation-layout.component';
import { NavigationLayoutService } from './navigation-layout.service';

/**
 * @stable
 */
export enum TopMenuVisibility {
    Never = 'Never',
    Always = 'Always',
    Desktop = 'Desktop',
}

/**
 * @whatItDoes This is the layout for all settings pages.
 *
 * @howToUse
 *
 * Create a page, add the settings page layout and set the content of the page.
 * ```
 *  <lh-settings-page [pageTitle]="title" [showMessages]="true" [settingsItems]="settingsMenuItems" [settingsMenuItemsTop]="topMenuItems">
 *     Your page content
 *  </lh-settings-page>
 * ```
 *
 * @description
 *
 * This layout will add the top-settings-menu and left-settings-menu to the page.
 * It is responsive, when the page is in mobile view the menus are hidden and the header-bar will show.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [
        CommonModule,
        NavigationLayoutTopMenuV2Component,
        NavigationLayoutComponent,
        HeaderBarComponent,
        LhHeaderBarComponent,
        NavigationLayoutLeftMenuComponent,
        DynamicLayoutSlotComponent,
        IconCustomComponent,
    ],
    selector: 'lh-navigation-layout-page',
    templateUrl: 'navigation-layout-page.component.html',
    host: {
        '[class.ch]': 'version === 5',
    },
})
export class NavigationLayoutPageComponent implements OnInit, OnChanges, OnDestroy {
    /** Source navigation item name configured in sitecore */
    @Input() sourceItem: string;
    /** Allows to hide close button in the header (mobile view). */
    @Input() hideCloseButton: boolean;
    /** Allows to add right section (desktop view). */
    @Input() showRightSection: boolean = false;
    /** Allows showing/hiding of title in desktop view */
    @Input() showTitle: boolean = true;
    /** Page Title. If not set, it will use sourceItem's text property */
    @Input() title: string;
    /** Allows back button to be hidden when used in responsive view */
    @Input() hideBackButton: boolean = false;
    /** Top menu visibility. Supported values 'Always', 'Never', 'Desktop' */
    @Input() topMenuVisibility: string = TopMenuVisibility.Always;
    /** Top menu visibility. Supported values 'Always', 'Never', 'Desktop' */
    @Input() contentContainerClassV2: string = 'portal-center-wrapper';
    /** Allows manual highlighting of item in product switcher */
    @Input() highlightProduct: string;
    /** Allows to hide left menu (desktop view). */
    @Input() hideLeftMenu: boolean = false;
    /** Allows to hide menu (desktop view) on v2. */
    @Input() hideMenu: boolean = false;
    /** Allows to suppress default close button behaviour */
    @Input() suppressDefaultCloseBehaviour: boolean = false;
    /** Allows to suppress default back button behaviour */
    @Input() suppressDefaultBackBehaviour: boolean = false;
    /** Allows to show loading indicator */
    @Input() showLoadingIndicator: boolean = false;
    /** Allows to control when the scroll for `lh-navigation-layout` content is considered at bottom */
    @Input() scrolledToBottomPadding: number = 10;
    /** Indicates if rendered page is profile page */
    isProfilePage = input<boolean>(false);
    /** Indicates if footer should be moved to navigation layout slot for version 3 and 5 */
    swapFooterComponent = input<boolean>(true);
    /** Indicates if confirmation popup should be shown when leaving the page */
    showConfirmPopup = input<boolean>(false);
    /** Data to be tracked when confirm popup is opened */
    confirmPopupTrackLoad = input<TrackingEventData>();
    /** Data to be tracked when button is clicked in confirm popup */
    confirmPopupTrackClick = input<TrackingEventData>();
    /** Data to be tracked when back is clicked */
    trackBackClickEvent = input<TrackingEventData>();
    /** Data to be tracked when close is clicked */
    trackCloseClickEvent = input<TrackingEventData>();
    /** Specifies callback when back button is clicked */
    @Output() onBack: EventEmitter<any> = new EventEmitter();
    /** Specifies callback when close button is clicked */
    @Output() onClose: EventEmitter<any> = new EventEmitter();

    item: NavigationItem | null;
    version: number;
    headerImage: ContentImage | undefined;
    headerEnabled: boolean;
    mediaQueries: string[] = [];
    titleClass: string = 'px-4 text-dark h';

    SlotName = SlotName;

    private shouldSwapFooter = computed(() => this.swapFooterComponent() && (this.version === 3 || this.version === 5));
    private unsubscribe = new Subject<void>();

    readonly #window = inject(WINDOW);

    constructor(
        public navigation: NavigationService,
        public commonMessages: CommonMessages,
        public user: UserService,
        private navigationLayoutService: NavigationLayoutService,
        private config: NavigationLayoutConfig,
        private headerService: HeaderService,
        private accountMenuDataService: AccountMenuDataService,
        private accountMenuService: AccountMenuService,
        private htmlNode: HtmlNode,
        private headerBarService: HeaderBarService,
        private nativeApplication: NativeAppService,
        private page: Page,
        private media: MediaQueryService,
        private dynamicLayoutService: DynamicLayoutService,
        private timerService: TimerService,
        private eventsService: EventsService,
    ) {}

    get hideTopMenu(): boolean {
        if (this.version === 2 && this.isMobile) return true;
        if (this.topMenuVisibility === TopMenuVisibility.Never) return true;
        if (this.topMenuVisibility === TopMenuVisibility.Desktop) return this.isMobile;

        return false;
    }

    private get isMobile(): boolean {
        return this.media.isActive('xs');
    }

    ngOnInit() {
        combineLatest([
            this.accountMenuService.whenReady,
            this.config.whenReady,
            this.navigationLayoutService.initialized.pipe(filter((e) => e)),
        ]).subscribe(() => {
            this.mediaQueries = this.config.leftMenuEnabledOnCustomerHub;
            this.versionBasedInit();
            this.accountMenuDataService.content.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
                this.versionBasedInit();
            });
            if (this.version === 1 || this.version === 4) {
                this.setTitleCssClass();
            }

            if (this.shouldSwapFooter()) {
                this.eventsService.allEvents
                    .pipe(
                        filter((e: SimpleEvent) => e?.eventName === VanillaEventNames.FooterLoaded),
                        first(),
                    )
                    .subscribe(() => this.dynamicLayoutService.swap(SlotName.Footer, SlotName.NavLayoutFooter, FooterComponent));
            }
            if (this.highlightProduct) {
                this.timerService.setTimeout(() => this.headerService.highlightProduct(this.highlightProduct));
            }

            this.navigationLayoutService.headerEnabled.pipe(takeUntil(this.unsubscribe)).subscribe((enabled) => {
                this.headerEnabled = enabled;
            });
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        //Force reinit when sourceItem is changed for same route (e.g cashier pages on iframe)
        if (!changes.sourceItem?.firstChange && changes.sourceItem?.currentValue != changes.sourceItem?.previousValue) {
            this.ngOnInit();
        }
    }

    ngOnDestroy() {
        this.accountMenuService.whenReady.subscribe(() => this.accountMenuService.setActiveItem(''));
        this.htmlNode.setCssClass('navigation-layout-open', false);
        this.navigationLayoutService.showTopMenu.next(null);

        if (this.highlightProduct) {
            this.timerService.setTimeout(() => this.headerService.highlightProduct(null));
        }

        if (this.shouldSwapFooter()) {
            this.dynamicLayoutService.swap(SlotName.NavLayoutFooter, SlotName.Footer, FooterComponent);
        }

        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    setTitleCssClass() {
        const data = this.config.elements;
        if (data) {
            const titleItem = Object.keys(data).find((key) => data[key]?.text === 'theme-names') || null;

            if (titleItem != null) {
                this.titleClass =
                    data[titleItem]?.parameters[this.page.theme]?.toString() || data[titleItem]?.parameters.default?.toString() || 'px-4 text-dark h';
            }
        }
    }

    back() {
        this.onBack.next(null);

        if (!this.suppressDefaultBackBehaviour) {
            if (this.accountMenuDataService.routerModeReturnUrl || this.#window.document.referrer) {
                this.#window.history.back();
            } else if (this.item && this.item.parent) {
                this.navigation.goTo('/settings/navigation/' + this.item.parent.name);
                return;
            } else {
                this.navigation.goToLastKnownProduct();
            }
        }
    }

    close() {
        if (this.onClose.observers.length > 0) {
            this.onClose.emit();
        }

        if (!this.suppressDefaultCloseBehaviour) {
            this.headerBarService.close();
        }

        this.nativeApplication.sendToNative({ eventName: NativeEventType.PAGECLOSED, parameters: { product: this.page.product } });
    }

    private versionBasedInit() {
        this.version = this.accountMenuDataService.version;

        if (this.version === 2 || this.version === 3 || this.version === 5) {
            this.htmlNode.setCssClass('navigation-layout-open', true);
            this.headerImage = this.config.elements.header?.image;
            const sourceItem = this.accountMenuDataService.getItem(this.sourceItem?.toLowerCase());

            if (sourceItem) {
                const menuItem = this.getMenuItem(sourceItem);

                if (!this.accountMenuService.routerMode) {
                    this.accountMenuService.setActiveItem(menuItem.parameters['active-item'] || menuItem.name);
                }

                this.item = {
                    pageTitle: this.hideTopMenu ? sourceItem.text : menuItem.text,
                    headerTitle: sourceItem.text,
                    selectedTopItem: sourceItem.name,
                    topMenuItems: menuItem.children,
                } as NavigationItem;

                this.accountMenuDataService.topItemsLoaded.next(this.item.topMenuItems);
            }
        } else {
            this.item = this.navigationLayoutService.getItem(this.sourceItem);

            if (!this.item) {
                return;
            }

            if (!this.hideTopMenu) {
                this.navigationLayoutService.showTopMenu.next(this.item);
            }

            this.hideLeftMenu = this.hideLeftMenu || !this.item.leftMenuItems || this.item.leftMenuItems.length === 0;
            this.hideBackButton =
                this.hideBackButton ||
                (!this.accountMenuDataService.routerModeReturnUrl && !this.#window.document.referrer && this.item.parent === null);
        }
    }

    private findParent(object: any, item: string, parent: string | null): any {
        if (object.hasOwnProperty(item.toLowerCase())) {
            return parent;
        }

        for (const property of Object.keys(object)) {
            if (object[property]) {
                const parent = this.findParent(object[property], item, property);

                if (parent) {
                    return parent;
                }
            }
        }
    }

    private getMenuItem(sourceItem: MenuContentItem): MenuContentItem {
        let item: MenuContentItem | null = sourceItem;

        do {
            if (toBoolean(item.parameters.highlightable)) {
                return item;
            }

            const parentItem = this.findParent(this.accountMenuDataService.hierarchy, item.name, null);
            item = this.accountMenuDataService.getItem(parentItem);
        } while (item);

        throw new Error(`Cant find parent menu item of ${sourceItem.name}.`);
    }
}
