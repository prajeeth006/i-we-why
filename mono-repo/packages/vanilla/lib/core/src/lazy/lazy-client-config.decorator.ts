import { ClientConfig } from '../client-config/client-config.decorator';
import { ClientConfigOptions } from '../client-config/client-config.model';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type ClientConfigOptionsWithProduct = WithRequired<ClientConfigOptions, 'product'>;

/**
 * @whatItDoes Decorates a class to be a model of a lazy client config.
 *
 * @param options correspond to {@link ClientConfigOptions}
 *
 * @howToUse
 *
 * ```
 * @LazyClientConfig({ key: 'prefixSomeConfig', product: ClientConfigProductName.SF })
 * export class SomeConfig extends LazyClientConfigBase {
 *     prop: string;
 * }
 * ```
 *
 * @stable
 */
export function LazyClientConfig(options: ClientConfigOptionsWithProduct) {
    return ClientConfig(options);
}
