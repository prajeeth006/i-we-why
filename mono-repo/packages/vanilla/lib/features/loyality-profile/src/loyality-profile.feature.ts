import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { LoyalityProfileDslValuesProvider } from './loyality-profile-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(LoyalityProfileDslValuesProvider)];
}
