import { LazyClientConfigService, MENU_COUNTERS_PROVIDER, runOnFeatureInit } from '@frontend/vanilla/core';

import { OffersMenuCountersProvider } from './offer-menu-counters-provider';
import { OffersBootstrapService } from './offers-bootstrap.service';
import { OffersConfig, offersConfigFactory } from './offers.client-config';

export function provide() {
    return [
        { provide: OffersConfig, useFactory: offersConfigFactory, deps: [LazyClientConfigService] },
        { provide: MENU_COUNTERS_PROVIDER, useClass: OffersMenuCountersProvider, multi: true },
        runOnFeatureInit(OffersBootstrapService),
    ];
}
