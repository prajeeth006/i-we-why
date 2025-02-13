import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { ConfirmPopupServiceMock } from '../../../shared/confirm-popup/test/confirm-popup.mock';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { HeaderBarComponent } from '../src/header-bar.component';
import { HeaderBarServiceMock } from './header-bar.mocks';

describe('HeaderBarComponent', () => {
    let fixture: ComponentFixture<HeaderBarComponent>;
    let component: HeaderBarComponent;
    let headerBarServiceMock: HeaderBarServiceMock;
    let confirmPopupServiceMock: ConfirmPopupServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        headerBarServiceMock = MockContext.useMock(HeaderBarServiceMock);
        confirmPopupServiceMock = MockContext.useMock(ConfirmPopupServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.overrideComponent(HeaderBarComponent, {
            set: {
                imports: [MockComponent(IconCustomComponent)],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(HeaderBarComponent);
        component = fixture.componentInstance;
    });

    describe('init', () => {
        it('should be disabled by default', () => {
            fixture.detectChanges();
            expect(component.enabled).toBeFalsy();
        });

        it('should evaluate and set enabled from config value if enabled is not defined', () => {
            headerBarServiceMock.enabled$.next(true);
            fixture.detectChanges();
            expect(component.enabled).toBeTrue();
        });

        it('should subscribe to events service and emit onClose', () => {
            spyOn(component.onClose, 'emit');
            fixture.detectChanges();
            eventsServiceMock.newEvents.next({ eventName: 'ConfirmPopupLeaveButton', data: { action: 'close' } });
            expect(component.onClose.emit).toHaveBeenCalled();
        });

        it('should subscribe to events service and emit onBack', () => {
            spyOn(component.onBack, 'emit');
            fixture.detectChanges();
            eventsServiceMock.newEvents.next({ eventName: 'ConfirmPopupLeaveButton', data: { action: 'back' } });
            expect(component.onBack.emit).toHaveBeenCalled();
        });
    });

    describe('onback', () => {
        it('should emit onback event', () => {
            fixture.componentRef.setInput('trackBackClickEvent', { eventName: 'load', data: { component: 'confirm' } });
            spyOn(component.onBack, 'emit');

            component.onBackClick();

            expect(component.onBack.emit).toHaveBeenCalled();
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('load', {
                component: 'confirm',
            });
        });

        it('should open confirm dialog', () => {
            fixture.componentRef.setInput('showConfirmPopup', true);
            fixture.componentRef.setInput('confirmPopupTrackLoad', { eventName: 'load' });
            fixture.componentRef.setInput('confirmPopupTrackClick', { eventName: 'click' });
            component.onBackClick();
            expect(confirmPopupServiceMock.show).toHaveBeenCalledWith({
                action: 'back',
                trackingDataLoad: { eventName: 'load' },
                trackingDataClick: { eventName: 'click' },
            });
        });
    });

    describe('onCloseClick', () => {
        it('should emit onclose event', () => {
            fixture.componentRef.setInput('trackCloseClickEvent', { eventName: 'load', data: { component: 'confirmclose' } });
            spyOn(component.onClose, 'emit');

            component.onCloseClick();

            expect(component.onClose.emit).toHaveBeenCalled();
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('load', {
                component: 'confirmclose',
            });
        });

        it('should open confirm dialog', () => {
            fixture.componentRef.setInput('showConfirmPopup', true);
            fixture.componentRef.setInput('confirmPopupTrackLoad', { eventName: 'load' });
            fixture.componentRef.setInput('confirmPopupTrackClick', { eventName: 'click' });
            component.onCloseClick();
            expect(confirmPopupServiceMock.show).toHaveBeenCalledWith({
                action: 'close',
                trackingDataLoad: { eventName: 'load' },
                trackingDataClick: { eventName: 'click' },
            });
        });
    });
});
