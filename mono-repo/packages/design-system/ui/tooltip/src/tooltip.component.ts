import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, computed, inject, input, output } from '@angular/core';

import { DsTooltipTrigger, OVERLAY_REF_WITH_DATA_TOKEN } from './tooltip.directives';

export const DS_TOOLTIP_VARIANT_ARRAY = ['neutral', 'utility'] as const;
export type DsTooltipVariant = (typeof DS_TOOLTIP_VARIANT_ARRAY)[number];

@Component({
    selector: 'ds-tooltip-content',
    template: `
        <div [class]="outerContainerClasses()" aria-live="polite" tabindex="0" role="tooltip">
            <span class="ds-tooltip-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="11" viewBox="0 0 20 11">
                    <path d="M11.5364 10.1563C10.7369 11.1158 9.26315 11.1158 8.46356 10.1563L0 0L20 0L11.5364 10.1563Z" fill="currentColor" />
                </svg>
            </span>
            <div [class]="containerClasses">
                <div class="ds-tooltip-text-container">
                    <div class="ds-tooltip-text">
                        <ng-content select="[slot=title]" />
                        <ng-content select="[slot=description]" />
                    </div>

                    <div
                        class="ds-tooltip-close-button"
                        (click)="closeTooltip($event)"
                        (keydown)="handleKeydown($event)"
                        [attr.aria-label]="ariaLabel || null"
                        role="button">
                        <ng-content select="[slot=close]" />
                    </div>
                </div>
                <ng-content select="[slot=action]" />
            </div>
        </div>
    `,
    styleUrls: ['./tooltip.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTooltipContent {
    private tooltipTrigger = inject(DsTooltipTrigger);

    protected overlay = inject(OVERLAY_REF_WITH_DATA_TOKEN);

    variant = input<DsTooltipVariant>('neutral');

    protected containerClasses = `ds-tooltip-container`;
    protected outerContainerClasses = computed(
        () =>
            `ds-tooltip-outer-container ds-tooltip-${this.variant()} ds-tooltip-${this.overlay.data.position} ds-tooltip-arrow-${this.overlay.data.arrowPosition}`,
    );

    readonly closed = output<{ type: string; source: string }>();
    @Input() ariaLabel = 'close icon';

    public closeTooltip(event: Event): void {
        if (this.overlay) {
            event.stopPropagation();
            this.closed.emit({ type: event.type, source: 'close' });
            this.tooltipTrigger.tooltipToggleChange.emit({ isTooltipOpen: false, source: 'close' });
            this.overlay.ref.detach();
        }
    }

    // Handle keydown events for accessibility
    public handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.closeTooltip(event);
        }
    }
}
