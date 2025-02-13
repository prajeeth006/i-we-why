import { TestBed } from '@angular/core/testing';

import { ContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { ContentMessagesTrackingService } from '../src/content-messages-tracking.service';

describe('ContentMessagesTrackingService', () => {
    let service: ContentMessagesTrackingService;
    let trackingServiceMock: TrackingServiceMock;
    let message: ContentItem;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        message = {
            name: 'msg1',
            templateName: 'pctext',
            parameters: {},
        };

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ContentMessagesTrackingService],
        });

        service = TestBed.inject(ContentMessagesTrackingService);
    });

    describe('trackMessageLoaded', () => {
        it('should track the specified event', () => {
            message.parameters = {
                'tracking.LoadedEvent': 'LoadedEvt',
                'tracking.LoadedEvent.page.referringAction': 'Some_Action',
            };
            service.trackMessageLoaded(message, 'kkk');

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                { 'tracking.LoadedEvent': 'LoadedEvt', 'tracking.LoadedEvent.page.referringAction': 'Some_Action' },
                'tracking.LoadedEvent',
            );
        });

        it('should only track a message once', () => {
            message.parameters = { 'tracking.LoadedEvent': 'LoadedEvt' };
            message.name = 'msg';
            service.trackMessageLoaded(message, 'kkk');
            service.trackMessageLoaded(message, 'kkk');
            service.trackMessageLoaded(message, 'kkk');

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledTimes(1);
        });

        it('should not track if no event is specified', () => {
            service.trackMessageLoaded(message, 'kkk');

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith({}, 'tracking.LoadedEvent');
        });
    });

    describe('trackMessageClosed', () => {
        it('should track the specified event', () => {
            message.parameters = {
                'tracking.ClosedEvent': 'ClosedEvt',
                'tracking.ClosedEvent.page.referringAction': 'Some_Action',
            };
            service.trackMessageClosed(message);

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                { 'tracking.ClosedEvent': 'ClosedEvt', 'tracking.ClosedEvent.page.referringAction': 'Some_Action' },
                'tracking.ClosedEvent',
            );
        });

        it('should not track if no event is specified', () => {
            service.trackMessageClosed(message);

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith({}, 'tracking.ClosedEvent');
        });
    });
});
