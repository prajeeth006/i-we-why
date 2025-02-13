import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnLastKnownProduct', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: configFactory,
})
export class LastKnownProductConfig {
    product: string;
    enabled: string;
    url: string;
}

export function configFactory(service: ClientConfigService) {
    return service.get(LastKnownProductConfig);
}
