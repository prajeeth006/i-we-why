import { InjectionToken, Provider, Type } from '@angular/core';

/**
 * @stable
 */
export const FEATURE_INIT_PROVIDER = new InjectionToken<OnFeatureInit>('vn-feature-init-provider');

/**
 * @whatItDoes Represents a feature initializer.
 *
 * @description
 *
 * Services that implement this interface can be registered with `runOnFeatureInit(Service)` and will be invoked during feature load.
 *
 * @experimental
 */
export interface OnFeatureInit {
    onFeatureInit(): void;
}

/**
 * @whatItDoes Registers a provider to be invoked during feature initialization.
 *
 * @stable
 */
export function runOnFeatureInit<T extends OnFeatureInit>(type: Type<T>): Provider[] {
    return [
        type,
        {
            provide: FEATURE_INIT_PROVIDER,
            multi: true,
            useExisting: type,
        },
    ];
}
