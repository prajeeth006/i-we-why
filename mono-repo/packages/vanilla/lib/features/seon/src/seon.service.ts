import { Injectable } from '@angular/core';

import { LocalStoreKey, Logger, SessionStoreService } from '@frontend/vanilla/core';
import seon, { SDKOptions } from '@seontechnologies/seon-javascript-sdk';
import { firstValueFrom } from 'rxjs';

import { SeonConfig } from './seon.client-config';

/**
 * @whatItDoes Provides utility functions for the seon fraud protection using seon.
 *
 * @description
 *
 * # Overview
 * On bootstrapping a seon session is started by sending a POST containing the seon session key generated on the server.
 * The corresponding DynaCon configuration can be found under the name VanillaFramework.Web.Seon.
 *
 * The seon session key is then stored in session storage from where it can be retrieved using {@link SeonService#getSessionKey SeonService.getSessionKey}.
 * The seon session key can then be used for attaching it to requests to the backend.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class SeonService {
    constructor(
        private seonConfig: SeonConfig,
        private sessionStorage: SessionStoreService,
        private logger: Logger,
    ) {}

    /** Gets the SEON session key or empty in a promise. */
    async getSessionKey(): Promise<string> {
        try {
            this.logger.info('Waiting for SEON configuration to be ready...');
            await firstValueFrom(this.seonConfig.whenReady);

            if (this.seonConfig.enabled) {
                let sessionKey = this.sessionStorage.get<string>(LocalStoreKey.SeonSessionKey) || '';
                if (!sessionKey) {
                    sessionKey = await this.initializeSeon(this.seonConfig.configParams);
                    this.sessionStorage.set(LocalStoreKey.SeonSessionKey, sessionKey);
                }
                return Promise.resolve(sessionKey);
            }
            return Promise.resolve('');
        } catch (error) {
            this.logger.error('Error while getting SEON session key:', error);
            return Promise.resolve('');
        }
    }

    /** Initialize SEON with configuration */
    private async initializeSeon(configParams: SDKOptions): Promise<string> {
        seon.init();
        const sessionKey = await seon.getSession(configParams ?? {});
        return sessionKey;
    }
}
