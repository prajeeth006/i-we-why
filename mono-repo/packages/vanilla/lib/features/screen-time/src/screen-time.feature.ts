import { LazyClientConfigService, runOnFeatureInit, runOnLogout } from '@frontend/vanilla/core';

import { ScreenTimeBootstrapService } from './screen-time-bootstrap.service';
import { ScreenTimeBrowserService } from './screen-time-browser.service';
import { ScreenTimeBeforeLogoutProvider } from './screen-time-logout-provider';
import { ScreenTimeResourcesService } from './screen-time-resource.service';
import { ScreenTimeConfig, screenTimeConfigFactory } from './screen-time.client-config';

export function provide() {
    return [
        ScreenTimeResourcesService,
        ScreenTimeBrowserService,
        { provide: ScreenTimeConfig, useFactory: screenTimeConfigFactory, deps: [LazyClientConfigService] },
        runOnLogout(ScreenTimeBeforeLogoutProvider),
        runOnFeatureInit(ScreenTimeBootstrapService),
    ];
}
