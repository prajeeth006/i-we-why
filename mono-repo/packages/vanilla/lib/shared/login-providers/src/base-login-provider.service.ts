import { DynamicScriptsService, LoginProviderProfile, ScriptOptions, TrackingService } from '@frontend/vanilla/core';
import { ProviderParameters } from '@frontend/vanilla/shared/login';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { AuthOptions, AuthResponse } from './login-providers.models';

/**
 * @protected
 */
export abstract class BaseLoginProviderService<T> {
    get loginResponse(): Observable<AuthResponse<T> | null> {
        return this.loginResponseSubject;
    }

    get profile(): Observable<LoginProviderProfile | null> {
        return this.profileSubject;
    }

    protected loginResponseSubject = new Subject<AuthResponse<T> | null>();
    protected profileSubject = new BehaviorSubject<LoginProviderProfile | null>(null);

    protected constructor(
        private dynamicScriptsService: DynamicScriptsService,
        private trackingService: TrackingService,
    ) {}

    protected async initSdk(typeofSdk: string, config: ProviderParameters, scriptOptions?: ScriptOptions): Promise<void> {
        return new Promise((resolve) => {
            if (typeofSdk === 'undefined' && config.sdkUrl && config.clientId) {
                this.dynamicScriptsService
                    .load(config.sdkUrl, {
                        async: true,
                        defer: true,
                        crossorigin: 'anonymous',
                        ...scriptOptions,
                    })
                    .then(() => resolve());
            } else {
                resolve();
            }
        });
    }

    protected trackSuccessLoginWithProvider(provider: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.LabelEvent': provider,
            'component.ActionEvent': 'success',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'not applicable',
            'component.EventDetails': 'direct login',
            'component.URLClicked': 'not applicable',
        });
    }

    protected abstract login(options: AuthOptions): void;

    protected abstract initProfile(config?: ProviderParameters): void;
}
