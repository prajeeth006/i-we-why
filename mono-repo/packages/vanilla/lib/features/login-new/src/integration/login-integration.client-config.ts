import { Injectable } from '@angular/core';

import { LazyClientConfig, LazyClientConfigBase, LazyClientConfigService } from '@frontend/vanilla/core';

@LazyClientConfig('vnLoginIntegration')
@Injectable({
    providedIn: 'root',
    useFactory: loginIntegrationConfigFactory,
    deps: [LazyClientConfigService],
})
export class LoginIntegrationConfig extends LazyClientConfigBase {
    type: string;
    options: {
        activeSessionUrl?: string;
        loginUrl?: string;
        logoutUrl?: string;
        redirectAfterLogin: string;
        relayUrl?: string;
        standaloneLoginUrl: string;
        version?: number;
    };
}

export function loginIntegrationConfigFactory(service: LazyClientConfigService) {
    return service.get(LoginIntegrationConfig);
}
