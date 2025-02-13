import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { LicenseInfoDslValuesProvider } from './license-info-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(LicenseInfoDslValuesProvider)];
}
