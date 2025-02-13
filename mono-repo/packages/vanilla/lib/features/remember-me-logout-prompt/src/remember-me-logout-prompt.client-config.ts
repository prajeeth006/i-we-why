import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService, ViewTemplate } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnRememberMeLogoutPrompt', product: ClientConfigProductName.SF })
@Injectable()
export class RememberMeLogoutPromptConfig extends LazyClientConfigBase {
    content: ViewTemplate;
}

export function rememberMeLogoutProntConfigFactory(service: LazyClientConfigService) {
    return service.get(RememberMeLogoutPromptConfig);
}
