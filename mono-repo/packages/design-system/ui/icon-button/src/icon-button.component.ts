import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, computed, signal } from '@angular/core';

import { DsButtonBase } from '@frontend/ui/shared';

export const DS_ICON_BUTTON_VARIANT_ARRAY = ['flat', 'filled', 'outline', 'flat-reduced'] as const;
export type DsIconButtonVariant = (typeof DS_ICON_BUTTON_VARIANT_ARRAY)[number];

export const DS_ICON_BUTTON_KIND_ARRAY = ['primary', 'secondary', 'tertiary', 'utility'] as const;
export type DsIconButtonKind = (typeof DS_ICON_BUTTON_KIND_ARRAY)[number];

export const DS_ICON_BUTTON_SIZES_ARRAY = ['small', 'medium', 'large'] as const;
export type DsIconButtonSizes = (typeof DS_ICON_BUTTON_SIZES_ARRAY)[number];

@Component({
    selector: 'button[ds-icon-button], a[ds-icon-button]',
    standalone: true,
    template: `
        <span class="ds-icon-btn-icon">
            <ng-content />
        </span>
    `,
    styleUrl: './icon-button.component.scss',
    host: {
        'class': 'ds-icon-button',
        '[class]': 'hostClass()',
        '[attr.aria-label]': 'ariaLabel',
        '[class.ds-btn-icon-disabled]': 'disabled ? true : null',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsIconButton extends DsButtonBase {
    protected _size = signal<DsIconButtonSizes>('large');
    protected _kind = signal<DsIconButtonKind>('primary');
    protected _variant = signal<DsIconButtonVariant>('filled');
    protected _ariaLabel = signal('Icon button');

    @Input() set variant(value: DsIconButtonVariant) {
        this._variant.set(value);
    }
    get variant() {
        return this._variant();
    }
    @Input() set size(value: DsIconButtonSizes) {
        this._size.set(value);
    }
    get size() {
        return this._size();
    }
    @Input() set kind(value: DsIconButtonKind) {
        this._kind.set(value);
    }
    get kind() {
        return this._kind();
    }
    @Input() set ariaLabel(value: string) {
        this._ariaLabel.set(value);
    }
    get ariaLabel() {
        return this._ariaLabel();
    }

    hostClass = computed(() => {
        const variantKindClass = `ds-btn-icon-${this._variant()}-${this._kind()}`;
        const sizeClass = this._variant() === 'flat-reduced' ? `ds-btn-icon-${this._size()}-reduced` : `ds-btn-icon-${this._size()}`;
        return `${variantKindClass} ${sizeClass}`;
    });
}
