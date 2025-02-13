import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { OfferDslValuesProvider } from './offer-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(OfferDslValuesProvider)];
}
