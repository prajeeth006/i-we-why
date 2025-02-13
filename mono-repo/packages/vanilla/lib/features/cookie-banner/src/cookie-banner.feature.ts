import { runOnFeatureInit } from '@frontend/vanilla/core';

import { CookieBannerBootstrapService } from './cookie-banner-bootstrap.service';
import { CookieBannerService } from './cookie-banner.service';

export function provide() {
    return [CookieBannerService, runOnFeatureInit(CookieBannerBootstrapService)];
}
