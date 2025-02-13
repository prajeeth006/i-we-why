import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

// eslint-disable-next-line @nx/workspace-component-tests-present
@Component({
    selector: 'ds-scrollbar',
    template: `<ng-content /> `,
    host: {
        class: 'ds-scrollbar',
    },
    styleUrl: 'scrollbar.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsScrollbar {}
