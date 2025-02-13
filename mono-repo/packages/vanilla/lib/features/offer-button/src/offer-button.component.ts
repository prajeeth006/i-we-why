import { Component, inject } from '@angular/core';

import { WINDOW } from '@frontend/vanilla/core';

import { OfferButtonComponentBase } from './offer-button-component-base';

/**
 * @stable
 */
@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[data-offer-id],[data-campaign-id]:not(a[ds-button])',
    template: '<ng-content />',
})
export class OfferButtonComponent extends OfferButtonComponentBase {
    readonly #window = inject(WINDOW);

    constructor() {
        super();
        this.document = this.#window.document;
    }
}
