import { MENU_COUNTERS_PROVIDER, runOnFeatureInit } from '@frontend/vanilla/core';

import { InboxBootstrapService } from './inbox-bootstrap.service';
import { InboxMenuCountersProvider } from './inbox-menu-counters-provider';

export function provide() {
    return [{ provide: MENU_COUNTERS_PROVIDER, useClass: InboxMenuCountersProvider, multi: true }, runOnFeatureInit(InboxBootstrapService)];
}
