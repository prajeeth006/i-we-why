import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { VanillaEventNames } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { IconCustomComponent } from '../../../features/icons/src/icon-fast.component';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { ConfirmPopupComponent } from '../src/confirm-popup.component';
import { ConfirmPopupOptions } from '../src/confirm-popup.models';
import { ConfirmPopupConfigMock } from './confirm-popup-config.mock';

describe('ConfirmPopupComponent', () => {
    let fixture: ComponentFixture<ConfirmPopupComponent>;
    let component: ConfirmPopupComponent;
    let overlayRefMock: OverlayRefMock;
    let eventsServiceMock: EventsServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let confirmPopupConfigMock: ConfirmPopupConfigMock;

    const confirmPopupOptions: ConfirmPopupOptions = {
        action: 'back',
        content: {
            title: 'new title',
            text: 'new text',
            leaveButton: 'Leave',
            stayButton: 'Stay',
        },
        trackingDataLoad: { eventName: 'load', data: { component: 'confirm' } },
        trackingDataClick: { eventName: 'click', data: { component: 'confirm click' } },
    };

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        confirmPopupConfigMock = MockContext.useMock(ConfirmPopupConfigMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        TestBed.overrideComponent(ConfirmPopupComponent, {
            set: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        confirmPopupConfigMock.resources = {
            messages: { title: 'conf title', text: 'conf text', leaveButton: 'conf Leave', stayButton: 'conf Stay' },
        };
    });

    function initComponent() {
        fixture = TestBed.createComponent(ConfirmPopupComponent);
        component = fixture.componentInstance;
    }

    describe('init', () => {
        it('should set options and content from input', () => {
            initComponent();
            fixture.componentRef.setInput('options', confirmPopupOptions);
            fixture.detectChanges();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('load', { component: 'confirm' });
            expect(component.options()).toBe(confirmPopupOptions);
            expect(component.content()).toEqual({
                title: 'new title',
                text: 'new text',
                leaveButton: 'Leave',
                stayButton: 'Stay',
            });
        });

        it('should set from config', fakeAsync(() => {
            initComponent();
            fixture.componentRef.setInput('options', { action: 'back' });
            fixture.detectChanges();

            confirmPopupConfigMock.whenReady.next();

            tick();

            expect(component.options()).toEqual({ action: 'back' });
            expect(component.content()).toEqual({
                title: 'conf title',
                text: 'conf text',
                leaveButton: 'conf Leave',
                stayButton: 'conf Stay',
            });
        }));
    });

    describe('leave()', () => {
        it('should track, fire event and close overlay', () => {
            initComponent();
            fixture.componentRef.setInput('options', confirmPopupOptions);
            fixture.detectChanges();
            component.leave();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('click', {
                'component': 'confirm click',
                'component.EventDetails': 'Leave',
            });
            expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: VanillaEventNames.ConfirmPopupLeaveButton, data: { action: 'back' } });
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('stay()', () => {
        it('should track and close overlay', () => {
            initComponent();
            fixture.componentRef.setInput('options', confirmPopupOptions);
            fixture.detectChanges();
            component.stay();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('click', {
                'component': 'confirm click',
                'component.EventDetails': 'Stay',
            });
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
