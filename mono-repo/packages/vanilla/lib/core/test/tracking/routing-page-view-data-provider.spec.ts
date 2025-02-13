import { TestBed } from '@angular/core/testing';

import { TrackingData } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { RoutingPageViewDataProvider } from '../../src/routing/routing-page-view-data-provider';
import { ActivatedRouteSnapshotMock } from '../activated-route.mock';
import { RouterMock } from '../router.mock';
import { PageViewDataServiceMock } from './page-view-data.mock';

describe('RoutingPageViewDataProvider', () => {
    let service: RoutingPageViewDataProvider;
    let routerMock: RouterMock;
    let pageViewDataServiceMock: PageViewDataServiceMock;
    let currentRouteMock: ActivatedRouteSnapshotMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        routerMock = MockContext.useMock(RouterMock);
        pageViewDataServiceMock = MockContext.useMock(PageViewDataServiceMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, RoutingPageViewDataProvider],
        });

        service = TestBed.inject(RoutingPageViewDataProvider);

        spy = jasmine.createSpy();
        currentRouteMock = new ActivatedRouteSnapshotMock();

        const parentRoute = new ActivatedRouteSnapshotMock();
        parentRoute.firstChild = currentRouteMock;

        routerMock.routerState.snapshot.root.firstChild = parentRoute;
    });

    it('should get data from data service if waitForPageViewData is true', () => {
        currentRouteMock.data['waitForPageViewData'] = true;

        const sub = service.getData().subscribe(spy);

        const data: TrackingData = { a: 1 };

        expect(pageViewDataServiceMock.installListener).toHaveBeenCalledWith(currentRouteMock, jasmine.anything());
        pageViewDataServiceMock.installListener.calls.mostRecent().args[1].next(data);

        expect(spy).toHaveBeenCalledWith(data);

        sub.unsubscribe();
        expect(pageViewDataServiceMock.uninstallListener).toHaveBeenCalledWith(currentRouteMock);
    });

    it('should return empty if waitForPageViewData is false', () => {
        service.getData().subscribe(spy);

        expect(pageViewDataServiceMock.installListener).not.toHaveBeenCalled();

        expect(spy).toHaveBeenCalledWith({});
    });
});
