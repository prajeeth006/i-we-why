import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnClock', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: clockConfigFactory,
    deps: [LazyClientConfigService],
})
export class ClockConfig extends LazyClientConfigBase {
    slotName: string;
    dateTimeFormat: string;
    useWithTimeZone: boolean;
}

export function clockConfigFactory(service: LazyClientConfigService) {
    return service.get(ClockConfig);
}
