import { runOnFeatureInit } from '@frontend/vanilla/core';

import { OfferButtonBootstrapService } from './offer-button-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(OfferButtonBootstrapService)];
}
