import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { BonusAwardDslValuesProvider } from './bonus-award-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(BonusAwardDslValuesProvider)];
}
