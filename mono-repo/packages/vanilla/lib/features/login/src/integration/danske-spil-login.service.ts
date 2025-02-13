import { Injectable } from '@angular/core';

import { AutoLoginParameters, SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable, firstValueFrom } from 'rxjs';
import { map, skipUntil } from 'rxjs/operators';

import { LoginIntegrationConfig } from './login-integration.client-config';

@Injectable({ providedIn: 'root' })
export class DanskeSpilLoginService {
    constructor(
        private apiService: SharedFeaturesApiService,
        private config: LoginIntegrationConfig,
    ) {}

    isSessionActive(): Observable<boolean> {
        return this.apiService.jsonp(this.config.options.activeSessionUrl!, 'callback').pipe(
            skipUntil(this.config.whenReady),
            map((response) => {
                const activeSession = JSON.parse(response.toString());

                return activeSession.isSessionActive === 'true';
            }),
        );
    }

    getLoginParameters(): Observable<AutoLoginParameters> {
        return this.apiService.jsonp(this.config.options.relayUrl || '', 'callback').pipe(
            skipUntil<Record<string, any>>(this.config.whenReady),
            map(
                (credentials: Record<string, string>) =>
                    <AutoLoginParameters>{ username: credentials['loginId'], password: credentials['assertionId'] },
            ),
        );
    }

    logout(): Promise<boolean> {
        return firstValueFrom(
            this.apiService.jsonp(this.config.options.logoutUrl!, 'callback').pipe(
                skipUntil(this.config.whenReady),
                map((response: Object) => {
                    const info = JSON.parse(response.toString());

                    return info.logoutSuccess === 'true';
                }),
            ),
        );
    }
}
