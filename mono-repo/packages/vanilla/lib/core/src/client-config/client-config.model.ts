import { ClientConfigProductName } from './client-config.decorator';

export const VN_PAGE_KEY = 'vnPage';
export const VN_PRODUCTS_KEY = 'vnProducts';
export const HA_APP_KEY = 'haApp';
/**
 * Alias for diffs emitted by {@link ClientConfigService#updates}.
 *
 * @stable
 */
export type ClientConfigDiff = Map<string, Map<string, any>>;

/**
 * Options for {@link ClientConfig} and {@link LazyClientConfig}.
 *
 * @param key key corresponds to the name from the server
 * @param product indicates from where config will be fetched. For {@link ClientConfig} it is optional and default value is host, for {@link LazyClientConfig} is mandatory
 * @param realod indicates if client config will be reloaded on login
 *
 * @experimental
 */
export type ClientConfigOptions = {
    key: string;
    product?: ClientConfigProductName;
    reload?: boolean;
};

/**
 * Options for {@link ClientConfigService#update}.
 *
 * @stable
 */
export interface UpdateOptions {
    /**
     * If false, deletes existing config properties if not specified in the update object. Default is `true`.
     */
    keepExistingProperties: boolean;
}
