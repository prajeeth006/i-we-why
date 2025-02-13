import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation, signal } from '@angular/core';

import { DsIconButton } from '@frontend/ui/icon-button';

export const DS_CARD_HEADER_VARIANT_ARRAY = ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'] as const;
export type DsCardHeaderVariant = (typeof DS_CARD_HEADER_VARIANT_ARRAY)[number];

@Component({
    selector: 'ds-card-header',
    template: `
        <ng-content select="[slot=start]" />
        <div class="ds-card-header-text" (click)="onTextClick()">
            <div class="ds-card-header-title-wrapper">
                <span class="ds-card-header-title" [class.ds-card-header-title-expand]="!subtitle">{{ title }}</span>
                <ng-content select="[slot=title]" />
            </div>
            @if (subtitle) {
                <span class="ds-card-header-subtitle">{{ subtitle }}</span>
            }
        </div>
        <div class="ds-card-header-slot-container">
            <ng-content select="[slot=end]" />
        </div>
        @if (expandable) {
            <span class="ds-card-header-chevron">
                <button slot="end" ds-icon-button size="small" variant="flat" kind="tertiary" (click)="toggleExpand()" (keydown)="toggleExpand()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.96 5.5">
                        <path d="M5.18 5.36 9.96.74 9.25 0 4.84 4.26.74.01 0 .72l4.46 4.62c.09.1.22.15.36.16.14 0 .27-.05.37-.14Z" />
                    </svg>
                </button>
            </span>
        }
    `,
    host: {
        'class': 'ds-card-header',
        '[class]': `hostClass`,
        '[class.ds-card-header-expanded]': 'expanded()',
    },
    styleUrl: 'card-header.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [DsIconButton],
})
export class DsCardHeader {
    @Input({ required: true }) title!: string;
    @Input() subtitle?: string = '';

    @Input() expandable?: boolean = false;
    @Input() variant: DsCardHeaderVariant = 'surface-lowest';

    @Output() headerClick = new EventEmitter<void>();

    get hostClass() {
        return `ds-card-header-${this.variant}`;
    }

    expanded = signal(false);

    toggleExpand() {
        this.expanded.update((value) => !value);
    }

    onTextClick() {
        this.headerClick.emit();
    }
}
