import { runOnFeatureInit } from '@frontend/vanilla/core';

import { SmartBannerBootstrapService } from './smart-banner-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(SmartBannerBootstrapService)];
}
