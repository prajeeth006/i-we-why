import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

// eslint-disable-next-line @nx/workspace-component-default-story,@nx/workspace-component-tests-present
@Component({
    selector: 'ds-modal-content',
    template: `<ng-content />`,
    host: { class: 'ds-modal-content' },
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsModalContent {}
