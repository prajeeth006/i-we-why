import { Provider } from '@angular/core';
import { UrlSerializer } from '@angular/router';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { UrlService } from '../navigation/url.service';
import { LowerCaseCultureUrlSerializer } from './lower-case-culture-url.serializer';
import { PageViewDataRouteProcessor, PathPlaceholdersRouteProcessor, ROUTE_PROCESSOR } from './route-processor';
import { RouteScrollingBootstrapService } from './route-scrolling-bootstrap.service';
import { RouterEventsBootstrapService } from './router-events-bootstrap.service';
import { RoutingBootstrapService } from './routing-bootstrap.service';

export function provideRouting(): Provider[] {
    return [
        runOnAppInit(RoutingBootstrapService),
        runOnAppInit(RouteScrollingBootstrapService),
        runOnAppInit(RouterEventsBootstrapService),
        { provide: ROUTE_PROCESSOR, useClass: PathPlaceholdersRouteProcessor, multi: true },
        { provide: ROUTE_PROCESSOR, useClass: PageViewDataRouteProcessor, multi: true },
        { provide: UrlSerializer, useClass: LowerCaseCultureUrlSerializer, deps: [UrlService] },
    ];
}
