import { Inject, Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ROUTES, Router, Routes } from '@angular/router';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { LoadingIndicatorHandler } from '../loading-indicator/loading-indicator-handler';
import { LoadingIndicatorService } from '../loading-indicator/loading-indicator.service';
import { RouteProcessorService } from './route-processor.service';

@Injectable()
export class RoutingBootstrapService implements OnAppInit {
    private currentHandler: LoadingIndicatorHandler;

    constructor(
        private router: Router,
        @Inject(ROUTES) private routes: Routes[],
        private loadingIndicatorService: LoadingIndicatorService,
        private routeProcessorService: RouteProcessorService,
    ) {}

    onAppInit() {
        this.router.resetConfig(this.routeProcessorService.processRoutes(this.routes));

        this.router.events.subscribe((e) => {
            if (e instanceof NavigationStart) {
                this.currentHandler = this.loadingIndicatorService.start({
                    url: e.url,
                });
            } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
                this.currentHandler.done();
            }
        });
    }
}
