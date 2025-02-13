import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export const DS_CARD_FOOTER_VARIANT_ARRAY = ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'] as const;
export type DsCardFooterVariant = (typeof DS_CARD_FOOTER_VARIANT_ARRAY)[number];

@Component({
    selector: 'ds-card-footer',
    template: `
        <ng-content select="[slot=divider]" />
        <div class="ds-card-footer-container">
            <ng-content />
        </div>
    `,
    host: {
        'class': 'ds-card-footer',
        '[class]': `hostClass`,
    },
    styleUrl: 'card-footer.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DsCardFooter {
    @Input() variant: DsCardFooterVariant = 'surface-lowest';

    get hostClass() {
        return `ds-card-footer-${this.variant}`;
    }
}
