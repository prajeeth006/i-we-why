import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnValueTicket', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: valueTicketConfigFactory,
})
export class ValueTicketConfig extends LazyClientConfigBase {
    isEnabled: boolean;
    overlays: ViewTemplate[];
}

export function valueTicketConfigFactory(service: LazyClientConfigService) {
    return service.get(ValueTicketConfig);
}
