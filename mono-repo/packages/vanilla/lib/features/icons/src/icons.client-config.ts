import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

import { IconsModel } from './icons-model';

@LazyClientConfig({ key: 'vnIconset', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: iconsFactory,
})
export class IconsetConfig extends LazyClientConfigBase {
    iconItems: IconsModel[];
}

export function iconsFactory(service: LazyClientConfigService) {
    return service.get(IconsetConfig);
}
