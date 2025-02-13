import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { ProductMenuTrackingService } from '../src/product-menu-tracking.service';

describe('ProductMenuTrackingService', () => {
    let service: ProductMenuTrackingService;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProductMenuTrackingService],
        });

        service = TestBed.inject(ProductMenuTrackingService);
    });

    describe('trackProductMenuClose', () => {
        it('should track', () => {
            service.trackProductMenuClose();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledOnceWith('Event.Tracking', {
                'component.CategoryEvent': 'navigation',
                'component.LabelEvent': 'burger menu',
                'component.ActionEvent': 'click',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'navigation menu',
                'component.EventDetails': 'close',
                'component.URLClicked': 'not applicable',
            });
        });
    });
});
