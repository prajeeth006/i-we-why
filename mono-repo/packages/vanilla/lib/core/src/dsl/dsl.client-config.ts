import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnDomainSpecificLanguage', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: dslConfigFactory,
})
export class DslConfig {
    defaultValuesUnregisteredProvider: { [key: string]: string | boolean | number };
}

export function dslConfigFactory(service: ClientConfigService) {
    return service.get(DslConfig);
}
