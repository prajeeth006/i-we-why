import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName, ClientConfigService } from '@frontend/vanilla/core';

/**
 * @stable
 */
@ClientConfig({ key: 'vnBadge', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    useFactory: badgeConfigFactory,
    deps: [ClientConfigService],
})
export class BadgeConfig {
    cssClass: string;
}

export function badgeConfigFactory(service: ClientConfigService) {
    return service.get(BadgeConfig);
}
