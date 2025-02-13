import { Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';

import { Logger, Page, UrlService, WINDOW, WindowEvent } from '@frontend/vanilla/core';

export class ImageMqlHandler {
    private listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any;

    constructor(
        public mql: MediaQueryList,
        public src: string,
    ) {}

    unsubscribe() {
        this.mql.removeEventListener(WindowEvent.Change, this.listener);
    }

    subscribe(fn: () => void) {
        this.listener = fn;
        this.mql.addEventListener(WindowEvent.Change, fn);
    }
}

/**
 * @whatItDoes Displays an image from sitecore in width profile based on screen size.
 *
 * @howToUse
 *
 * This component is used to render images (PCImage) from sitecore.
 *
 * You can also use it manually:
 *
 * ```
 * <img [vnProfilesSrc]="image" [alt]="altText" [vnProfilesWidth]="750" />
 * ```
 *
 * @description
 *
 * A directive that changes src of images in profile widths based on screen size to save bandwidth.
 * In order to support resizing, images have to be saved in Sitecore database, not on filesystem.
 * To get a resized images from Sitecore, we are adding profile parameter to the URL:
 * http://faq.cms.bwin.prod/questions/381/how-can-i-use-the-image-resizer-feature-that-sitecore-cms-offers
 *
 * If you specify `vnProfilesWidth` (base width of the image), it will not load width profiles large than the base width.
 *
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnProfilesSrc]',
})
export class ProfilesDirective implements OnInit, OnChanges, OnDestroy {
    @Input() vnProfilesSrc: string;
    @Input() vnProfilesWidth?: number;
    @Input() vnProfilesSet?: string;
    readonly #window = inject(WINDOW);

    private handlers: ImageMqlHandler[];

    constructor(
        private zone: NgZone,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private page: Page,
        private log: Logger,
        private urlService: UrlService,
    ) {}

    ngOnInit() {
        this.init();
    }

    ngOnChanges() {
        if (this.handlers) {
            this.unsubscribe();
            this.init();
        }
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    private shouldIncludeWidth(width: number): boolean {
        if (!this.vnProfilesWidth) {
            return true; // Don't know original image width so can't tell if profile makes it smaller or larger
        }

        return this.vnProfilesWidth > width; // Don't include profiles that would upscale the image
    }

    private init() {
        const setName = this.vnProfilesSet || 'default';
        let set = this.page.imageProfiles[setName];

        if (!set) {
            this.log.warn(`Image profile set ${setName} is not defined, using default.`);
            set = this.page.imageProfiles.default;
        }

        const sources = set?.widthBreakpoints
            .filter((w: number) => this.shouldIncludeWidth(w))
            .map((w: number) => {
                const profileSrc = this.urlService.parse(this.vnProfilesSrc);
                profileSrc.search.set('p', `${set?.prefix}${w}`);

                return { media: `(max-width: ${w}px)`, src: `${profileSrc.absUrl()}` };
            });

        this.handlers = [];

        if (sources) {
            for (const source of sources) {
                const mql = this.#window.matchMedia(source.media);

                const handler = new ImageMqlHandler(mql, source.src);

                handler.subscribe(() => this.zone.run(() => this.setImage()));

                this.handlers.push(handler);
            }

            this.setImage();
        }
    }

    private setImage() {
        const source = this.handlers.find((s) => s.mql.matches);

        if (source) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'src', source.src);
        } else {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'src', this.vnProfilesSrc);
        }

        if (this.vnProfilesWidth) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'width', '' + this.vnProfilesWidth);
        }
    }

    private unsubscribe() {
        for (const handler of this.handlers) {
            handler.unsubscribe();
        }

        this.handlers = [];
    }
}
