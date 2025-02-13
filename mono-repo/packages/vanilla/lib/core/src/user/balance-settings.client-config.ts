import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../client-config/client-config.decorator';
import { ClientConfigService } from '../client-config/client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnBalanceSettings', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: balanceSettingsConfigFactory,
})
export class BalanceSettingsConfig {
    lowThresholds: { [currency: string]: number };
}

export function balanceSettingsConfigFactory(service: ClientConfigService) {
    return service.get(BalanceSettingsConfig);
}
