import { Injectable, Type } from '@angular/core';

import { Observable, ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { getClientConfigProperties } from '../client-config/client-config.decorator';
import { ClientConfigDiff } from '../client-config/client-config.model';
import { ClientConfigService } from '../client-config/client-config.service';

/**
 * @whatItDoes Base class for lazy client configs.
 *
 * @stable
 */
export class LazyClientConfigBase {
    whenReady: Observable<void>;
    isConfigReady: boolean;
}

class LazyClientConfig {
    private isLoaded: boolean = false;
    private isLazyLoading: boolean;
    private loadedStream: ReplaySubject<void> = new ReplaySubject(1);
    private readonly proxy: any;
    private readonly clientConfigKey: string;

    constructor(
        private clientConfigService: ClientConfigService,
        public type: Type<any>,
    ) {
        this.clientConfigKey = getClientConfigProperties(type).key;

        clientConfigService.updates.pipe(first((e: ClientConfigDiff) => e.has(this.clientConfigKey))).subscribe(() => {
            this.isLoaded = true;
            this.loadedStream.next();
        });

        this.proxy = new Proxy(
            {},
            {
                get: (_, name: string) => {
                    switch (name) {
                        // Angular checks constructor when creating the provider. Don't throw even when not ready yet.
                        case 'constructor':
                            return undefined;
                        // Angular checks ngOnDestroy when creating the provider. Don't throw even when not ready yet.
                        case 'ngOnDestroy':
                            return undefined;
                        case 'whenReady':
                            return this.whenReady();
                        case 'isConfigReady':
                            return this.isLoaded;
                        default:
                            return this.getProperty(name);
                    }
                },
            },
        );
    }

    get config(): any {
        return this.proxy;
    }

    whenReady(): ReplaySubject<void> {
        if (!this.isLazyLoading) {
            this.isLazyLoading = true;
            this.clientConfigService.load('', [this.type]).then(() => {
                `${this.clientConfigKey} loaded.......`;
            });
        }

        return this.loadedStream;
    }

    private getProperty(name: string) {
        if (this.isLoaded) {
            return this.clientConfigService.get(this.type)[name];
        }

        throw new Error(
            `Lazy client config ${this.clientConfigKey} is not loaded yet, so it's property ${name} cannot be accessed. Subscribe to whenReady() observable to wait until it's loaded.`,
        );
    }
}

/**
 * @whatItDoes Provides access to lazy client configs and their metadata.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class LazyClientConfigService {
    private configs: Map<Type<any>, LazyClientConfig> = new Map();

    constructor(private clientConfigService: ClientConfigService) {}

    get<T>(configType: Type<T>): T {
        return this.getConfig(configType)?.config;
    }

    private getConfig(configType: Type<any>): LazyClientConfig | undefined {
        if (!this.configs.has(configType)) {
            const config = new LazyClientConfig(this.clientConfigService, configType);
            this.configs.set(configType, config);
        }

        return this.configs.get(configType);
    }
}
