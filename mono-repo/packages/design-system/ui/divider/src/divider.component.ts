import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, booleanAttribute } from '@angular/core';

export const DS_DIVIDER_VARIANT_ARRAY = ['on-surface', 'on-surface-lowest', 'on-surface-low', 'on-surface-high', 'on-surface-highest'] as const;
export type DsDividerVariant = (typeof DS_DIVIDER_VARIANT_ARRAY)[number];

// eslint-disable-next-line @nx/workspace-component-tests-present
@Component({
    selector: 'ds-divider',
    standalone: true,
    template: ``,
    host: {
        'class': 'ds-divider',
        '[class]': `[ variant]`,
        '[class.ds-divider-vertical]': 'vertical',
        '[class.ds-divider-inverse]': 'inverse',
        'role': 'separator',
        '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./divider.component.scss'],
})
export class DsDivider {
    @Input({ transform: booleanAttribute }) vertical? = false;
    @Input() variant: DsDividerVariant = 'on-surface-lowest';
    @Input({ transform: booleanAttribute }) inverse = false;
}
