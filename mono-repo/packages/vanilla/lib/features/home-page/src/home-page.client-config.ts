import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnHomePage', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: configFactory,
    deps: [LazyClientConfigService],
})
export class HomePageConfig extends LazyClientConfigBase {
    isEnabledCondition: string;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(HomePageConfig);
}
