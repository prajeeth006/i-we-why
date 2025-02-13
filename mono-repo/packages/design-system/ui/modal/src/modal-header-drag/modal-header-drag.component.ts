import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

// eslint-disable-next-line @nx/workspace-component-default-story
@Component({
    standalone: true,
    selector: 'ds-modal-header-drag',
    host: {
        'class': 'ds-modal-header-drag',
        'role': 'dialog',
        'aria-label': 'Modal header drag dialog',
    },
    template: `<span class="ds-modal-header-drag-rectangle"></span>`,
    styleUrl: 'modal-header-drag.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class DsModalHeaderDrag {}
