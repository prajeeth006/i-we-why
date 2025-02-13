import { Injectable, InjectionToken, Injector } from '@angular/core';
import { Route } from '@angular/router';

import { Page } from '../client-config/page.client-config';

/**
 * @whatItDoes Provides functionality to modify routes before they are used by the router.
 *
 * @howToUse
 *
 * ```
 * @Injectable()
 * export class SampleRouteProcessor implements RouteProcessor {
 *     process(route: Route): Route | null {
 *         route.path = '...'; // modify route
 *
 *         return route;
 *     }
 * }
 *
 * @NgModule()
 * export class SampleModule {
 *     static forRoot(): ModuleWithProviders<SampleModule> {
 *         return {
 *             ngModule: SampleModule,
 *             providers: [
 *                 { provide: ROUTE_PROCESSOR, useClass: SampleRouteProcessor, multi: true }
 *             ]
 *         };
 *     }
 * }
 * ```
 *
 * @description
 *
 * **NOTE**: This doesn't work with lazy loaded modules. This may be supported in the future.
 *
 * @stable
 */
export interface RouteProcessor {
    process(route: Route): Route | null;
}

/**
 * @description
 *
 * See {@link RouteProcessor}
 *
 * @stable
 */
export const ROUTE_PROCESSOR = new InjectionToken<RouteProcessor>('vn-route-processor');

export interface RouteInjectorProvider {
    getRouteInjector(): Injector | null;
}

@Injectable()
export class PathPlaceholdersRouteProcessor implements RouteProcessor {
    constructor(private page: Page) {}

    process(route: Route): Route | null {
        if (route.path) {
            route.path = this.replacePathPlaceholders(route.path);
        }
        if (route.redirectTo && typeof route.redirectTo === 'string') {
            route.redirectTo = this.replacePathPlaceholders(route.redirectTo);
        }

        return route;
    }

    private replacePathPlaceholders(path: string) {
        return path.replace(/{culture}/g, this.page.lang);
    }
}

@Injectable()
export class PageViewDataRouteProcessor implements RouteProcessor {
    process(route: Route): Route | null {
        if (route.component && (route.component as any)['ProvidesPageViewData']) {
            if (!route.data) {
                route.data = {};
            }

            route.data['waitForPageViewData'] = true;
        }

        return route;
    }
}
