import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { InactiveBootstrapService } from './inactive-bootstrap.service';
import { InactiveConfig, configFactory } from './inactive.client-config';
import { InactiveService } from './inactive.service';

export function provide() {
    return [
        { provide: InactiveConfig, useFactory: configFactory, deps: [LazyClientConfigService] },
        InactiveService,
        runOnFeatureInit(InactiveBootstrapService),
    ];
}
