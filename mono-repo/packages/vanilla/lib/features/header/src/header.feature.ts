import { MENU_COUNTERS_PROVIDER, runOnFeatureInit } from '@frontend/vanilla/core';

import { AvatarMenuCountersProvider } from './avatar-menu-counters-provider';
import { HeaderBootstrapService } from './header-bootstrap.service';

export function provide() {
    return [
        {
            provide: MENU_COUNTERS_PROVIDER,
            useClass: AvatarMenuCountersProvider,
            multi: true,
        },

        runOnFeatureInit(HeaderBootstrapService),
    ];
}
