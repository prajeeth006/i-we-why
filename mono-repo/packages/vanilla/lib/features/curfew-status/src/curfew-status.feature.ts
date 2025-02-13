import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { CurfewStatusDslValuesProvider } from './curfew-status-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(CurfewStatusDslValuesProvider)];
}
