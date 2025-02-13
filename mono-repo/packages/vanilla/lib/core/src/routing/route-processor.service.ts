import { Injectable } from '@angular/core';
import { Route, Routes } from '@angular/router';

import { flatten } from 'lodash-es';

import { ProductService } from '../products/product.service';
import { ROUTE_PROCESSOR, RouteProcessor } from './route-processor';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RouteProcessorService {
    constructor(private productService: ProductService) {}

    processRoutes(routes: Routes[], parentRoute?: Route): Routes {
        return flatten(routes)
            .map((r) => this.processRoute(r, parentRoute)!)
            .filter((r) => r);
    }

    private processRoute(route: Route, parentRoute?: Route) {
        const processors = this.getProcessors(route, parentRoute);

        let processedRoute: Route | null = route;
        for (const processor of processors) {
            processedRoute = processor.process(route);
            if (processedRoute == null) {
                return null;
            }
        }

        if (processedRoute.children) {
            processedRoute.children = processedRoute.children.map((c) => this.processRoute(c, parentRoute)!).filter((c) => c);
        }

        return processedRoute;
    }

    private getProcessors(route: Route, parentRoute?: Route): RouteProcessor[] {
        const product: string | undefined = route.data?.['product'] || parentRoute?.data?.['product'];

        const currentInjector = this.productService.current.injector;

        if (!product) {
            return currentInjector.get<RouteProcessor[]>(ROUTE_PROCESSOR);
        }

        const productMetadata = this.productService.getMetadata(product);

        return productMetadata.isRegistered
            ? productMetadata.injector.get<RouteProcessor[]>(ROUTE_PROCESSOR)
            : currentInjector.get<RouteProcessor[]>(ROUTE_PROCESSOR);
    }
}
