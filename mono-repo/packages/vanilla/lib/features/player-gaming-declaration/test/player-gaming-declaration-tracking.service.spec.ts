import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { PlayerGamingDeclarationTrackingService } from '../src/player-gaming-declaration-tracking.service';

describe('PlayerGamingDeclarationTrackingService', () => {
    let service: PlayerGamingDeclarationTrackingService;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PlayerGamingDeclarationTrackingService],
        });

        service = TestBed.inject(PlayerGamingDeclarationTrackingService);
    });

    describe('trackLoad', () => {
        it('post login', () => {
            service.trackLoad(true);

            runTest('contentView', 'load', 'post login', 'updated tnc interceptor');
        });

        it('product switch', () => {
            service.trackLoad(false);

            runTest('contentView', 'load', 'product switch', 'updated tnc interceptor');
        });
    });

    describe('trackAccept', () => {
        it('post login', () => {
            service.trackAccept(true);

            runTest('Event.Tracking', 'click', 'post login', 'accept cta');
        });

        it('product switch', () => {
            service.trackAccept(false);

            runTest('Event.Tracking', 'click', 'product switch', 'accept cta');
        });
    });

    function runTest(eventName: string, action: string, positionEvent: string, eventDetails: string) {
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith(eventName, {
            'component.CategoryEvent': 'interceptor',
            'component.LabelEvent': 'updated tnc interceptor',
            'component.ActionEvent': action,
            'component.PositionEvent': positionEvent,
            'component.LocationEvent': 'updated tnc interceptor',
            'component.EventDetails': eventDetails,
            'component.URLClicked': 'not applicable',
        });
    }
});
