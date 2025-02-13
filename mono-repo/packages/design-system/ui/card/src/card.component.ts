import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';

export const DS_CARD_VARIANT_ARRAY = ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'] as const;
export type DsCardVariant = (typeof DS_CARD_VARIANT_ARRAY)[number];

@Component({
    selector: 'ds-card',
    template: `<ng-content />`,
    host: {
        'class': 'ds-card',
        '[class]': `[ hostClass()]`,
        '[class.ds-card-hover-effect]': 'withHover()',
        '[class.ds-card-no-elevation]': '!elevated()',
        '[class.ds-card-overflow-hidden]': 'noOverflow()',
        '[class.ds-card-no-border]': 'noBorder()',
        '[class.ds-card-no-border-radius]': 'noBorderRadius()',
    },
    styleUrl: 'card.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DsCard {
    variant = input<DsCardVariant>('surface-lowest');
    elevated = input(true, { transform: booleanAttribute });
    withHover = input(false, { transform: booleanAttribute });
    /* applying a css class with overflow:hidden style */
    noOverflow = input(false, { transform: booleanAttribute });
    noBorderRadius = input(false, { transform: booleanAttribute });
    noBorder = input(false, { transform: booleanAttribute });
    hostClass = computed(() => `ds-card-${this.variant()}`);
}
