import { ChangeDetectionStrategy, Component, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';

@Component({
    selector: 'ds-help-group',
    template: `
        <div class="ds-help-text-group-header">
            <ng-content select="[slot=header]" />
        </div>
        <div class="ds-help-text-group-content">
            <ng-content />
        </div>
    `,
    styleUrls: ['./help-group.component.scss'],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.ds-help-text-group-inverse]': 'inverse()',
        '[class]': 'hostClass()',
    },
})
export class DsHelpGroup {
    inverse = input(false, { transform: booleanAttribute });

    protected hostClass = computed(() => `ds-help-text-group`);
}
