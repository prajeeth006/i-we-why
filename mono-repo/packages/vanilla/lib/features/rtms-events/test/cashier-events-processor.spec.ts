import { TestBed } from '@angular/core/testing';

import { EventType, RtmsType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { CashierEventsProcessor } from '../src/cashier-events-processor';

describe('CashierEventsProcessor', () => {
    let service: CashierEventsProcessor;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [CashierEventsProcessor, MockContext.providers],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(CashierEventsProcessor);
    });

    it('should process', () => {
        const eventData = {
            event: 'depostiTracking',
            page: {
                channel: 'WC',
            },
        };
        service.process({ name: RtmsType.CASHIER_DEPOSIT_RECOVERY, type: EventType.Rtms, data: eventData });

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('depostiTracking', eventData);
    });
});
