import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

export const DS_MODAL_HEADER_VARIANT_ARRAY = ['surface-lowest', 'surface-low', 'surface', 'surface-high'] as const;
export type DsModalHeaderVariant = (typeof DS_MODAL_HEADER_VARIANT_ARRAY)[number];

// eslint-disable-next-line @nx/workspace-component-default-story
@Component({
    selector: 'ds-modal-header',
    standalone: true,
    template: `
        <div class="ds-modal-header-container">
            <div class="ds-modal-header-start">
                <ng-content select="[slot=start]" />
            </div>
            <div class="ds-modal-header-center">
                <ng-content select="[slot=center]" />
                <ng-content select="ds-modal-header-drag, [modal-header-image]" />
            </div>
            <div class="ds-modal-header-end">
                <ng-content select="[slot=end]" />
            </div>
        </div>
    `,
    host: {
        'class': 'ds-modal-header',
        '[class]': 'hostClass()',
        'role': 'dialog',
        'aria-label': 'Modal header dialog',
    },
    styleUrl: './modal-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DsModalHeader {
    variant = input<DsModalHeaderVariant>('surface');

    protected hostClass = computed(() => `ds-modal-header-${this.variant()}`);
}
