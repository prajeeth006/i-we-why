import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    MenuContentItem,
    ViewTemplate,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnPlayerActiveWager', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: playerActiveWagerConfigFactory,
    deps: [LazyClientConfigService],
})
export class PlayerActiveWagerConfig extends LazyClientConfigBase {
    content: ViewTemplate;
    gotItCta: MenuContentItem;
}

export function playerActiveWagerConfigFactory(service: LazyClientConfigService): PlayerActiveWagerConfig {
    return service.get(PlayerActiveWagerConfig);
}
