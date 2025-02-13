import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName, ClientConfigService } from '@frontend/vanilla/core';

import { ValidationRuleSet } from './validation.models';

/**
 * @stable
 */
@ClientConfig({ key: 'vnValidation', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: configFactory,
})
export class ValidationConfig {
    regexList: { [name: string]: string };
    rules: { [name: string]: ValidationRuleSet };
    errorMapping: { [name: string]: string };
}

export function configFactory(service: ClientConfigService) {
    return service.get(ValidationConfig);
}
