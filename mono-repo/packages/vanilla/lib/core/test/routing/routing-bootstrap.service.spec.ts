import { TestBed } from '@angular/core/testing';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ROUTES, Routes } from '@angular/router';

import { MockContext } from 'moxxi';

import { RoutingBootstrapService } from '../../src/routing/routing-bootstrap.service';
import { PageMock } from '../browsercommon/page.mock';
import { LoadingIndicatorServiceMock } from '../http/loading-indicator.mock';
import { RouterMock } from '../router.mock';
import { RouteProcessorServiceMock } from './route-processor.mock';

describe('RoutingBootstrapService', () => {
    let service: RoutingBootstrapService;
    let routerMock: RouterMock;
    let loadingIndicatorServiceMock: LoadingIndicatorServiceMock;
    let pageMock: PageMock;
    let routeProcessorServiceMock: RouteProcessorServiceMock;
    let routes: Routes[];

    beforeEach(() => {
        routerMock = MockContext.useMock(RouterMock);
        pageMock = MockContext.useMock(PageMock);
        loadingIndicatorServiceMock = MockContext.useMock(LoadingIndicatorServiceMock);
        routeProcessorServiceMock = MockContext.useMock(RouteProcessorServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, { provide: ROUTES, useValue: [[]] }, RoutingBootstrapService],
        });

        pageMock.loadingIndicator = {
            defaultDelay: 300,
            externalNavigationDelay: 600,
            spinnerContent: 'spinner',
            disabledUrlPattern: '',
        };

        service = TestBed.inject(RoutingBootstrapService);
        routes = TestBed.inject(ROUTES);
    });

    it('should process routes', () => {
        routes[0]!.push({ path: 'x' });
        const processedRoutes = [{ path: 'processed' }];

        routeProcessorServiceMock.processRoutes.withArgs(routes).and.returnValue(processedRoutes);

        service.onAppInit();

        expect(routerMock.resetConfig).toHaveBeenCalledWith(processedRoutes);
    });

    describe('loading indicator', () => {
        it('should open indicator on route change start', () => {
            service.onAppInit();

            routerMock.events.next(new NavigationStart(1, 'https://drzavana-kasa'));

            expect(loadingIndicatorServiceMock.start).toHaveBeenCalledWith({ url: 'https://drzavana-kasa' });
        });

        it('should close indicator on route change success', () => {
            service.onAppInit();

            routerMock.events.next(new NavigationStart(1, ''));
            routerMock.events.next(new NavigationEnd(1, '', ''));

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        });

        it('should close indicator on route change error', () => {
            service.onAppInit();

            routerMock.events.next(new NavigationStart(1, ''));
            routerMock.events.next(new NavigationError(1, '', ''));

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        });

        it('should close indicator on route change cancel', () => {
            service.onAppInit();

            routerMock.events.next(new NavigationStart(1, ''));
            routerMock.events.next(new NavigationCancel(1, '', ''));

            expect(loadingIndicatorServiceMock.start.calls.mostRecent().returnValue.done).toHaveBeenCalled();
        });
    });
});
