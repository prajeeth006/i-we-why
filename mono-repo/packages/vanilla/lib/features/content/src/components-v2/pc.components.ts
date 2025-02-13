import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostBinding, OnDestroy, OnInit, QueryList, ViewChildren, inject } from '@angular/core';

import { CloudflareStreamModule } from '@cloudflare/stream-angular';
import {
    DeviceService,
    DynamicHtmlDirective,
    ExpandableMenuItem,
    MediaQueryService,
    MenuItemsService,
    MenuSection,
    NavigationService,
    ProductHomepagesConfig,
    TrackingService,
    UrlService,
    WINDOW,
    toBoolean,
} from '@frontend/vanilla/core';
import { HeaderBarService, LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { HtmlAttrsDirective } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { SwiperComponent } from '@frontend/vanilla/shared/swiper';
import { cloneDeep, toNumber } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SwiperOptions } from 'swiper/types';

import { PcContentItem } from '../content.models';
import { PageMatrixDirective } from '../page-matrix.directive';
import { PCComponent } from '../pc-component';
import { NavScrollDirective } from '../pc-scrollmenu.directive';
import { PMPage } from '../pm-component';
import { ProfilesDirective } from '../profiles.directive';
import { PCComponentHeaderV2Component } from './pc-component-header.component';
import { PCMenuItemComponent } from './pc-menu-item.component';

@Component({
    standalone: true,
    imports: [CommonModule, PageMatrixDirective],
    selector: 'vn-pm-1col-page',
    templateUrl: 'pm-1col-page.html',
})
export class PM1ColPageComponent extends PMPage {
    constructor() {
        super();
    }

    @HostBinding() get class(): string {
        return ['pm-page', 'pm-1col', 'pm-simple-layout', this.item.pageClass].filter((c: string | undefined) => c).join(' ');
    }

    @HostBinding('attr.id') get id(): string | undefined {
        return this.item.pageId;
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, PCComponentHeaderV2Component],
    selector: 'vn-pc-text',
    templateUrl: 'pc-text.html',
})
export class PCTextComponent extends PCComponent<PcContentItem> {
    @HostBinding() get class(): string {
        return this.createClass('pc-text');
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, LhHeaderBarComponent, IconCustomComponent],
    selector: 'vn-pc-text-with-header-bar',
    templateUrl: 'pc-text-with-header-bar.html',
})
export class PCTextWithHeaderBarComponent extends PCComponent<PcContentItem> implements OnInit {
    showCustomHeaderTemplate: boolean;
    customHeaderClass: string = '';
    readonly #window = inject(WINDOW);

    constructor(
        private navigation: NavigationService,
        private media: MediaQueryService,
        private headerBarService: HeaderBarService,
    ) {
        super();
    }

    ngOnInit() {
        if (this.item.parameters) {
            if (this.item.parameters['custom-header-media-query']) {
                this.showCustomHeaderTemplate = this.media.isActive(this.item.parameters['custom-header-media-query']);
            }
            if (this.item.parameters['custom-header-class']) {
                this.customHeaderClass = this.item.parameters['custom-header-class'];
            }
        }
    }

    onBackClick() {
        if (this.#window.document.referrer) {
            this.#window.history.back();
        } else {
            this.navigation.goToLastKnownProduct();
        }
    }

    close() {
        const welcomeOverlayUrl = this.item.parameters?.['welcome-overlay-url'];

        if (welcomeOverlayUrl && this.navigation?.previousUrl?.includes(welcomeOverlayUrl)) {
            this.#window.history.back();
        } else {
            this.headerBarService.close();
        }
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, LhHeaderBarComponent, IconCustomComponent],
    selector: 'vn-pc-header-for-mpp-page',
    templateUrl: 'pc-header-for-mpp-page.html',
})
export class PCHeaderForMppPageComponent extends PCComponent<PcContentItem> implements OnInit {
    customHeaderClass: string = '';
    readonly #window = inject(WINDOW);

    constructor(
        private navigation: NavigationService,
        private productHomepages: ProductHomepagesConfig,
        public deviceService: DeviceService,
    ) {
        super();
    }

    ngOnInit() {
        if (this.item.parameters?.['custom-header-class']) {
            this.customHeaderClass = this.item.parameters['custom-header-class'];
        }
    }

    onHistoryBack() {
        if (this.#window.document.referrer) {
            this.#window.history.back();
        } else if (this.productHomepages.promo) {
            this.navigation.goTo(this.productHomepages.promo);
        } else {
            this.navigation.goToLastKnownProduct();
        }
    }
}

let pcToggleCount = 0;

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, IconCustomComponent],
    selector: 'vn-pc-toggle',
    templateUrl: 'pc-toggle.html',
})
export class PCToggleComponent extends PCComponent<PcContentItem> implements OnInit {
    id: string;

    @HostBinding() get class(): string {
        return this.createClass('pc-toggle');
    }

    ngOnInit() {
        this.id = 'pctoggle_chbx_' + pcToggleCount;
        pcToggleCount++;
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, HtmlAttrsDirective, ProfilesDirective, PCComponentHeaderV2Component, IconCustomComponent],
    selector: 'vn-pc-image',
    templateUrl: 'pc-image.html',
})
export class PCImageComponent extends PCComponent<PcContentItem> {
    @HostBinding() get class(): string {
        return this.createClass('pc-image');
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, ProfilesDirective, HtmlAttrsDirective, PCComponentHeaderV2Component, DynamicHtmlDirective],
    selector: 'vn-pc-image-text',
    templateUrl: 'pc-image-text.html',
})
export class PCImageTextComponent extends PCComponent<PcContentItem> {
    @HostBinding() get class(): string {
        return this.createClass('pc-image-text');
    }
}

/**
 * @whatItDoes Renders Cloudflare stream video component.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, CloudflareStreamModule, PCComponentHeaderV2Component],
    selector: 'vn-pc-video',
    templateUrl: 'pc-video.html',
})
export class PCVideoComponent extends PCComponent<PcContentItem> implements OnInit {
    settings: {
        autoplay: boolean;
        loop: boolean;
        muted: boolean;
        preload: 'auto' | 'metadata' | 'none' | boolean;
        poster: string | undefined;
    } = {
        autoplay: false,
        loop: false,
        muted: false,
        preload: 'auto',
        poster: '',
    };
    private playing: boolean = false;

    constructor(
        private trackingService: TrackingService,
        private urlService: UrlService,
    ) {
        super();
    }

    @HostBinding() get class(): string {
        return this.createClass('pc-video');
    }

    @HostBinding() get style() {
        return {
            width: this.item.video?.width ? `${this.item.video.width}px` : null,
            height: this.item.video?.height ? `${this.item.video.height}px` : null,
        };
    }

    ngOnInit() {
        const videoSrc = this.item?.video?.src;

        if (!videoSrc) {
            return;
        }

        const queryParams = this.urlService.parse(videoSrc).search;

        queryParams.keys().forEach((key: string) => {
            const value = queryParams.get(key)?.toLowerCase();
            (this.settings as any)[key] = toBoolean(value) || value || (this.settings as any)[key];
        });

        // According to the browser policies, video cannot be auto-played with sound.
        // See: https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide#autoplay_availability
        if (this.settings.autoplay) {
            this.settings.muted = true;
        }

        this.settings.poster = this.item.parameters?.poster;
    }

    onPlay(event: Event) {
        if (event.type === 'play' && !this.playing) {
            this.playing = true;

            this.trackingService.triggerEvent('Event.Tracking', {
                'component.CategoryEvent': 'pc video',
                'component.LabelEvent': 'pc video',
                'component.ActionEvent': 'click',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'public page',
                'component.EventDetails': 'pc video play',
                'component.URLClicked': 'not applicable',
            });
        }
    }

    onPause() {
        this.playing = false;

        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'pc video',
            'component.LabelEvent': 'pc video',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'public page',
            'component.EventDetails': 'pc video pause',
            'component.URLClicked': 'not applicable',
        });
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, HtmlAttrsDirective, ProfilesDirective, PCComponentHeaderV2Component],
    selector: 'vn-pc-teaser',
    templateUrl: 'pc-teaser.html',
})
export class PCTeaserComponent extends PCComponent<PcContentItem> implements OnInit {
    imageProfilesSet: string | undefined;
    overlayImageProfilesSet: string | undefined;
    subtitleTag: string = 'h4';
    subtitleClass: string;
    summaryTag: string = 'h5';
    summaryClass: string;

    @HostBinding() get class(): string {
        return this.createClass('pc-teaser');
    }

    ngOnInit() {
        const subtitleClasses = ['pc-t-h-cont-sub'];
        const summaryClasses = ['pc-t-h-cont-sum'];

        if (this.item.parameters) {
            this.imageProfilesSet = this.item.parameters['image-profiles-set'];
            this.overlayImageProfilesSet = this.item.parameters['overlay-image-profiles-set'];

            const additionalSubtitleClass = this.item.parameters['subtitle-class'];
            const additionalSummaryClass = this.item.parameters['summary-class'];
            const subtitleTag = this.item.parameters['subtitle-tag'];
            const summaryTag = this.item.parameters['summary-tag'];

            if (additionalSubtitleClass) {
                subtitleClasses.push(additionalSubtitleClass);
            }

            if (additionalSummaryClass) {
                summaryClasses.push(additionalSummaryClass);
            }

            if (subtitleTag) {
                this.subtitleTag = subtitleTag;
            }

            if (summaryTag) {
                this.summaryTag = summaryTag;
            }
        }

        this.subtitleClass = subtitleClasses.join(' ');
        this.summaryClass = summaryClasses.join(' ');
    }
}

@Component({
    standalone: true,
    imports: [PCComponentHeaderV2Component, PageMatrixDirective, CommonModule],
    selector: 'vn-pc-container',
    templateUrl: 'pc-container.html',
})
export class PCContainerComponent extends PCComponent<PcContentItem> {
    @HostBinding() get class(): string {
        return this.createClass('pc-container');
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, PCComponentHeaderV2Component, PageMatrixDirective],
    selector: 'vn-pc-component-folder',
    templateUrl: 'pc-component-folder.html',
})
export class PCComponentFolderComponent extends PCComponent<PcContentItem> {
    @HostBinding() get class(): string {
        return this.createClass('pc-folder');
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, PCMenuItemComponent, PCComponentHeaderV2Component],
    selector: 'vn-pc-menu',
    templateUrl: 'pc-menu.html',
})
export class PCMenuComponent extends PCComponent<PcContentItem> implements OnInit, AfterViewInit, OnDestroy {
    @ViewChildren(PCMenuItemComponent, { read: ElementRef }) pcMenuItems: QueryList<ElementRef>;
    section: string;
    items: ExpandableMenuItem[];
    private destroySubject = new Subject();
    private currentUrl: string;

    constructor(
        private urlService: UrlService,
        private navigationService: NavigationService,
        private menuItemsService: MenuItemsService,
        private elementRef: ElementRef,
    ) {
        super();
    }

    @HostBinding() get class(): string {
        return this.createClass('pc-menu');
    }

    ngOnInit() {
        this.section = `${MenuSection.PageMatrix}_${this.item.name}`;
        this.currentUrl = this.navigationService.location.baseUrl() + this.navigationService.location.path();
    }

    ngAfterViewInit() {
        if (this.item.menu) {
            this.items = cloneDeep(this.item.menu.children);
            const activeChain = this.findActiveChain(this.items, []);

            if (activeChain.length) {
                activeChain.forEach((i) => (i.expanded = true));
                const activeLeaf = activeChain[activeChain.length - 1];

                if (activeLeaf?.name) {
                    this.menuItemsService.setActive(this.section, activeLeaf.name);
                }

                if (this.item.menu.parameters) {
                    this.pcMenuItems.changes.pipe(takeUntil(this.destroySubject)).subscribe(() => {
                        const pcMenu = this.pcMenuItems.find((x) => x.nativeElement.id === activeLeaf?.name);
                        const boundingRect = pcMenu?.nativeElement.getBoundingClientRect();
                        const scrollX = toBoolean(this.item.menu?.parameters['active-scroll-horizontal']) ? boundingRect.x : 0;
                        const scrollY = toBoolean(this.item.menu?.parameters['active-scroll-vertical']) ? boundingRect.y : 0;

                        if (scrollX || scrollY) {
                            const element: HTMLElement = this.elementRef.nativeElement;

                            element.getElementsByClassName('pc-menu-items')[0]?.scrollBy({
                                left: scrollX,
                                top: scrollY,
                                behavior: 'smooth',
                            });
                        }
                    });
                }
            }
        }
    }

    ngOnDestroy() {
        this.destroySubject.next(null);
        this.destroySubject.complete();
    }

    private findActiveChain(items: ExpandableMenuItem[], chain: ExpandableMenuItem[]): ExpandableMenuItem[] {
        for (const child of items) {
            if (child.url) {
                const url = this.urlService.parse(child.url);

                if (this.currentUrl === url.baseUrl() + url.path()) {
                    return [...chain, child];
                }
            }

            if (child.children) {
                const childChain = this.findActiveChain(child.children, [...chain, child]);

                if (childChain.length) {
                    return childChain;
                }
            }
        }

        return [];
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, PCComponentHeaderV2Component, PageMatrixDirective],
    selector: 'vn-pc-regional-component',
    templateUrl: 'pc-regional-component.html',
})
export class PCRegionalComponent extends PCComponent<PcContentItem> {
    @HostBinding() get class(): string {
        return this.createClass('pc-regional');
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective],
    selector: 'vn-pc-raw-text',
    templateUrl: 'pc-raw-text.html',
})
export class PCRawTextComponent extends PCComponent<PcContentItem> {
    @HostBinding('attr.class') get class(): string | undefined {
        return this.item.class;
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, ImageComponent],
    selector: 'vn-pc-raw-image',
    templateUrl: 'pc-raw-image.html',
})
export class PCRawImageComponent extends PCComponent<PcContentItem> {
    @HostBinding('attr.class') get class(): string | undefined {
        return this.item.class;
    }
}

@Component({
    standalone: true,
    imports: [CommonModule, PageMatrixDirective, SwiperComponent],
    selector: 'vn-pc-carousel',
    templateUrl: 'pc-carousel.html',
})
export class PCCarouselComponent extends PCComponent<PcContentItem> implements OnInit {
    swiperClass: string | undefined;
    swiperOptions: SwiperOptions = {
        pagination: false,
        centeredSlides: true,
    };
    @HostBinding() get class(): string {
        return this.createClass('pc-carousel');
    }

    ngOnInit() {
        if (this.item.parameters) {
            this.swiperOptions.loop = !!toBoolean(this.item.parameters.loop);
            this.swiperOptions.autoplay = toBoolean(this.item.parameters.autoplay)
                ? {
                      delay: toNumber(this.item.parameters.interval || 3000),
                      disableOnInteraction: false,
                      stopOnLastSlide: true,
                      pauseOnMouseEnter: !!toBoolean(this.item.parameters.pauseOnHover),
                  }
                : false;
            this.swiperOptions.navigation = !!toBoolean(this.item.parameters.arrows);
            this.swiperOptions.pagination = !!toBoolean(this.item.parameters.dots);
            this.swiperOptions.slidesPerView = toNumber(this.item.parameters.slidesPerView || 1);
            this.swiperOptions.slidesPerGroup = this.slidesPerGroup(
                Number(this.item.parameters?.slidesPerGroup),
                this.item.items?.length || 0,
                this.swiperOptions.loop,
            );
        }

        if (this.item.class) {
            this.swiperClass = `${this.item.class}`;
        }
    }

    /*
        For the swiper to be able to loop correctly, the 'slidesPerGroup' value should be a factor of the total
        'slidesCount'. This method adjusts the 'slidesPerGroup' by decrementing it until 'slidesCount' is divisible by
        'slidesPerGroup' without a remainder.
    */
    private slidesPerGroup(paramVal: number, slidesCount: number, loop: boolean): number {
        let slidesPerGroup = toNumber(paramVal || 1);

        if (loop) {
            while (slidesCount % slidesPerGroup) {
                slidesPerGroup--;
            }
        }

        return slidesPerGroup;
    }
}

const DEFAULT_MENU_TIMEOUT = 3000;

@Component({
    standalone: true,
    imports: [NavScrollDirective, CommonModule, PageMatrixDirective],
    selector: 'vn-pc-scrollmenu',
    templateUrl: 'pc-scrollmenu.html',
})
export class PCScrollMenuComponent extends PCComponent<PcContentItem> implements OnInit {
    currentItem: string;
    navBarTopHeight: number;
    menuTimeOut: number;
    readonly #window = inject(WINDOW);

    constructor() {
        super();
    }

    @HostBinding() get class(): string {
        return this.createClass('pc-scrollmenu');
    }

    ngOnInit() {
        const navBarTopHeight = this.item.parameters?.navBarTopHeight;
        const menuTimeoutMs = this.item.parameters?.menuTimeOut || DEFAULT_MENU_TIMEOUT;
        this.navBarTopHeight = toNumber(navBarTopHeight);
        this.menuTimeOut = toNumber(menuTimeoutMs);
    }

    sectionChanged(sectionId: string) {
        this.currentItem = sectionId;
    }

    scrollStop() {
        this.currentItem = '';
    }

    scrollTo(section: string) {
        const element = this.#window.document.getElementById(section)!;
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
