import { Event, Router } from '@angular/router';

import { Mock, Stub, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { ActivatedRouteSnapshotMock } from './activated-route.mock';

@Mock({ of: Router })
export class RouterMock {
    @StubPromise() navigate: jasmine.PromiseSpy;
    @StubPromise() navigateByUrl: jasmine.PromiseSpy;
    @Stub() resetConfig: jasmine.Spy;
    events = new Subject<Event>();
    routerState = new RouterStateMock();
    onSameUrlNavigation: 'reload' | 'ignore' = 'ignore';
    routeReuseStrategy = new RouteReuseStrategyMock();
}

export class RouteReuseStrategyMock {
    shouldReuseRoute: () => {};
}

export class RouterStateMock {
    snapshot = new RouterStateSnapshotMock();
}

export class RouterStateSnapshotMock {
    root = new ActivatedRouteSnapshotMock();
}
