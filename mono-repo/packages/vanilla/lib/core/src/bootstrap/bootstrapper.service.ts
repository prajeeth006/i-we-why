import { InjectFlags, Injectable, InjectionToken, Injector, Provider, Type } from '@angular/core';

import { ProductService } from '../products/product.service';

/**
 * @whatItDoes Application life cycle hook that is called when application is started.
 *
 * @description
 *
 * Services that implement this interface can be registered with `runOnAppInit(Service)` to run
 * when app is initializing (same as registering `APP_INITIALIZER`).
 *
 * @stable
 */
export interface OnAppInit {
    onAppInit(): void | Promise<any>;
}

/**
 * @stable
 */
export interface ProductBootstrapper {
    onLoad(): void | Promise<void>;
    onActivate(): void | Promise<void>;
    onDeactivate(): void | Promise<void>;
}

export const PRODUCT_BOOTSTRAPPER = new InjectionToken<ProductBootstrapper[]>('vn-product-bootstrapper');
export const ON_APP_INIT_BOOTSTRAPPER = new InjectionToken<OnAppInit[]>('vn-on-app-init-bootstrapper');

/**
 * @whatItDoes Registers a provider to invoke `onAppInit()` when the application is started.
 *
 * @stable
 */
export function runOnAppInit<T extends OnAppInit>(type: Type<T>): Provider[] {
    return [
        type,
        {
            provide: ON_APP_INIT_BOOTSTRAPPER,
            multi: true,
            useExisting: type,
        },
    ];
}

/**
 * @whatItDoes Registers a provider to invoke when product changes.
 *
 * Invoke `onActivate()` when the product route is navigated to and `onDeactivate` when navigating away from a product route.
 * (e.g. Navigating from `/en/sports/path` to `/en/casino/path`).
 *
 * @stable
 */
export function provideProductBootstrapper<T extends ProductBootstrapper>(type: Type<T>): Provider[] {
    return [
        type,
        {
            provide: PRODUCT_BOOTSTRAPPER,
            multi: true,
            useExisting: type,
        },
    ];
}

/**
 * @whatItDoes Defines phases of {@link BootstrapperService}.
 *
 * @stable
 */
export enum BootstrapperPhase {
    None,
    AppInit,
    ProductLoad,
    ProductActivate,
    ProductDeactivate,
}

/**
 * @whatItDoes Runs application and product bootstrappers.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class BootstrapperService {
    private _phase: BootstrapperPhase;

    /** Current phase that the bootstrapper is in. */
    get phase() {
        return this._phase;
    }

    constructor(
        private injector: Injector,
        private productService: ProductService,
    ) {}

    /* @internal */
    async runAppInit() {
        await this.runBootstrappers(BootstrapperPhase.AppInit, this.injector, ON_APP_INIT_BOOTSTRAPPER, (b) => b.onAppInit());
    }

    async runProductLoad(product: string) {
        await this.runBootstrappers(BootstrapperPhase.ProductLoad, this.getProductInjector(product), PRODUCT_BOOTSTRAPPER, (b) => b.onLoad());
    }

    async runProductActivation(product: string) {
        await this.runBootstrappers(BootstrapperPhase.ProductActivate, this.getProductInjector(product), PRODUCT_BOOTSTRAPPER, (b) => b.onActivate());
    }

    async runProductDeactivation(product: string) {
        await this.runBootstrappers(BootstrapperPhase.ProductDeactivate, this.getProductInjector(product), PRODUCT_BOOTSTRAPPER, (b) =>
            b.onDeactivate(),
        );
    }

    private async runBootstrappers<T>(phase: BootstrapperPhase, injector: Injector, token: InjectionToken<T[]>, fn: (b: T) => void | Promise<void>) {
        const bootstrappers = injector.get(token, [], InjectFlags.Optional);

        this._phase = phase;

        await Promise.all(bootstrappers.map(fn));

        this._phase = BootstrapperPhase.None;
    }

    private getProductInjector(product: string) {
        return this.productService.getMetadata(product).injector;
    }
}
