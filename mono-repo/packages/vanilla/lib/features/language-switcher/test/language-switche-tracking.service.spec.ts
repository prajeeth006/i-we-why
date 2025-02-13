import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { LanguageSwitcherTrackingService } from '../src/language-switcher-tracking.service';

describe('LanguageSwitcherTrackingService', () => {
    let service: LanguageSwitcherTrackingService;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LanguageSwitcherTrackingService],
        });

        service = TestBed.inject(LanguageSwitcherTrackingService);
    });

    it('trackDisplay', () => {
        service.trackDisplay(false);

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'language selector',
            'component.LabelEvent': 'default language selector',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'pop up',
            'component.EventDetails': 'language selector',
            'component.URLClicked': 'not applicable',
        });
    });

    it('trackChangeLanguage', () => {
        service.trackChangeLanguage(true, 'en', 'de');

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'language selector',
            'component.LabelEvent': 'standard language selector',
            'component.ActionEvent': 'select',
            'component.PositionEvent': 'en',
            'component.LocationEvent': 'standard language selector',
            'component.EventDetails': 'de',
            'component.URLClicked': 'not applicable',
        });
    });

    it('trackOpenLanguageSwitcherMenu', () => {
        service.trackOpenLanguageSwitcherMenu();

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'language selector',
            'component.LabelEvent': 'standard language selector',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'not applicable',
            'component.EventDetails': 'language selector',
            'component.URLClicked': 'not applicable',
        });
    });
});
