import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from './client-config.decorator';
import { ClientConfigService } from './client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnAppInfo', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: appInfoConfigFactory,
})
export class AppInfoConfig {
    brand: string;
    frontend: string;
    product: string;
    channel: string;
}

export function appInfoConfigFactory(service: ClientConfigService) {
    return service.get(AppInfoConfig);
}
