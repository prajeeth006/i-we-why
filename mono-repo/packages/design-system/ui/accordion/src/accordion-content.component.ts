import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

// eslint-disable-next-line @nx/workspace-component-default-story,@nx/workspace-component-tests-present
@Component({
    selector: 'ds-accordion-content',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    template: ` <ng-content /> `,
})
export class DsAccordionContent {}
