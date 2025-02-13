import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { InactivityScreenTrackingService } from '../src/inactivity-screen-tracking.service';

describe('InactivityScreenTrackingService', () => {
    let service: InactivityScreenTrackingService;
    let trackingServiceMock: TrackingServiceMock;
    let page: PageMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        page = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InactivityScreenTrackingService],
        });

        service = TestBed.inject(InactivityScreenTrackingService);
    });

    it('track overlay show for betstation mode', () => {
        service.trackShowOverlay(30, 'Betstation');
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'reality check',
            'component.LabelEvent': 'idle status',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 30,
            'component.LocationEvent': 'inactivity prompt',
            'component.EventDetails': 'inactivity prompt',
            'component.URLClicked': 'not applicable',
        });
    });

    it('track overlay show for web mode', () => {
        page.product = 'Casino';
        service.trackShowOverlay(0, 'Web');

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-about to be logged out',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'Casino', //ex home, casino, poker, etc
            'component.EventDetails': 'idle popup-about to be logged out',
            'component.URLClicked': 'not applicable',
        });
    });

    it('track user click', () => {
        service.trackClick('00:00:20');
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'reality check',
            'component.LabelEvent': 'idle status',
            'component.ActionEvent': 'click',
            'component.PositionEvent': '00:00:20',
            'component.LocationEvent': 'inactivity prompt',
            'component.EventDetails': 'inactivity prompt',
            'component.URLClicked': 'not applicable',
        });
    });

    it('track continue', () => {
        service.trackContinue();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-about to be logged out',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'cta',
            'component.LocationEvent': 'idle popup-about to be logged out',
            'component.EventDetails': 'stay logged in',
            'component.URLClicked': 'not applicable',
        });
    });

    it('track logout', () => {
        service.trackLogout();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-about to be logged out',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'cta',
            'component.LocationEvent': 'idle popup-about to be logged out',
            'component.EventDetails': 'logout',
            'component.URLClicked': 'not applicable',
        });
    });

    it('track session layout show', () => {
        page.product = 'Casino';
        service.trackSessionOverlay();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-logged out',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'Casino', //ex home, casino, poker, etc
            'component.EventDetails': 'idle popup-logged out',
            'component.URLClicked': 'not applicable',
        });
    });

    it('track login', () => {
        service.trackLogin();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-logged out',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'cta',
            'component.LocationEvent': 'idle popup-logged out',
            'component.EventDetails': 'log back in',
            'component.URLClicked': 'not applicable',
        });
    });

    it('track session close', () => {
        service.trackSessionClose();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'session inactivity',
            'component.LabelEvent': 'idle popup-logged out',
            'component.ActionEvent': 'close',
            'component.PositionEvent': 'icon',
            'component.LocationEvent': 'idle popup-logged out',
            'component.EventDetails': 'close x',
            'component.URLClicked': 'not applicable',
        });
    });

    it('track session end', () => {
        service.trackSession('abc2536');
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Session.End', {
            'betstation.sessionID': 'abc2536',
        });
    });
});
