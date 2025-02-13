import { runOnFeatureInit } from '@frontend/vanilla/core';

import { HeaderBarBootstrapService } from './header-bar-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(HeaderBarBootstrapService)];
}
