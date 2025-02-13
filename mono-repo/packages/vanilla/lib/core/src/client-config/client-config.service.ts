import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Type, inject } from '@angular/core';

import { forOwn, groupBy, isEqual } from 'lodash-es';
import { Observable, Subject, firstValueFrom } from 'rxjs';

import { WINDOW } from '../browser/window/window.token';
import { LANG_ID } from '../languages/languages.tokens';
import { ClientConfigProductName, getClientConfigProperties } from './client-config.decorator';
import { ClientConfigDiff, ClientConfigOptions, HA_APP_KEY, UpdateOptions, VN_PAGE_KEY, VN_PRODUCTS_KEY } from './client-config.model';

/**
 * @whatItDoes Provides a way to load (from api) or update (manually) client configuration
 *
 * @howToUse
 *
 * ```
 * clientConfigService.updates.subscribe((diff: Map<string, Map<string, any>>) => {
 *     if(diff.has(getClientConfigProperties(UserConfig).key) {
 *         let userConfig = diff.get(getClientConfigProperties(UserConfig).key);
 *         if(userConfig.has('balance')){
 *             // some logic
 *         }
 *     }
 * })
 *
 * clientConfigService.reload([UserConfig]);
 *
 * let updateObj = {};
 * updateObj[getClientConfigProperties(UserConfig).key] = {
 *     isAuthenticated: true
 * }
 * clientConfigService.update(updateObj);
 * ```
 *
 * @description
 *
 * Use this service when you need to update client configuration. This is needed for example
 * when user logs in. You have 2 options:
 *  - call `reload()` method and specify config names that you want to reload
 *  - use `update()` method and specify your own data
 *
 * `reload()` method return a promise that resolves once the config is updated.
 *
 * You can watch for changes on `updates` observable. It will get with diff of changed configs and properties as a parameter.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ClientConfigService {
    private configUpdates = new Subject<ClientConfigDiff>();
    private configOrigins = new Map<string, string>();
    private readonly configuration: { [key: string]: any };
    private readonly clientConfigApiPath: string;
    private allowed_paths_regex: RegExp | undefined;
    readonly #window = inject(WINDOW);
    private DEFAULT_PRODUCTS = [ClientConfigProductName.SF, ClientConfigProductName.HOST];

    constructor(
        private httpClient: HttpClient,
        @Inject(LANG_ID) lang: string,
    ) {
        this.configuration = this.#window['clientConfig'] ?? {};
        this.clientConfigApiPath = `${lang}/api/clientconfig`;
        this.setOrigins(this.configuration, this.clientConfigApiPath);
        this.allowed_paths_regex = this.hostAppConfig ? new RegExp(this.hostAppConfig.allowedPaths.join('|'), 'i') : undefined;
    }

    get updates(): Observable<ClientConfigDiff> {
        return this.configUpdates;
    }

    private get page(): any {
        return this.configuration[VN_PAGE_KEY];
    }

    private get products(): any {
        return this.configuration[VN_PRODUCTS_KEY];
    }

    private get hostAppConfig(): any {
        return this.configuration[HA_APP_KEY];
    }

    /**
     * Loads client configs from the specified endpoint.
     */
    async load(clientConfigEndpoint: string, configTypes?: Type<any>[]): Promise<Map<any, any>> {
        const endpoint = `${clientConfigEndpoint}/${this.clientConfigApiPath}`;
        let configs: ClientConfigOptions[] | undefined;

        if (configTypes) {
            configs = this.loadConfigWithProperties(configTypes);
        }

        const alreadyLoadedConfigs = configs?.filter((c: ClientConfigOptions) => this.configuration.hasOwnProperty(c.key));

        if (alreadyLoadedConfigs?.length) {
            configs = configs?.filter((c: ClientConfigOptions) => !alreadyLoadedConfigs.includes(c));

            if (!configs?.length) {
                return Promise.resolve(new Map());
            }
        }

        // group configs by product
        const configsByProduct = groupBy(configs, (n: ClientConfigOptions) => n.product);
        const promises: Promise<any>[] = [];

        if (Object.keys(configsByProduct).length > 0) {
            // try to load configs associated with product
            forOwn(configsByProduct, (productConfigs: ClientConfigOptions[], product: string) => {
                promises.push(
                    this.loadFromApi(
                        endpoint,
                        <ClientConfigProductName>product,
                        productConfigs.map((c: ClientConfigOptions) => c.key),
                    ),
                );
            });
        } else {
            promises.push(this.loadFromApi(endpoint));
        }

        let data: any;
        await Promise.all(promises).then((response: any[]) => (data = Object.assign({}, ...response)));

        if (configs) {
            const missingConfigs: string[] = [];

            configs.forEach((c: ClientConfigOptions) => {
                if (!data.hasOwnProperty(c.key)) {
                    missingConfigs.push(c.key);
                }
            });

            if (missingConfigs.length) {
                throw new Error(
                    [
                        'Error loading client configs',
                        ...missingConfigs.map((c: string) => ` - Client config ${c} was requested but was missing from the response`),
                    ].join('\n'),
                );
            }
        }

        this.setOrigins(data, endpoint);

        return this.merge(data);
    }

    /**
     * Loads eager client configs from the specified product.
     */
    async loadProduct(product: ClientConfigProductName): Promise<Map<any, any>> {
        const data = await this.loadFromApi(this.clientConfigApiPath, product);
        this.setOrigins(data, this.clientConfigApiPath);
        return this.merge(data);
    }

    /**
     * Reloads the specified client configs from the server.
     */
    async reload(configTypes: Type<any>[], reloadOnLogin?: boolean): Promise<Map<any, any>> {
        if (!configTypes || configTypes.length === 0) {
            return Promise.resolve(new Map());
        }

        const configs: ClientConfigOptions[] = this.loadConfigWithProperties(configTypes);
        // group configs by origin
        const configsGroupedByOrigin = groupBy(configs, (n: ClientConfigOptions) => this.configOrigins.get(n.key) ?? this.clientConfigApiPath);
        const promises: Promise<any>[] = [];

        // try to load configs associated with origin
        forOwn(configsGroupedByOrigin, (configsByOrigin: ClientConfigOptions[], origin: string) => {
            // group configs by product
            const configsGroupedByProduct = groupBy(configsByOrigin, (n: ClientConfigOptions) => n.product);
            // try to load configs associated with product
            forOwn(configsGroupedByProduct, (productConfigs: ClientConfigOptions[], product: string) => {
                if (this.shouldReloadForProduct(<ClientConfigProductName>product)) {
                    promises.push(
                        this.loadFromApi(
                            origin,
                            <ClientConfigProductName>product,
                            productConfigs.map((c: ClientConfigOptions) => c.key),
                            reloadOnLogin,
                        ),
                    );
                }
            });
        });

        return Promise.all(promises).then((data: any[]) => this.merge(Object.assign({}, ...data)));
    }

    reloadOnLogin(configsToReload: Type<any>[] = []): Promise<Map<any, any>> | Promise<void> {
        let configsToReloadOnLogin = [...configsToReload, ...(this.#window['configsToReloadOnLogin'] ?? [])];

        return configsToReloadOnLogin ? this.reload(configsToReloadOnLogin, true) : Promise.resolve();
    }

    /**
     * Manually updates the specified configs.
     */
    update(configs: any, options?: UpdateOptions): Map<string, Map<string, any>> {
        const opts = Object.assign({ keepExistingProperties: true }, options);

        return this.merge(configs, opts.keepExistingProperties);
    }

    /**
     * Gets a client config.
     */
    get<T>(model: Type<T>): T {
        const configKey = getClientConfigProperties(model).key;
        const config = this.configuration[configKey];

        if (config == null) {
            throw new Error(`Config ${configKey} does not exist or is not loaded yet.`);
        }

        if (config.isFailed) {
            // eslint-disable-next-line no-console
            console.error(`${configKey} config failed to load.`);
        }

        return config;
    }

    /**
     * Update a client config.
     */
    updateConfig(config: ClientConfigDiff) {
        this.configUpdates.next(config);
    }

    private shouldReloadForProduct(product: ClientConfigProductName): Boolean {
        const window = <any>this.#window;
        if (window.SINGLE_DOMAIN !== '1' || this.DEFAULT_PRODUCTS.includes(product)) {
            return true;
        }

        const path = this.hostAppConfig?.productPathMap[product ?? ''] ?? '';
        return !!this.allowed_paths_regex && this.allowed_paths_regex.test(path);
    }

    private loadConfigWithProperties(configTypes: Type<any>[]): ClientConfigOptions[] {
        return configTypes.map((t: Type<any>) => {
            const config = getClientConfigProperties(t);

            return { key: config.key, product: config.product };
        });
    }

    private async loadFromApi(
        endpoint: string,
        product?: ClientConfigProductName,
        configNames?: string[],
        reloadOnLogin?: boolean,
    ): Promise<Object | undefined> {
        if (
            product &&
            this.products[product] &&
            (this.products[product].enabled || product === ClientConfigProductName.SF) &&
            this.products[product].apiBaseUrl
        ) {
            endpoint = this.products[product].apiBaseUrl + (endpoint.startsWith('/') ? endpoint : `/${endpoint}`);
        }
        if (configNames) {
            endpoint += '/partial';
        }

        const headers =
            product && (this.products[product].enabled || product === ClientConfigProductName.SF)
                ? { [`x-bwin-${product}-api`]: this.page.environment }
                : {};
        if (reloadOnLogin) headers['X-Reload-On-Login'] = 1;

        return firstValueFrom(this.httpClient.get(endpoint, { ...(configNames ? { params: { configNames } } : {}), headers, withCredentials: true }));
    }

    private merge(configs: any, keepExisting: boolean = false): Map<string, Map<string, any>> {
        const diffs = new Map<string, Map<string, any>>();

        if (!configs) {
            return diffs;
        }

        forOwn(configs, (config: any, name: string) => {
            if (name.startsWith('__')) {
                return;
            }

            const currentConfig = this.configuration[name];

            if (config) {
                const diff = new Map<string, any>();

                if (currentConfig) {
                    forOwn(config, (value: any, prop: string) => {
                        if (!isEqual(currentConfig[prop], value)) {
                            currentConfig[prop] = value;
                            diff.set(prop, value);
                        }
                    });

                    if (!keepExisting) {
                        Object.keys(currentConfig).forEach((prop: any) => {
                            if (!config.hasOwnProperty(prop)) {
                                delete currentConfig[prop];
                                diff.set(prop, undefined);
                            }
                        });
                    }
                } else {
                    this.configuration[name] = config;

                    forOwn(config, (value: any, prop: string) => {
                        diff.set(prop, value);
                    });
                }

                if (diff.size > 0) {
                    diffs.set(name, diff);
                }
            }
        });

        if (diffs.size > 0) {
            this.configUpdates.next(diffs);
        }

        return diffs;
    }

    private setOrigins(data: any, origin: string) {
        forOwn(data, (_, name: string) => {
            this.configOrigins.set(name, origin);
        });
    }
}
