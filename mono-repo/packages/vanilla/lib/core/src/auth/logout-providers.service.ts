import { Injectable, InjectionToken, Provider, Type } from '@angular/core';

import { Logger } from '../logging/logger';

/**
 * @stable
 */
export enum LogoutStage {
    BEFORE_LOGOUT = 0,
    AFTER_LOGOUT = 1,
}

/**
 * @whatItDoes Application life cycle hook that is called when user is logged out.
 *
 * @description
 *
 * Services that implement this interface can be registered with `runOnLogout(Service)` to run
 * when user is logged out.
 *
 * @stable
 */
export interface OnLogoutProvider {
    onLogout(): Promise<any>;
    stage: LogoutStage;
}

/**
 * @stable
 */
export const ON_LOGOUT_PROVIDER = new InjectionToken<OnLogoutProvider[]>('vn-on-logout-provider');

/**
 * @whatItDoes Registers a provider to invoke `onLogout()` when the user is logged out.
 *
 * @stable
 */
export function runOnLogout<T extends OnLogoutProvider>(type: Type<T>): Provider[] {
    return [
        type,
        {
            provide: ON_LOGOUT_PROVIDER,
            multi: true,
            useExisting: type,
        },
    ];
}

/**
 * @whatItDoes Provides functionality related to logout providers
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LogoutProvidersService {
    private providers: OnLogoutProvider[] = [];

    constructor(private logger: Logger) {}
    /**
     * @whatItDoes Registers logout providers.
     */
    registerProviders(providers: OnLogoutProvider[]) {
        this.providers = this.providers.concat(providers);
    }

    /**
     * @whatItDoes Invokes all logout providers by order and resolves once all are finished.
     *
     */
    async invoke(stage: LogoutStage) {
        const handles = this.providers
            .filter((s) => s.stage === stage)
            .map((p) =>
                p.onLogout().catch((error: unknown) => this.logger.errorRemote(`Failed to execute onLogout of ${p.constructor?.name}.`, error)),
            );
        return await Promise.all(handles);
    }
}
