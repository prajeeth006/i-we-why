import { LazyClientConfigService, runOnFeatureInit } from '@frontend/vanilla/core';

import { BetstationHardwareFaultBootstrapService } from './betstation-hardware-fault-bootstrap.service';
import { BetstationHardwareFaultConfig, betstationHardwareFaultConfigFactory } from './betstation-hardware-fault.client-config';
import { BetstationHardwareFaultService } from './betstation-hardware-fault.service';

export function provide() {
    return [
        BetstationHardwareFaultService,
        { provide: BetstationHardwareFaultConfig, useFactory: betstationHardwareFaultConfigFactory, deps: [LazyClientConfigService] },
        runOnFeatureInit(BetstationHardwareFaultBootstrapService),
    ];
}
