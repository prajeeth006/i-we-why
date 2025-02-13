import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { RegistrationDslValuesProvider } from './registration-dsl-values-provider.service';

export function provide() {
    return [registerLazyDslOnModuleInit(RegistrationDslValuesProvider)];
}
