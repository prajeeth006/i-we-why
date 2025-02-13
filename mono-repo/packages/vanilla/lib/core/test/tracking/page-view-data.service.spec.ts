import { TestBed } from '@angular/core/testing';

import { PageViewDataService, TrackingData } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';

import { ActivatedRouteSnapshotMock } from '../activated-route.mock';

describe('PageViewDataService', () => {
    let service: PageViewDataService;
    let spy: jasmine.Spy;
    let route: ActivatedRouteSnapshotMock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PageViewDataService],
        });

        service = TestBed.inject(PageViewDataService);
        spy = jasmine.createSpy();
        route = new ActivatedRouteSnapshotMock();
    });

    it('should pass data to subject associated with route', () => {
        const data = { a: 1 };
        const listener = new Subject<TrackingData>();
        listener.subscribe(spy);

        service.installListener(<any>route, listener);

        service.setDataForNavigation(<any>route, data);

        expect(spy).toHaveBeenCalledWith(data);
    });
});
