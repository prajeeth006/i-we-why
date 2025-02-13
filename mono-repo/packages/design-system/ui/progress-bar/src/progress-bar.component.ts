import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';

export const DS_PROGRESS_BAR_VARIANTS_ARRAY = ['primary', 'secondary', 'positive', 'negative'] as const;
export type DsProgressBarVariant = (typeof DS_PROGRESS_BAR_VARIANTS_ARRAY)[number];

export const DS_PROGRESS_BAR_FILLS_ARRAY = ['solid', 'pattern'] as const;
export type DsProgressBarFill = (typeof DS_PROGRESS_BAR_FILLS_ARRAY)[number];
@Component({
    selector: 'ds-progress-bar',
    standalone: true,
    template: `
        <div class="ds-progress-bar-container">
            <div class="ds-progress-bar-inner"></div>
            @if (showCounter()) {
                <div class="ds-progress-bar-counter">
                    {{ value() }}
                </div>
            }
            <div class="ds-progress-bar-outer"></div>
        </div>
        <div class="ds-progress-bar-subtext">
            <ng-content select="[slot=start]" />
            <ng-content select="[slot=end]" />
        </div>
    `,
    styleUrl: './progress-bar.component.scss',
    host: {
        'class': 'ds-progress-bar',
        '[class]': 'hostClass()',
        '[class.ds-progress-bar-inverse]': 'inverse()',
        '[class.ds-progress-bar-with-counter]': 'showCounter()',
        '[attr.role]': '"progressbar"',
        '[attr.aria-valuenow]': 'value()',
        '[attr.aria-valuemin]': '0',
        '[attr.aria-valuemax]': '100',
        '[attr.aria-label]': 'ariaLabel()',
        '[style.--ds-progress-bar-value]': 'value() + "%"',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsProgressBar {
    variant = input<DsProgressBarVariant>('primary');
    fill = input<DsProgressBarFill>('solid');
    inverse = input(false, { transform: booleanAttribute });
    showCounter = input(false, { transform: booleanAttribute });
    value = input(0, { transform: (value: number) => Math.max(0, Math.min(100, value)) });
    ariaLabel = input<string | null>('Progress inidicator');

    hostClass = computed(() => {
        const variantClass = `ds-progress-bar-${this.variant()}`;
        const fillClass = `ds-progress-bar-${this.fill()}`;
        return `${variantClass} ${fillClass}`;
    });
}
