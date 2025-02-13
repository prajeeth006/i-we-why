import { Component } from '@angular/core';

import { DsButton } from '@frontend/ui/button';

import { OfferButtonDirective } from './offer-button.directive';

/**
 * @stable
 */
@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[data-offer-id],[data-campaign-id]',
    template: '<ng-content />',
    hostDirectives: [OfferButtonDirective],
})
export class OfferBehaviorButtonComponent extends DsButton {}
