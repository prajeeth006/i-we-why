import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, computed, signal } from '@angular/core';

import { DsButtonBase } from '@frontend/ui/shared';

export const DS_SOCIAL_BUTTON_VARIANT_ARRAY = ['filled', 'outline'] as const;
export type DsSocialButtonVariant = (typeof DS_SOCIAL_BUTTON_VARIANT_ARRAY)[number];

export const DS_SOCIAL_BUTTON_APP_ARRAY = ['yahoo', 'paypal', 'mlife', 'entain', 'facebook', 'apple', 'google'] as const;
export type DsSocialButtonAppArray = (typeof DS_SOCIAL_BUTTON_APP_ARRAY)[number];

export const DS_SOCIAL_BUTTON_SIZES_ARRAY = ['small', 'medium', 'large'] as const;
export type DsSocialButtonSize = (typeof DS_SOCIAL_BUTTON_SIZES_ARRAY)[number];

@Component({
    selector: 'button[ds-social-button], a[ds-social-button]',
    standalone: true,
    template: `
        <span class="ds-social-start-slot">
            <ng-content select="[slot=start]" />
        </span>
        <span class="ds-social-btn-text">
            <ng-content />
        </span>
    `,
    styleUrl: './social-button.component.scss',
    host: {
        'class': 'ds-social-button',
        '[class]': 'hostClass()',
        '[class.ds-btn-social-disabled]': 'disabled ? true : null',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSocialButton extends DsButtonBase {
    private _size = signal<DsSocialButtonSize>('large');
    private _variant = signal<DsSocialButtonVariant>('filled');
    private _socialApp = signal<DsSocialButtonAppArray>('apple');

    @Input() set variant(value: DsSocialButtonVariant) {
        this._variant.set(value);
    }
    get variant() {
        return this._variant();
    }
    @Input() set size(value: DsSocialButtonSize) {
        this._size.set(value);
    }
    get size() {
        return this._size();
    }
    @Input() set socialApp(value: DsSocialButtonAppArray) {
        this._socialApp.set(value);
    }
    get socialApp() {
        return this._socialApp();
    }

    hostClass = computed(() => {
        return `ds-btn-social-${this._variant()}-${this._socialApp()} ds-btn-social-${this._size()}`;
    });
}
