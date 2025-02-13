import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Input,
    TemplateRef,
    ViewEncapsulation,
    booleanAttribute,
    computed,
    signal,
} from '@angular/core';

import { DsButtonBase } from '@frontend/ui/shared';

export const DS_BUTTON_KIND_ARRAY = ['primary', 'secondary', 'tertiary', 'success', 'utility'] as const;
export type DsButtonKind = (typeof DS_BUTTON_KIND_ARRAY)[number];

export const DS_BUTTON_VARIANTS_ARRAY = ['filled', 'outline', 'flat', 'flat-reduced'] as const;
export type DsButtonVariant = (typeof DS_BUTTON_VARIANTS_ARRAY)[number];

export const DS_BUTTON_SIZES_ARRAY = ['small', 'medium', 'large'] as const;
export type DsButtonSize = (typeof DS_BUTTON_SIZES_ARRAY)[number];

@Component({
    selector: 'button[ds-button], a[ds-button]',
    standalone: true,
    exportAs: 'ds-button',
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    host: {
        'class': 'ds-button',
        '[class]': 'hostClass()',
        '[class.ds-btn-disabled]': 'disabled ? true : null',
        '[class.ds-button-loading]': 'loading ? true : null',
        '[class.ds-button-truncate]': 'truncate',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsButton extends DsButtonBase {
    private _variant = signal<DsButtonVariant>('filled');
    private _size = signal<DsButtonSize>('large');
    private _kind = signal<DsButtonKind>('primary');
    private _loading = signal(false);
    private _truncate = signal(false);
    private _wrapText = signal(false);

    @Input() set variant(value: DsButtonVariant) {
        this._variant.set(value);
    }
    get variant() {
        return this._variant();
    }
    @Input() set size(value: DsButtonSize) {
        this._size.set(value);
    }
    get size() {
        return this._size();
    }
    @Input() set kind(value: DsButtonKind) {
        this._kind.set(value);
    }
    get kind() {
        return this._kind();
    }
    @Input({ transform: booleanAttribute }) set loading(value: boolean) {
        this._loading.set(value);
    }
    get loading() {
        return this._loading();
    }
    @Input({ transform: booleanAttribute }) set truncate(value: boolean) {
        this._truncate.set(value);
    }
    get truncate() {
        return this._truncate();
    }
    @Input({ transform: booleanAttribute }) set wrapText(value: boolean) {
        this._wrapText.set(value);
    }
    get wrapText() {
        return this._wrapText();
    }

    @ContentChild('loadingTemplate') loadingTemplate?: TemplateRef<any>;

    hostClass = computed(() => {
        const variantKindClass = `ds-btn-${this._variant()}-${this._kind()}`;
        const sizeClass = this._variant() === 'flat-reduced' ? `ds-btn-${this._size()}-reduced` : `ds-btn-${this._size()}`;
        return `${variantKindClass} ${sizeClass}`;
    });
}
export const DS_BUTTON_NOT_SUPPORTED_CONFIG: { [key: string]: DsButtonKind[] } = {
    'flat': ['secondary', 'primary', 'success'],
    'outline': ['success', 'utility'],
    'filled': [],
    'flat-reduced': ['primary', 'secondary', 'success'],
};
