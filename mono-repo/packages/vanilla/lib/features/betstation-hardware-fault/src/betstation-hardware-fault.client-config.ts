import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnBestationHardwareFault', product: ClientConfigProductName.SF })
@Injectable()
export class BetstationHardwareFaultConfig extends LazyClientConfigBase {
    isEnabled: boolean;
    overlays: ViewTemplate[];
}

export function betstationHardwareFaultConfigFactory(service: LazyClientConfigService) {
    return service.get(BetstationHardwareFaultConfig);
}
