import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnDomainSpecificActions', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: domainSpecificActionsConfigFactory,
})
export class DomainSpecificActionsConfig extends LazyClientConfigBase {
    dslAction: string;
}

export function domainSpecificActionsConfigFactory(service: LazyClientConfigService) {
    return service.get(DomainSpecificActionsConfig);
}
