import { Directive, inject } from '@angular/core';

import { WINDOW } from '@frontend/vanilla/core';

import { OfferButtonComponentBase } from './offer-button-component-base';

/**
 * @stable
 */
@Directive({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[data-offer-id],[data-campaign-id]',
})
export class OfferButtonBehaviorDirective extends OfferButtonComponentBase {
    readonly #window = inject(WINDOW);

    constructor() {
        super();
        this.document = this.#window.document;
    }
}
