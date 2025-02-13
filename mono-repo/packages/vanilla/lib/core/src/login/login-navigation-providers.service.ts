import { Injectable, InjectionToken, Provider, Type } from '@angular/core';

import { Logger } from '../logging/logger';

/**
 * @whatItDoes Application life cycle hook that is called when user is navigating to login page.
 *
 * @description
 *
 * Services that implement this interface can be registered with `runOnLogin(Service)` to run
 * when user is logging in.
 *
 * @stable
 */
export interface OnLoginNavigationProvider {
    onLoginNavigation(): Promise<any>;
}

/**
 * @stable
 */
export const ON_LOGIN_NAVIGATION_PROVIDER = new InjectionToken<OnLoginNavigationProvider>('vn-on-login-navigation-provider');

/**
 * @whatItDoes Registers a provider to invoke `onLoginNavigation()` when the user is navigating to login page.
 *
 * @stable
 */
export function runOnLoginNavigation<T extends OnLoginNavigationProvider>(type: Type<T>): Provider[] {
    return [
        type,
        {
            provide: ON_LOGIN_NAVIGATION_PROVIDER,
            multi: true,
            useExisting: type,
        },
    ];
}

/**
 * @whatItDoes Provides functionality related to login navigation providers
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LoginNavigationProvidersService {
    private providers: OnLoginNavigationProvider[] = [];

    constructor(private logger: Logger) {}
    /**
     * @whatItDoes Registers login navigation providers.
     */
    registerProviders(providers: OnLoginNavigationProvider[]) {
        this.providers = this.providers.concat(providers);
    }

    /**
     * @whatItDoes Invokes all login navigation providers by order and resolves once all are finished.
     *
     */
    async invoke() {
        const handles = this.providers.map((p) =>
            p
                .onLoginNavigation()
                .catch((error: unknown) => this.logger.errorRemote(`Failed to execute onLoginNavigation of ${p.constructor?.name}.`, error)),
        );
        return await Promise.all(handles);
    }
}
