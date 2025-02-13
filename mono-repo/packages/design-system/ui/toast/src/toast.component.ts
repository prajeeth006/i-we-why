import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';

export const DS_TOAST_TYPE = ['info', 'warning', 'error', 'success'] as const;
export type DsToastType = (typeof DS_TOAST_TYPE)[number];
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'ds-toast',
    template: `
        <div class="ds-toast-status-icon">
            <ng-content select="[slot=statusIcon]" />
        </div>
        <div class="ds-toast-description">
            <ng-content />
        </div>
        <ng-content select="[slot=action]" />
        <ng-content select="[slot=close]" />
    `,
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    styleUrl: './toast.component.scss',
    host: {
        'class': 'ds-toast',
        '[class]': 'hostClass()',
        'role': 'status',
        'aria-live': 'polite',
        '[attr.aria-label]': 'type + " toast"',
    },
})
export class DsToast {
    type = input<DsToastType>('info');

    hostClass = computed(() => {
        const typeClass = `ds-toast-${this.type()}`;
        return `${typeClass}`;
    });
}
