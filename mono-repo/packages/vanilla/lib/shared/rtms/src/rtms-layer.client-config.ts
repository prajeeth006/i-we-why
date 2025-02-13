import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnRtmsLayer', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: configFactory,
})
export class RtmsLayerConfig extends LazyClientConfigBase {
    toastShowTime: number;
    toastShowInterval: number;
    casinoGameLaunchUrl: string;
    showCloseButtonOnBonusTeaser: boolean;
    bonusTeaserRedirectUrl: string;
    enableToastStacking: boolean;
    version: number;
}

export function configFactory(service: LazyClientConfigService) {
    return service.get(RtmsLayerConfig);
}
