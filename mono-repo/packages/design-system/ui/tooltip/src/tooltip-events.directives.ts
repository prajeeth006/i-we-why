import { Directive, ElementRef, Input, NgZone, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';

import { DsTooltipTrigger } from './tooltip.directives';

// Description: Directive to control tooltip visibility based on mouse events
@Directive({
    selector: '[dsTooltipOnFocus]',
    standalone: true,
})
export class DsTooltipOnFocus implements OnInit, OnDestroy {
    private tooltipTrigger = inject(DsTooltipTrigger);
    private ngZone = inject(NgZone);
    private elementRef = inject(ElementRef);
    private hideTimeoutId?: ReturnType<typeof setTimeout>;
    @Input() closeDelay = 100;

    private isMouseInside = signal(false);

    constructor() {
        effect(() => {
            if (this.isMouseInside()) {
                this.showTooltip();
            } else {
                this.hideTooltip();
            }
        });
    }

    ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            this.addEventListeners();
        });
    }

    private addEventListeners(): void {
        const element = this.elementRef.nativeElement as HTMLElement;
        element.addEventListener('mouseenter', this.onMouseEnter);
        element.addEventListener('mouseleave', this.onMouseLeave);

        const tooltipElement = this.tooltipTrigger._overlayRef?.overlayElement;
        tooltipElement?.addEventListener('mouseleave', this.onTooltipMouseLeave);
    }

    private removeEventListeners(): void {
        const element = this.elementRef.nativeElement as HTMLElement;
        element.removeEventListener('mouseenter', this.onMouseEnter);
        element.removeEventListener('mouseleave', this.onMouseLeave);

        const tooltipElement = this.tooltipTrigger._overlayRef?.overlayElement;
        tooltipElement?.removeEventListener('mouseleave', this.onTooltipMouseLeave);
    }

    private showTooltip(): void {
        if (!this.tooltipTrigger._overlayRef?.hasAttached()) {
            this.tooltipTrigger.toggleTooltip();

            // Ensure position is recalculated after attaching
            setTimeout(() => {
                this.tooltipTrigger._overlayRef?.updatePosition();
            }, 0);

            this.tooltipTrigger._overlayRef?.detachments().subscribe(() => {
                this.resetTooltipState();
            });
        }
    }

    private hideTooltip(): void {
        if (this.tooltipTrigger._overlayRef?.hasAttached()) {
            this.tooltipTrigger.toggleTooltip();
        }
    }

    private onMouseEnter = (): void => {
        this.isMouseInside.set(true);

        // Clear the hide timeout if the mouse re-enters the tooltip
        this.ngZone.runOutsideAngular(() => {
            if (this.hideTimeoutId) {
                clearTimeout(this.hideTimeoutId);
                this.hideTimeoutId = undefined;
            }
        });
    };

    // Mouse leave event handler (adds a delay before hiding)
    private onMouseLeave = (event: MouseEvent): void => {
        if (!this.isLeavingTooltip(event)) {
            this.scheduleHide();
        }
    };

    private onTooltipMouseLeave = (event: MouseEvent): void => {
        if (!this.isLeavingTooltip(event)) {
            this.scheduleHide();
        }
    };

    private isLeavingTooltip(event: MouseEvent): boolean {
        const tooltipElement = this.tooltipTrigger._overlayRef?.overlayElement;
        return (
            !!tooltipElement &&
            (tooltipElement.contains(event.relatedTarget as Node) || (event.currentTarget as HTMLElement).contains(event.relatedTarget as Node))
        );
    }

    private scheduleHide(): void {
        this.ngZone.runOutsideAngular(() => {
            this.hideTimeoutId = setTimeout(() => {
                this.isMouseInside.set(false);
                this.resetTooltipState();
            }, this.closeDelay);
        });
    }

    private resetTooltipState(): void {
        this.isMouseInside.set(false);
        this.hideTooltip();
    }

    ngOnDestroy(): void {
        this.ngZone.runOutsideAngular(() => {
            if (this.hideTimeoutId) {
                clearTimeout(this.hideTimeoutId);
            }
        });
        this.removeEventListeners();
    }
}
