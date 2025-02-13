import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { ActivityPopupTrackingService } from '../src/activity-popup-tracking.service';

describe('ActivityPopupTrackingService', () => {
    let service: ActivityPopupTrackingService;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [ActivityPopupTrackingService, MockContext.providers],
        });

        service = TestBed.inject(ActivityPopupTrackingService);
    });

    it('load', () => {
        service.load(3);

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
            'component.CategoryEvent': 'reality check',
            'component.LabelEvent': 'interceptor',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 3,
            'component.LocationEvent': 'activity popup',
            'component.EventDetails': 'activity popup',
            'component.URLClicked': 'not applicable',
        });
    });

    it('continue', () => {
        service.continue(3);

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'reality check',
            'component.LabelEvent': 'interceptor',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 3,
            'component.LocationEvent': 'activity popup',
            'component.EventDetails': 'continue',
            'component.URLClicked': 'not applicable',
        });
    });

    it('logout', () => {
        service.logout(3);

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'reality check',
            'component.LabelEvent': 'interceptor',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 3,
            'component.LocationEvent': 'activity popup',
            'component.EventDetails': 'log out',
            'component.URLClicked': 'not applicable',
        });
    });
});
