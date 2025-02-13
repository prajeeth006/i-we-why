import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { SmartBannerComponent } from '../src/smart-banner.component';
import { SmartBannerResourceServiceMock } from './smart-banner.mock';

describe('SmartBannerComponent', () => {
    let fixture: ComponentFixture<SmartBannerComponent>;
    let component: SmartBannerComponent;
    let smartBannerResourceServiceMock: SmartBannerResourceServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        smartBannerResourceServiceMock = MockContext.useMock(SmartBannerResourceServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(SmartBannerComponent);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('smartBanner', { content: {} });

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track banner load', () => {
            fixture.detectChanges();

            shouldTrack('load', 'open app prompt banner');
        });
    });

    describe('close', () => {
        it('should track when closed', () => {
            component.close();

            expect(smartBannerResourceServiceMock.close).toHaveBeenCalled();
            shouldTrack('click', 'close cta');
        });
    });

    describe('open', () => {
        it('should track when opened', () => {
            component.open('/');

            expect(smartBannerResourceServiceMock.close).toHaveBeenCalled();
            expect(navigationServiceMock.goTo).toHaveBeenCalledOnceWith('/');

            shouldTrack('click', 'close cta');
            shouldTrack('click', 'open cta');
        });
    });

    function shouldTrack(action: string, eventDetails: string) {
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith(action == 'load' ? 'contentView' : 'Event.Tracking', {
            'component.CategoryEvent': 'banners',
            'component.LabelEvent': 'app banners',
            'component.ActionEvent': action,
            'component.PositionEvent': 'top of the page',
            'component.LocationEvent': 'open app prompt banner',
            'component.EventDetails': eventDetails,
            'component.URLClicked': 'not applicable',
        });
    }
});
