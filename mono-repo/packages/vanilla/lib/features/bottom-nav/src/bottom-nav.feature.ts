import { runOnFeatureInit } from '@frontend/vanilla/core';

import { BottomNavBootstrapService } from './bottom-nav-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(BottomNavBootstrapService)];
}
