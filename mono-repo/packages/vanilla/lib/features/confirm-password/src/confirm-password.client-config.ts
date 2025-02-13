import { Injectable } from '@angular/core';

import { ClientConfigProductName, LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig({ key: 'vnConfirmPassword', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [LazyClientConfigService],
    useFactory: confirmPasswordFactory,
})
export class ConfirmPasswordConfig extends LazyClientConfigBase {
    isEnabled: boolean;
    redirectUrl: string;
}

export function confirmPasswordFactory(service: LazyClientConfigService) {
    return service.get(ConfirmPasswordConfig);
}
