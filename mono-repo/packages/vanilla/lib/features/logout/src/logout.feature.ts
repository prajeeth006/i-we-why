import { LazyClientConfigService, runOnFeatureInit, runOnLogout } from '@frontend/vanilla/core';

import { LimitsLogoutProvider } from './limits.logout-provider';
import { LogoutBootstrapService } from './logout-bootstrap.service';
import { LogoutResourceService } from './logout-resource.service';
import { LogoutConfig, logoutConfigFactory } from './logout.client-config';
import { SessionSummaryLogoutProvider } from './session-summary.logout-provider';
import { StatsLogoutProvider } from './stats.logout-provider';

export function provide() {
    return [
        LogoutResourceService,
        { provide: LogoutConfig, useFactory: logoutConfigFactory, deps: [LazyClientConfigService] },
        runOnLogout(StatsLogoutProvider),
        runOnLogout(LimitsLogoutProvider),
        runOnLogout(SessionSummaryLogoutProvider),
        runOnFeatureInit(LogoutBootstrapService),
    ];
}
