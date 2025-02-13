import { LazyClientConfigService, registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { SelfExclusionBootstrapService } from './self-exclusion-bootstrap.service';
import { SelfExclusionDslValuesProvider } from './self-exclusion-dsl-values-provider';
import { SelfExclusionConfig, selfExclusionFactory } from './self-exclusion.client-config';
import { SelfExclusionService } from './self-exclusion.service';

export function provide() {
    return [
        SelfExclusionService,
        { provide: SelfExclusionConfig, deps: [LazyClientConfigService], useFactory: selfExclusionFactory },
        registerLazyDslOnModuleInit(SelfExclusionDslValuesProvider),
        runOnFeatureInit(SelfExclusionBootstrapService),
    ];
}
