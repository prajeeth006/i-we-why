import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from './client-config.decorator';
import { ClientConfigService } from './client-config.service';

/**
 * @stable
 */
@ClientConfig({ key: 'vnCommonMessages', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: configFactory,
})
export class CommonMessages {
    public static GeneralValidationErrorKey = 'GeneralValidationError';
    [key: string]: string;
}

export function configFactory(service: ClientConfigService) {
    return service.get(CommonMessages);
}
