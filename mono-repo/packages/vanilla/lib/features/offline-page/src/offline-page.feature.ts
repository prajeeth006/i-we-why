import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { OfflinePageBootstrapService } from './offline-page-bootstrap.service';
import { OfflinePageConfig, offlinePageConfigFactory } from './offline-page.client-config';

export function provide() {
    return [
        { provide: OfflinePageConfig, useFactory: offlinePageConfigFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(OfflinePageBootstrapService),
    ];
}
