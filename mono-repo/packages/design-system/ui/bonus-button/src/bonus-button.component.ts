import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { DsButtonBase } from '@frontend/ui/shared';

export const DS_BONUS_BUTTON_KIND_ARRAY = ['primary'] as const;
export type DsBonusButtonKind = (typeof DS_BONUS_BUTTON_KIND_ARRAY)[number];

@Component({
    selector: 'button[ds-bonus-button], a[ds-bonus-button]',
    standalone: true,
    template: `
        <span class="ds-bonus-btn-label">
            <ng-content />
        </span>
        <span class="ds-bonus-btn-value">
            <ng-content select="[slot=value]" />
        </span>
    `,
    styleUrl: './bonus-button.component.scss',
    host: {
        'class': 'ds-bonus-button',
        '[class.ds-btn-bonus-disabled]': 'disabled ? true : null',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsBonusButton extends DsButtonBase {}
