import { Directive, inject } from '@angular/core';

import { WINDOW } from '@frontend/vanilla/core';

import { OfferButtonComponentBase } from './offer-button-component-base';

/**
 * @stable
 */
@Directive({
    standalone: true,
})
export class OfferButtonDirective extends OfferButtonComponentBase {
    readonly #window = inject(WINDOW);

    constructor() {
        super();
        this.document = this.#window.document;
    }
}
