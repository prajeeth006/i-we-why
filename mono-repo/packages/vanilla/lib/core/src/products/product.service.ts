import { Injectable, Injector, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { WINDOW } from '../browser/window/window.token';
import { ProductInfo, ProductsConfig } from './products.client-config';

/**
 * Metadata about the single domain app products provided by {@link ProductService}.
 *
 * @stable
 */
export class ProductMetadata {
    private _name: string;
    private _injector: Injector;
    private _apiBaseUrl: string;
    private _enabled: boolean;
    private _enabledProductApi: boolean;
    private _isRegistered: boolean;

    get name() {
        return this._name;
    }
    get apiBaseUrl() {
        return this._apiBaseUrl;
    }
    get isEnabled() {
        return this._enabled;
    }
    get isEnabledProductApi() {
        return this._enabledProductApi;
    }
    get isRegistered() {
        return this._isRegistered;
    }
    get isHost() {
        return this._name === 'host';
    }
    get injector() {
        this.requireRegistered();

        return this._injector;
    }

    constructor(product: string, productInfo: ProductInfo) {
        this._enabled = productInfo.enabled;
        this._enabledProductApi = productInfo.enabledProductApi;
        this._apiBaseUrl = productInfo.apiBaseUrl;
        this._name = product;
    }

    /** @internal */
    onRegister(options: { injector: Injector }) {
        this._injector = options.injector;
        this._isRegistered = true;
    }

    private requireRegistered() {
        if (!this.isRegistered) {
            throw new Error(`Product ${this.name} must be loaded to access the requested property.`);
        }
    }
}

/**
 * @whatItDoes Provides a way for a single domain app to register products and read metadata about them.
 *
 * @howToUse
 * ```
 * @NgModule()
 * export class SportsModule { // Module to be lazy loaded by the single domain app
 *     constructor(productService: ProductService, injector: Injector) {
 *         productService.register('sports', injector);
 *     }
 * }
 * ```
 *
 * The metadata are combine from [dynacon](https://admin.dynacon.prod.env.works/services/121971/features/126782) and the calls to `register`.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private static readonly DEFAULT_PRODUCT = 'host';

    private activeProduct: string = ProductService.DEFAULT_PRODUCT;
    private metadata = new Map<string, ProductMetadata>();
    productChanged = new Subject<ProductMetadata>();
    readonly #window = inject(WINDOW);

    get current() {
        return this.getMetadata(this.activeProduct);
    }

    get isSingleDomainApp() {
        const window = <any>this.#window;
        return window.SINGLE_DOMAIN === '1';
    }

    constructor(private productConfig: ProductsConfig) {}

    getMetadata(product: string): ProductMetadata {
        if (!this.productConfig[product]) {
            throw new Error(`Product ${product} is not configured.`);
        }

        if (!this.metadata.has(product)) {
            this.metadata.set(product, new ProductMetadata(product, this.productConfig[product]));
        }

        return this.metadata.get(product)!;
    }

    register(product: string, injector: Injector) {
        const metadata = this.getMetadata(product);
        metadata.onRegister({ injector });
    }

    setActive(product: string) {
        const metadata = this.getMetadata(product);
        if (!metadata.isRegistered) {
            throw new Error(`Cannot set active product ${product} because it was not registered.`);
        }

        this.activeProduct = product;
        this.productChanged.next(this.current);
    }

    setDefaultActive() {
        this.setActive(ProductService.DEFAULT_PRODUCT);
    }
}
