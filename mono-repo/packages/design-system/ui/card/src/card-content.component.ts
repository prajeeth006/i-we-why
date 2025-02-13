import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

// eslint-disable-next-line @nx/workspace-component-default-story,@nx/workspace-component-tests-present
@Component({
    selector: 'ds-card-content',
    template: `<ng-content />`,
    host: { class: 'ds-card-content' },
    styleUrl: 'card-content.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DsCardContent {}
