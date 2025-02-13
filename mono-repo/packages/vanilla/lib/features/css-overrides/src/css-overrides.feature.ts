import { runOnFeatureInit } from '@frontend/vanilla/core';

import { CssOverridesBootstrapService } from './css-overrides-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(CssOverridesBootstrapService)];
}
