import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'ds-modal',
    template: `<ng-content />`,
    host: {
        'class': 'ds-modal',
        'role': 'dialog',
        'aria-label': 'Modal dialog',
    },
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    styleUrl: './modal.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsModal {}
