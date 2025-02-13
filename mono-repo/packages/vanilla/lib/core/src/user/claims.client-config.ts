import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnClaims', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: claimsConfigFactory,
})
export class ClaimsConfig {
    [key: string]: string;
}

export function claimsConfigFactory(service: ClientConfigService) {
    return service.get(ClaimsConfig);
}
