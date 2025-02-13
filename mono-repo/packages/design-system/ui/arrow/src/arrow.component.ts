import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';

export const Ds_Arrow_Size_ARRAY = ['small', 'medium', 'large'] as const;
export type DsArrowSize = (typeof Ds_Arrow_Size_ARRAY)[number];
export type DsArrowDirection = 'left' | 'right';
export const DS_Arrow_VARIANT_ARRAY = ['strong', 'subtle'] as const;
export type DsArrowVariant = (typeof DS_Arrow_VARIANT_ARRAY)[number];

@Component({
    selector: 'ds-arrow',
    standalone: true,
    imports: [CommonModule, NgTemplateOutlet],
    templateUrl: './arrow.component.html',
    host: {
        '[class]': 'hostClass()',
        '[class.ds-right-arrow]': "direction() === 'right'",
        '[class.ds-arrow-inverse]': 'inverse()',
        'tabIndex': '0',
        'role': 'button',
        '[attr.aria-label]': 'ariaLabel()',
    },
    styleUrl: './arrow.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsArrow {
    size = input<DsArrowSize>('large');
    direction = input<DsArrowDirection>('left');
    inverse = input(false, { transform: booleanAttribute });
    variant = input<DsArrowVariant>('strong');

    @ContentChild('dsArrow') dsArrowTpl?: TemplateRef<any>;

    ariaLabel = computed(() => {
        return `${this.direction() === 'right' ? 'right arrow' : 'left arrow'}`;
    });
    hostClass = computed(() => {
        const sizeClass = this.size() === 'small' ? 'ds-arrow-small' : this.size() === 'medium' ? 'ds-arrow-medium' : 'ds-arrow-large';
        return `ds-arrow ${sizeClass} ds-${this.variant()}-arrow`;
    });
}
