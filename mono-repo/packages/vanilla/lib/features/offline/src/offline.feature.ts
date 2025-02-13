import { runOnFeatureInit } from '@frontend/vanilla/core';

import { OfflineBootstrapService } from './offline-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(OfflineBootstrapService)];
}
