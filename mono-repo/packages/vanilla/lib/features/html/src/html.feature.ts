import { runOnFeatureInit } from '@frontend/vanilla/core';

import { HtmlBootstrapService } from './html-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(HtmlBootstrapService)];
}
