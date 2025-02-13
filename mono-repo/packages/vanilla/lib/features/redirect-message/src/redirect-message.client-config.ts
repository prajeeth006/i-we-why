import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnRedirectMessage', product: ClientConfigProductName.SF })
@Injectable()
export class RedirectMessageConfig extends LazyClientConfigBase {
    currentLabel: string;
    redirectLabel: string;
    url: string;
    content: ViewTemplate;
}

export function redirectMessageConfigFactory(service: LazyClientConfigService) {
    return service.get(RedirectMessageConfig);
}
