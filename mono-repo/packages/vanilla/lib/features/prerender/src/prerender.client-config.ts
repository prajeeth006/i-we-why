import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnPrerender', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: prerenderFactory,
    deps: [LazyClientConfigService],
})
export class PrerenderConfig extends LazyClientConfigBase {
    maxWaitingTime: number;
}

export function prerenderFactory(service: LazyClientConfigService) {
    return service.get(PrerenderConfig);
}
