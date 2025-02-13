// eslint-disable-next-line @nx/workspace-component-default-story
import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Directive,
    TemplateRef,
    ViewEncapsulation,
    booleanAttribute,
    inject,
    input,
} from '@angular/core';

import { DsIconButton } from '@frontend/ui/icon-button';

import { DsAccordion } from './accordion.component';
import { DsAccordionToggle } from './ds-accordion-toggle.directive';

export interface DsAccordionTriggerContext {
    $implicit: boolean;
}

@Directive({
    selector: 'ng-template[dsAccordionTrigger]',
    standalone: true,
})
export class DsAccordionTrigger {
    static ngTemplateContextGuard(directive: DsAccordionTrigger, context: unknown): context is DsAccordionTriggerContext {
        return true;
    }
}

// eslint-disable-next-line @nx/workspace-component-default-story,@nx/workspace-component-tests-present
@Component({
    selector: 'ds-accordion-header',
    standalone: true,
    template: `
        <div class="ds-accordion-header-container">
            <div class="ds-accordion-header-start">
                <ng-content select="[slot=start]" />
            </div>
            <div class="ds-accordion-header-end">
                <ng-content select="[slot=end]" />
            </div>
            @if (!hideToggle()) {
                <div class="ds-accordion-header-trigger">
                    <ng-container
                        [ngTemplateOutlet]="triggerTemplate ?? defaultToggle"
                        [ngTemplateOutletContext]="{ $implicit: accordion.isOpen()() }" />
                </div>
            }
        </div>

        <ng-template #defaultToggle let-open>
            <button
                dsAccordionToggle
                ds-icon-button
                kind="utility"
                variant="flat"
                size="medium"
                [inverse]="accordion.inverse()"
                type="button"
                [ariaLabel]="accordion.isOpen()() ? accordion.closeAccordionLabel() : accordion.openAccordionLabel()">
                @if (open) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.74352 4.854L1.53662 10.854L2.46332 11.8127L8.1906 6.27628L13.5204 11.7964L14.4796 10.8703L8.68647 4.87026C8.56361 4.74302 8.39522 4.66981 8.21836 4.66676C8.04151 4.66371 7.87069 4.73107 7.74352 4.854Z" />
                    </svg>
                } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M7.74352 11.8127L1.53662 5.81266L2.46332 4.854L8.1906 10.3904L13.5204 4.87027L14.4796 5.79639L8.68647 11.7964C8.56361 11.9236 8.39522 11.9968 8.21836 11.9999C8.04151 12.0029 7.87069 11.9356 7.74352 11.8127Z" />
                    </svg>
                }
            </button>
        </ng-template>
    `,
    host: {
        class: 'ds-accordion-header',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: 'accordion-header.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [NgTemplateOutlet, DsAccordionToggle, DsIconButton],
    hostDirectives: [DsAccordionToggle],
})
export class DsAccordionHeader {
    // convert this to contentChild
    @ContentChild(DsAccordionTrigger, { read: TemplateRef })
    triggerTemplate?: TemplateRef<DsAccordionTriggerContext>;

    hideToggle = input(false, { transform: booleanAttribute });

    protected accordion = inject(DsAccordion);

    constructor() {
        if (!this.accordion) {
            throw new Error('DsAccordionHeader can only be used inside a DsAccordion component!');
        }
    }
}
