import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { LoginDurationTrackingService } from '../src/login-duration-tracking.service';

describe('LoginDurationTrackingService', () => {
    let service: LoginDurationTrackingService;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoginDurationTrackingService],
        });

        service = TestBed.inject(LoginDurationTrackingService);
    });

    describe('trackLoad', () => {
        it('should track with correct data', () => {
            const time = new Date(Date.now()).toTimeString();
            service.trackLoad(time, 'header');

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledOnceWith('Event.Tracking', {
                'component.CategoryEvent': 'login duration',
                'component.LabelEvent': 'time track start',
                'component.ActionEvent': 'load',
                'component.PositionEvent': 'header',
                'component.LocationEvent': 'not applicable',
                'component.EventDetails': time,
                'component.URLClicked': 'not applicable',
            });
        });
    });
});
