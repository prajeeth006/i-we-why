import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

/** @stable */
@ClientConfig({ key: 'vnRememberMe', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: rememberMeConfigFactory,
})
export class RememberMeConfig {
    isEnabled: boolean;
    apiHost: string;
    skipRetryPaths: string[];
}

export function rememberMeConfigFactory(service: ClientConfigService) {
    return service.get(RememberMeConfig);
}
