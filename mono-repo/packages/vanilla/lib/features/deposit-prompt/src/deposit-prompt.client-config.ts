import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnDepositPrompt', product: ClientConfigProductName.SF })
@Injectable()
export class DepositPromptConfig extends LazyClientConfigBase {
    trigger: 'Login' | 'Always' | 'Off';
    repeatTime: number;
    condition: string;
}

export function depositPromptConfigFactory(service: LazyClientConfigService) {
    return service.get(DepositPromptConfig);
}
