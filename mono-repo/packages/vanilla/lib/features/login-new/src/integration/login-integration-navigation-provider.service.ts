import { Injectable } from '@angular/core';

import { OnLoginNavigationProvider } from '@frontend/vanilla/core';

import { LoginIntegrationService } from './login-integration.service';

@Injectable()
export class LoginIntegrationNavigationProvider implements OnLoginNavigationProvider {
    constructor(private loginIntegrationService: LoginIntegrationService) {}

    async onLoginNavigation(): Promise<any> {
        await this.loginIntegrationService.init();

        return Promise.resolve();
    }
}
