import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    Directive,
    ElementRef,
    InjectionToken,
    Injector,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewContainerRef,
    inject,
    output,
    signal,
} from '@angular/core';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

export const DS_TOOLTIP_POSITION_ARRAY = ['left', 'top', 'right', 'bottom'] as const;
export type DsTooltipPosition = (typeof DS_TOOLTIP_POSITION_ARRAY)[number];
export const DS_ARROW_POSITION_ARRAY = ['start', 'middle', 'end'] as const;
export type DsArrowPosition = (typeof DS_ARROW_POSITION_ARRAY)[number];

export interface OverlayRefWithData {
    ref: OverlayRef;
    data: {
        position: DsTooltipPosition;
        arrowPosition: DsArrowPosition;
    };
}

export const OVERLAY_REF_WITH_DATA_TOKEN = new InjectionToken<OverlayRefWithData>('OverlayRef with data');

@Directive({
    selector: '[dsTooltipTriggerFor]',
    standalone: true,
    host: {
        '(click)': 'toggleTooltip($event)',
    },
})
export class DsTooltipTrigger implements OnInit, OnDestroy {
    private overlay = inject(Overlay);
    private injector = inject(Injector);
    private elementRef = inject(ElementRef);
    private ngZone = inject(NgZone);
    private vcr = inject(ViewContainerRef);

    @Input() autoOpen = false;
    @Input() autoCloseTime = 10_000;
    @Input('dsTooltipTriggerFor') content!: TemplateRef<any>;
    @Input() position: DsTooltipPosition = 'top';
    @Input() arrowPosition: DsArrowPosition = 'start';
    @Input() closeOnScroll = false;
    @Input() hasBackdrop = false;
    private _tooltipToggle = signal(false); // internal signal

    @Input()
    set tooltipToggle(value: boolean) {
        this._tooltipToggle.set(value);
        if (!this._overlayRef) {
            return;
        }
        if (value) {
            this.openTooltip();
        } else {
            this.closeTooltip();
        }
    }
    get tooltipToggle(): boolean {
        return this._tooltipToggle();
    }

    readonly tooltipToggleChange = output<{ isTooltipOpen: boolean; source: string }>();

    private autoCloseTimeout?: ReturnType<typeof setTimeout>;
    private backdropSubscription?: Subscription;
    private overlaySubscriptions = new Subscription();
    _overlayRef?: OverlayRef;

    ngOnInit(): void {
        this._overlayRef = this.createOverlay();
        this.listenToOverlayState();
        if (this._tooltipToggle() || this.autoOpen) {
            this.initializeAutoOpen(this.autoOpen);
        }
    }

    private initializeAutoOpen(shouldAutoClose: boolean): void {
        this.ngZone.onStable.pipe(take(1)).subscribe(() => {
            if (!this._overlayRef?.hasAttached()) {
                this.openTooltip();
                setTimeout(() => this._overlayRef?.updatePosition(), 0);
            }
        });
        if (shouldAutoClose) {
            this.scheduleAutoClose(this.autoCloseTime ?? 10_000);
        }
    }

    private listenToOverlayState(): void {
        if (!this._overlayRef) {
            return;
        }

        this.overlaySubscriptions.add(
            this._overlayRef.attachments().subscribe(() => {
                this._tooltipToggle.set(true); // Update signal
                this.tooltipToggleChange.emit({ isTooltipOpen: true, source: 'overlayAttachment' });
            }),
        );

        this.overlaySubscriptions.add(
            this._overlayRef.detachments().subscribe(() => {
                this._tooltipToggle.set(false); // Update signal
                this.tooltipToggleChange.emit({ isTooltipOpen: false, source: 'overlayDetachment' });
            }),
        );
    }

    private createOverlay(): OverlayRef {
        const overlayConfig = this.getOverlayConfig();
        return this.overlay.create(overlayConfig);
    }

    private getOverlayConfig(): OverlayConfig & { backdropClass?: string } {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.elementRef)
            .withPositions([getOverlayPosition(this.position, this.arrowPosition)])
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withPush(false);

        const scrollStrategy: ScrollStrategy = this.closeOnScroll
            ? this.overlay.scrollStrategies.close()
            : this.overlay.scrollStrategies.reposition();

        return {
            positionStrategy,
            scrollStrategy,
            hasBackdrop: this.hasBackdrop,
            ...(this.hasBackdrop && { backdropClass: 'cdk-overlay-transparent-backdrop' }),
        };
    }

    private scheduleAutoClose(delay: number): void {
        if (delay === 0) {
            return;
        } // Skip auto-close if 0
        this.ngZone.runOutsideAngular(() => {
            this.autoCloseTimeout = setTimeout(() => {
                this.ngZone.run(() => {
                    if (this._overlayRef?.hasAttached()) {
                        this.closeTooltip();
                    }
                });
            }, delay);
        });
    }

    toggleTooltip(event: Event | null = null): void {
        event?.stopPropagation();

        if (this._overlayRef?.hasAttached()) {
            this.closeTooltip();
        } else {
            this.openTooltip();
        }
    }

    private openTooltip(): void {
        if (this._overlayRef?.hasAttached() || !this.content) {
            return;
        } // Prevent opening if already open or content is missing

        if (!this._overlayRef) {
            this._overlayRef = this.createOverlay();
            this.listenToOverlayState(); // Ensure state listeners are set
        }

        const injector = Injector.create({
            providers: [
                {
                    provide: OVERLAY_REF_WITH_DATA_TOKEN,
                    useValue: {
                        ref: this._overlayRef,
                        data: { position: this.position, arrowPosition: this.arrowPosition },
                    },
                },
            ],
            parent: this.injector,
        });

        const tooltipPortal = new TemplatePortal(this.content, this.vcr, null, injector);
        this._overlayRef.attach(tooltipPortal);

        if (this.hasBackdrop) {
            this.listenForBackdropClick();
        }
    }

    closeTooltip(): void {
        if (this._overlayRef?.hasAttached()) {
            this._overlayRef?.detach();
        }
        this.backdropSubscription?.unsubscribe();
    }

    listenForBackdropClick(): void {
        this.backdropSubscription = this._overlayRef?.backdropClick().subscribe(() => {
            this.closeTooltip();
        });
    }

    ngOnDestroy(): void {
        this.cleanupResources();
    }

    private cleanupResources(): void {
        if (this.autoCloseTimeout) {
            this.ngZone.runOutsideAngular(() => clearTimeout(this.autoCloseTimeout));
        }
        this._overlayRef?.dispose();
        this.backdropSubscription?.unsubscribe();
        this.overlaySubscriptions.unsubscribe();
    }
}

/*
    Offsets: one has to move the tooltip due to arrow which is out of bounding box by size of arrow
    This is for bottom and top, offsetY, and for left and right: offsetX

    The other offset is to move full container to fit arrow head to right position.

    Instead of offsets defined here one can also use a panel class, as the overlay computation
    is taking into account offsets and client bounding rects, both should be fine to be used.
    Has to be refactored if ARROW_SIZE should be dynamically controlled.
*/
const ARROW_HEIGHT = 11;
const ARROW_WIDTH = 20;
const ARROW_OFFSET = 8;
const CONTAINER_OFFSET = ARROW_WIDTH / 2 + ARROW_OFFSET;
const TOOLTIP_POSITIONS: Record<string, ConnectedPosition> = {
    bottomstart: { offsetY: ARROW_HEIGHT, offsetX: -CONTAINER_OFFSET, originX: 'center', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    bottomend: { offsetY: ARROW_HEIGHT, offsetX: CONTAINER_OFFSET, originX: 'center', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
    bottommiddle: { offsetY: ARROW_HEIGHT, originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' },
    topstart: { offsetY: -ARROW_HEIGHT, offsetX: -CONTAINER_OFFSET, originX: 'center', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    topend: { offsetY: -ARROW_HEIGHT, offsetX: CONTAINER_OFFSET, originX: 'center', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    topmiddle: { offsetY: -ARROW_HEIGHT, originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' },
    leftstart: { offsetX: -ARROW_HEIGHT, offsetY: -CONTAINER_OFFSET, originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'top' },
    leftend: { offsetX: -ARROW_HEIGHT, offsetY: CONTAINER_OFFSET, originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'bottom' },
    leftmiddle: { offsetX: -ARROW_HEIGHT, originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' },
    rightstart: { offsetX: ARROW_HEIGHT, offsetY: -CONTAINER_OFFSET, originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'top' },
    rightend: { offsetX: ARROW_HEIGHT, offsetY: CONTAINER_OFFSET, originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'bottom' },
    rightmiddle: { offsetX: ARROW_HEIGHT, originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },
};

function getOverlayPosition(position: DsTooltipPosition, arrowPosition: DsArrowPosition): ConnectedPosition {
    const key = `${position}${arrowPosition}`; // Cast to valid key type
    return TOOLTIP_POSITIONS[key] || TOOLTIP_POSITIONS['topmiddle']; // Default fallback
}
