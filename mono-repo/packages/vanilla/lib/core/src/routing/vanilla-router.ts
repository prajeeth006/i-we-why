import { Compiler, EnvironmentInjector, Injector, NgModuleFactory, inject } from '@angular/core';
import {
    DefaultExport,
    ExtraOptions,
    PRIMARY_OUTLET,
    ROUTES,
    Route,
    RouteConfigLoadEnd,
    RouteConfigLoadStart,
    Router,
    Routes,
    withDebugTracing,
} from '@angular/router';

import { ConnectableObservable, Observable, Subject, from, isObservable, of } from 'rxjs';
import { finalize, map, mergeMap, refCount } from 'rxjs/operators';

import { isPromise } from '../utils/check';
import { EmptyOutletComponent } from './empty_outlet';
import { RouteProcessorService } from './route-processor.service';

/**
 * Enables processing of lazy routes with new import('lazy.module') syntax.
 * Idea stolen from: https://github.com/gilsdav/ngx-translate-router/blob/master/projects/ngx-translate-router/src/lib/localized-router.ts
 * After changed on Angular 16.2.6, the entire loadChildren method is now being overwritten, might have side effects.
 * Angular code copied from: https://github.com/angular/angular/blob/4ccd845081ad13fbb14cd87b5ca9c757071967dd/packages/router/src/router_config_loader.ts
 * Feature request to make this more reasonable/future-proof: https://github.com/angular/angular/issues/31800
 */
export class VanillaRouter extends Router {
    private compiler = inject(Compiler);
    private routeProcessorService = inject(RouteProcessorService);
    private childrenLoaders = new WeakMap<Route, Observable<LoadedRouterConfig>>();
    private readonly onLoadStartListener: (r: Route) => void;
    private readonly onLoadEndListener: (r: Route) => void;

    constructor() {
        super();

        const configLoader = (this as any).navigationTransitions.configLoader.__proto__;
        const events = (this as any).navigationTransitions.events;

        this.onLoadStartListener = (r: Route) => events.next(new RouteConfigLoadStart(r));
        this.onLoadEndListener = (r: Route) => events.next(new RouteConfigLoadEnd(r));

        configLoader.loadChildren = (parentInjector: Injector, route: any) => {
            if (this.childrenLoaders.get(route)) {
                return this.childrenLoaders.get(route)!;
            } else if (route._loadedRoutes) {
                return of({ routes: route._loadedRoutes, injector: route._loadedInjector });
            }

            if (this.onLoadStartListener) {
                this.onLoadStartListener(route);
            }
            const moduleFactoryOrRoutes$ = this.loadChildren(route, this.compiler, parentInjector, this.onLoadEndListener);

            const loadRunner = moduleFactoryOrRoutes$.pipe(
                finalize(() => {
                    this.childrenLoaders.delete(route);
                }),
            );
            const loader = new ConnectableObservable(loadRunner, () => new Subject<any>()).pipe(refCount());
            this.childrenLoaders.set(route, loader);
            return loader;
        };
    }

    loadChildren(route: Route, compiler: Compiler, parentInjector: Injector, onLoadEndListener?: (r: Route) => void): Observable<LoadedRouterConfig> {
        return wrapIntoObservable(route.loadChildren!()).pipe(
            map(maybeUnwrapDefaultExport),
            mergeMap((t) => {
                if (t instanceof NgModuleFactory || Array.isArray(t)) {
                    return of(t);
                } else {
                    return from(compiler.compileModuleAsync(t));
                }
            }),
            map((factoryOrRoutes: NgModuleFactory<any> | Routes) => {
                if (onLoadEndListener) {
                    onLoadEndListener(route);
                }
                // This injector comes from the `NgModuleRef` when lazy loading an `NgModule`. There is
                // no injector associated with lazy loading a `Route` array.
                let injector: EnvironmentInjector | undefined;
                let rawRoutes: Route[];

                if (Array.isArray(factoryOrRoutes)) {
                    rawRoutes = factoryOrRoutes;

                    rawRoutes = this.routeProcessorService.processRoutes(rawRoutes as Routes[], route);
                } else {
                    injector = factoryOrRoutes.create(parentInjector).injector;
                    // When loading a module that doesn't provide `RouterModule.forChild()` preloader
                    // will get stuck in an infinite loop. The child module's Injector will look to
                    // its parent `Injector` when it doesn't find any ROUTES so it will return routes
                    // for its parent module instead.
                    rawRoutes = injector.get(ROUTES, [], { optional: true, self: true }).flat();

                    const routes: Routes[] = ([] as Routes[]).concat(...(rawRoutes as Routes[]));
                    rawRoutes = this.routeProcessorService.processRoutes(routes, route);
                }

                const routes = rawRoutes.map(standardizeConfig);
                return { routes, injector };
            }),
        );
    }
}

/**
 * @stable
 */
export function setupRouter(opts: ExtraOptions = {}) {
    const router = new VanillaRouter();

    if (opts.errorHandler) {
        router.errorHandler = opts.errorHandler;
    }

    if (opts.enableTracing) {
        withDebugTracing();
    }

    if (opts.onSameUrlNavigation) {
        router.onSameUrlNavigation = opts.onSameUrlNavigation;
    }

    return router;
}

export function wrapIntoObservable<T>(value: T | NgModuleFactory<T> | Promise<T> | Observable<T>) {
    if (isObservable(value)) {
        return value;
    }

    if (isPromise(value)) {
        // Use `Promise.resolve()` to wrap promise-like instances.
        // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
        // change detection.
        return from(Promise.resolve(value));
    }

    return of(value);
}

export function standardizeConfig(r: Route): Route {
    const children = r.children?.map(standardizeConfig);
    const c = children ? { ...r, children } : { ...r };
    if (!c.component && !c.loadComponent && (children || c.loadChildren) && c.outlet && c.outlet !== PRIMARY_OUTLET) {
        c.component = EmptyOutletComponent;
    }
    return c;
}
export interface LoadedRouterConfig {
    routes: Route[];
    injector: EnvironmentInjector | undefined;
}

function isWrappedDefaultExport<T>(value: T | DefaultExport<T>): value is DefaultExport<T> {
    // We use `in` here with a string key `'default'`, because we expect `DefaultExport` objects to be
    // dynamically imported ES modules with a spec-mandated `default` key. Thus we don't expect that
    // `default` will be a renamed property.
    return value && typeof value === 'object' && 'default' in value;
}

function maybeUnwrapDefaultExport<T>(input: T | DefaultExport<T>): T {
    // As per `isWrappedDefaultExport`, the `default` key here is generated by the browser and not
    // subject to property renaming, so we reference it with bracket access.
    return isWrappedDefaultExport(input) ? input.default : input;
}
