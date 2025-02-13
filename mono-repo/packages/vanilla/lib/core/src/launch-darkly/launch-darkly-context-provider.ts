import { InjectionToken, Provider, Type, inject } from '@angular/core';

import { LDContext } from 'launchdarkly-js-client-sdk';

import { LaunchDarklyContextProviderService } from './launch-darkly-context-provider.service';

/**
 * @whatItDoes Providers contexts for LaunchDarkly.
 *
 * @howToUse
 *
 * ```
 * @Injectable
 * export class CustomLaunchDarklyContextProvider implements LaunchDarklyContextProvider {
 *     constructor() {
 *     }
 *
 *     getProviders(): LDContext {
 *         return {            
 device: {
 key: osName ?? 'device-os',
 kind: 'device',
 anonymous: false,                
 },              
 };
 *     }
 * }
 *
 * @provide
 *{ provide: LAUNCH_DARKLY_CONTEXT_PROVIDER, useClass: CustomLaunchDarklyContextProvider }
 * ```
 *
 * @stable
 */
export interface LaunchDarklyContextProvider {
    getProviders(): Promise<LDContext>;
}

/**
 * @whatItDoes Runs a lazy context provider that should be used to add new properties and reload the context.
 *
 * @stable
 */
export function runLaunchDarklyLazyContextProvider<T extends LaunchDarklyLazyContextProvider>(type: Type<T>): Provider {
    return [
        type,
        {
            provide: LAUNCH_DARKLY_LAZY_CONTEXT_PROVIDER,
            useExisting: type,
        },
    ];
}

/**
 * @whatItDoes Providers lazy contexts for LaunchDarkly.
 *
 * @howToUse
 *
 * ```
 * @Injectable
 * export class CustomLaunchDarklyContextProvider extends LaunchDarklyLazyContextProvider  {
 *     constructor() {
 *     }
 *
 *     getLazyContext(): Promise<LDContext> {
 *         return {
 *                kind: 'multi',
 *                textContext: {
 *                   key: osName ?? 'device-os',
 *                   kind: 'device',
 *                   anonymous: false,
 *                },
 *        };
 *     }
 * }
 *
 * @provide
 * runLaunchDarklyLazyContextProvider(GeolocationContextProvider)
 * ```
 *
 * @stable
 */
export abstract class LaunchDarklyLazyContextProvider {
    private readonly ldContextProviderService = inject(LaunchDarklyContextProviderService);

    async reloadContext() {
        this.ldContextProviderService.reloadContext(await this.getLazyContext());
    }

    abstract getLazyContext(): Promise<LDContext>;
}

/**
 * @stable
 */
export const LAUNCH_DARKLY_CONTEXT_PROVIDER = new InjectionToken<LaunchDarklyContextProvider>('launch-darkly-context-provider');
export const LAUNCH_DARKLY_LAZY_CONTEXT_PROVIDER = new InjectionToken<LaunchDarklyLazyContextProvider>('launch-darkly-lazy-context-provider');
