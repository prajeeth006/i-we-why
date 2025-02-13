import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { ConnectedAccountsDslValuesProvider } from './connected-accounts-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(ConnectedAccountsDslValuesProvider)];
}
