import { Injectable } from '@angular/core';

import {
    ClientConfigProductName,
    LazyClientConfig,
    LazyClientConfigBase,
    LazyClientConfigService,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';

/**
 * @stable
 */
@LazyClientConfig({ key: 'vnPlayerGamingDeclaration', product: ClientConfigProductName.SF })
@Injectable()
export class PlayerGamingDeclarationConfig extends LazyClientConfigBase {
    isEnabledCondition: string;
    content: ViewTemplateForClient;
}

export function playerGamingDeclarationConfigFactory(service: LazyClientConfigService) {
    return service.get(PlayerGamingDeclarationConfig);
}
