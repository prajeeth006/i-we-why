import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { AbuserInformationDslValuesProvider } from './abuser-information-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(AbuserInformationDslValuesProvider)];
}
