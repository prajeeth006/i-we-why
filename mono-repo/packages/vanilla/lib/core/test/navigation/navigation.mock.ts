import { Mock, Stub, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { LocationChangeEvent } from '../../src/navigation/navigation.models';
import { NavigationService } from '../../src/navigation/navigation.service';
import { ParsedUrl } from '../../src/navigation/parsed-url';
import { QuerySearchParams } from '../../src/navigation/query-search-params';
import { RouteDataOptions } from '../../src/routing/route-data';

@Mock({ of: NavigationService })
export class NavigationServiceMock {
    location: ParsedUrlMock = new ParsedUrlMock();
    @Stub() init: jasmine.Spy;
    @StubPromise() goTo: jasmine.PromiseSpy;
    @Stub() goToNativeApp: jasmine.Spy;
    @Stub() goToLastKnownProduct: jasmine.Spy;
    @Stub() storeReturnUrl: jasmine.Spy;
    @Stub() goToReturnUrl: jasmine.Spy;
    locationChange: Subject<LocationChangeEvent> = new Subject();
    attemptedNavigation: Subject<ParsedUrl> = new Subject();
    routeData: Subject<RouteDataOptions> = new Subject();
}

export class ParsedUrlMock {
    protocol: string;
    search: QuerySearchParams = new QuerySearchParams('');
    hash: string;
    hostname: string;
    port: string;
    pathname: string;
    isRelative: boolean;
    isSameHost: boolean;
    isSameTopDomain: boolean;
    culture: string;
    @Stub() clone: jasmine.Spy;
    @Stub() path: jasmine.Spy;
    @Stub() absUrl: jasmine.Spy;
    @Stub() url: jasmine.Spy;
    @Stub() baseUrl: jasmine.Spy;
    @Stub() host: jasmine.Spy;
    @Stub() changeCulture: jasmine.Spy;
}
