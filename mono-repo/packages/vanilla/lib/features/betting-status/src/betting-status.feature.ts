import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { BettingStatusDslValuesProvider } from './betting-status-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(BettingStatusDslValuesProvider)];
}
