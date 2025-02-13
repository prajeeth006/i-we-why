import { Type } from '@angular/core';

import { ClientConfigOptions } from './client-config.model';

export const CLIENT_CONFIG = '__clientconfig__';

/**
 * @whatItDoes predefined enum of products from where config will be fetched.
 *
 * @experimental
 */
export enum ClientConfigProductName {
    BINGO = 'bingo',
    MOKABINGO = 'mokabingo',
    CASINO = 'casino',
    LOTTO = 'lotto',
    HORSERACING = 'horseracing',
    ESPORTS = 'esports',
    HOST = 'host',
    POKER = 'poker',
    PORTAL = 'portal',
    PROMO = 'promo',
    ENGAGE = 'engagement',
    SF = 'sf',
    SPORTS = 'sports',
    VIRTUALSPORTS = 'virtualsports',
    CORALSPORTS = 'coralsports',
    PAYMENTS = 'payments',
}

const defaultClientConfigOptions: ClientConfigOptions = {
    product: ClientConfigProductName.HOST,
    key: '',
};

/**
 * @whatItDoes Decorates a class to be a model of a client config.
 *
 * @param options correspond to {@link ClientConfigOptions}
 *
 * @howToUse
 *
 * ```
 * @ClientConfig({ key: 'prefixSomeConfig', product: ClientConfigProductName.SF })
 * export class SomeConfig {
 *     prop: string;
 * }
 * ```
 *
 * @stable
 */
export function ClientConfig(options: ClientConfigOptions) {
    options = { ...defaultClientConfigOptions, ...options };
    return function (cls: Type<any>) {
        if (options?.reload) {
            if (!(window as any).configsToReloadOnLogin) {
                (window as any).configsToReloadOnLogin = [cls];
            } else {
                (window as any).configsToReloadOnLogin.push(cls);
            }
        }
        Object.defineProperty(cls, CLIENT_CONFIG, { value: options });
    };
}

/**
 * @whatItDoes Retrieves the client config properties set by {@link ClientConfig} decorator from a type.
 *
 * @howToUse
 *
 * ```
 * @ClientConfig({ key: 'prefixSomeConfig', product: ClientConfigProductName.SF })
 * export class SomeConfig {
 *     prop: string;
 * }
 *
 * getClientConfigProperties(SomeConfig).key // 'prefixSomeConfig'
 * ```
 *
 * @stable
 */
export function getClientConfigProperties(model: Type<any>) {
    return (model as any)[CLIENT_CONFIG];
}
