import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { ProductSwitchCoolOffTrackingService } from '../src/product-switch-cool-off-tracking.service';

describe('ProductSwitchCoolOffTrackingService', () => {
    let service: ProductSwitchCoolOffTrackingService;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProductSwitchCoolOffTrackingService],
        });

        service = TestBed.inject(ProductSwitchCoolOffTrackingService);
    });

    it('trackLoad', () => {
        service.trackLoad('sports', 'casino');

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'Product Switch',
            'component.LabelEvent': 'RG Interceptor',
            'component.ActionEvent': 'Load',
            'component.PositionEvent': 'sports',
            'component.LocationEvent': 'casino',
            'component.EventDetails': 'RG Product Switch Interceptor',
            'component.URLClicked': 'not applicable',
        });
    });

    it('trackConfirm', () => {
        service.trackConfirm('sports', 'casino');

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'Product Switch',
            'component.LabelEvent': 'RG Interceptor',
            'component.ActionEvent': 'Click',
            'component.PositionEvent': 'sports',
            'component.LocationEvent': 'casino',
            'component.EventDetails': 'Got It',
            'component.URLClicked': 'not applicable',
        });
    });
});
