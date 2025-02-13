import { InjectionToken, Provider, Type } from '@angular/core';

import { DslValuesProvider } from './dsl.models';

/**
 * @whatItDoes Registers a DSL provider to invoke after module is compiled.
 *
 * @stable
 */
export function registerDslOnModuleInit<T extends DslValuesProvider>(type: Type<T>): Provider[] {
    return [
        type,
        {
            provide: DSL_VALUES_PROVIDER,
            multi: true,
            useExisting: type,
        },
    ];
}

/**
 * @whatItDoes Registers a lazy DSL provider to invoke after module is compiled.
 *
 * @stable
 */
export function registerLazyDslOnModuleInit<T extends DslValuesProvider>(type: Type<T>): Provider[] {
    return [
        type,
        {
            provide: LAZY_DSL_VALUES_PROVIDER,
            multi: true,
            useExisting: type,
        },
    ];
}

/**
 * @description
 *
 * See {@link DslValuesProvider}
 *
 * @stable
 */
export const DSL_VALUES_PROVIDER = new InjectionToken<DslValuesProvider[]>('dsl-values-provider-token');

/**
 * @description
 *
 * See {@link DslValuesProvider}
 *
 * @stable
 */
export const LAZY_DSL_VALUES_PROVIDER = new InjectionToken<DslValuesProvider[]>('lazy-dsl-values-provider-token');
