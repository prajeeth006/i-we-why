import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnDate', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: configFactory,
})
export class DateConfig extends LazyClientConfigBase {
    showMonthFirst: boolean;
    showMonthLongName: boolean;
}

export function configFactory(service: LazyClientConfigService): DateConfig {
    return service.get(DateConfig);
}
