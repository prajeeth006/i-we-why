import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnProductHomepages', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: configFactory,
})
export class ProductHomepagesConfig {
    sports: string;
    casino: string;
    portal: string;
    poker: string;
    bingo: string;
    promo: string;
    lottery: string;
    horseracing: string;
    dicegames: string;
    virtualsports: string;
}

export function configFactory(service: ClientConfigService) {
    return service.get(ProductHomepagesConfig);
}
