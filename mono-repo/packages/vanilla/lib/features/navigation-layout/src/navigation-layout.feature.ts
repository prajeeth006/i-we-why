import { runOnFeatureInit } from '@frontend/vanilla/core';

import { NavigationLayoutBootstrapService } from './navigation-layout-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(NavigationLayoutBootstrapService)];
}
