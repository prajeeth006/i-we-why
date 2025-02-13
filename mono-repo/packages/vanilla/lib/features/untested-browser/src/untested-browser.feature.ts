import { runOnFeatureInit } from '@frontend/vanilla/core';

import { UntestedBrowserBootstrapService } from './untested-browser-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(UntestedBrowserBootstrapService)];
}
