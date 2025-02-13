import { Injectable } from '@angular/core';

import { AutoLoginParameters, SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable, firstValueFrom, of } from 'rxjs';
import { map, skipUntil } from 'rxjs/operators';

import { LoginIntegrationConfig } from '../integration/login-integration.client-config';

@Injectable({ providedIn: 'root' })
export class DanskeSpilLoginService {
    constructor(
        private apiService: SharedFeaturesApiService,
        private config: LoginIntegrationConfig,
    ) {}

    isSessionActive(): Observable<boolean | Error> {
        return this.config.options.activeSessionUrl
            ? this.apiService.jsonp(this.config.options.activeSessionUrl, 'callback').pipe(
                  skipUntil(this.config.whenReady),
                  map((response: Object) => JSON.parse(<string>response).isSessionActive === 'true'),
              )
            : of(new Error('activeSessionUrl is not configured'));
    }

    getLoginParameters(): Observable<AutoLoginParameters | Error> {
        return this.config.options.relayUrl
            ? this.apiService.jsonp(this.config.options.relayUrl, 'callback').pipe(
                  skipUntil<Record<string, any>>(this.config.whenReady),
                  map(
                      (credentials: Record<string, string>) =>
                          <AutoLoginParameters>{ username: credentials['loginId'], password: credentials['assertionId'] },
                  ),
              )
            : of(new Error('relayUrl is not configured'));
    }

    logout(): Promise<boolean> {
        return this.config.options.logoutUrl
            ? firstValueFrom(
                  this.apiService.jsonp(this.config.options.logoutUrl, 'callback').pipe(
                      skipUntil(this.config.whenReady),
                      map((response: Object) => JSON.parse(<string>response).logoutSuccess === 'true'),
                  ),
              )
            : Promise.reject('logoutUrl is not configured');
    }
}
