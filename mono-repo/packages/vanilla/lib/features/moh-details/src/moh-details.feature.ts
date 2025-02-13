import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { MohDetailsDslValuesProvider } from './moh-details-dsl-values-provider.service';
import { MohDetailsService } from './moh-details.service';

export function provide() {
    return [MohDetailsService, registerLazyDslOnModuleInit(MohDetailsDslValuesProvider)];
}
