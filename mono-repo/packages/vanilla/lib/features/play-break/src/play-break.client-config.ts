import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnPlayBreak', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: playBreakConfigFactory,
    deps: [LazyClientConfigService],
})
export class PlayBreakConfig extends LazyClientConfigBase {
    templates: { [key: string]: ViewTemplateForClient };
}

export function playBreakConfigFactory(service: LazyClientConfigService): PlayBreakConfig {
    return service.get(PlayBreakConfig);
}
