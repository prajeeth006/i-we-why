import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, MenuContentItem } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnJackpotWinner', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: jackpotWinnerConfigFactory,
    deps: [LazyClientConfigService],
})
export class JackpotWinnerConfig extends LazyClientConfigBase {
    content: MenuContentItem;
}

export function jackpotWinnerConfigFactory(service: LazyClientConfigService): JackpotWinnerConfig {
    return service.get(JackpotWinnerConfig);
}
