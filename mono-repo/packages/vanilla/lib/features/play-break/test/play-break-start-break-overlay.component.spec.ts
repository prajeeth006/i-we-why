import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSpan, ToastrSchedule, ToastrType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { PlayBreakNotificationOverlayComponent } from '../src/play-break-notification-overlay.component';
import { PlayBreakNotification } from '../src/play-break.models';
import { PlayBreakConfigMock, PlayBreakServiceMock, PlayBreakTrackingServiceMock } from './play-break.mocks';

describe('PlayBreakNotificationOverlayComponent', () => {
    let fixture: ComponentFixture<PlayBreakNotificationOverlayComponent>;
    let component: PlayBreakNotificationOverlayComponent;
    let playBreakServiceMock: PlayBreakServiceMock;
    let playBreakTrackingServiceMock: PlayBreakTrackingServiceMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let overlayRefMock: OverlayRefMock;
    let playBreakNotification: PlayBreakNotification;

    beforeEach(() => {
        playBreakServiceMock = MockContext.useMock(PlayBreakServiceMock);
        playBreakTrackingServiceMock = MockContext.useMock(PlayBreakTrackingServiceMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(PlayBreakConfigMock);

        playBreakNotification = {
            cstEventId: '',
            selectedPlayBreakStart: 2,
            selectedPlayBreakDuration: 1,
            playBreakStartTime: TimeSpan.fromMinutes(3).totalMilliseconds,
            playBreakEndTime: TimeSpan.fromMinutes(4).totalMilliseconds,
            playBreakInGC: 'Y',
        };

        TestBed.overrideComponent(PlayBreakNotificationOverlayComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(PlayBreakNotificationOverlayComponent);
        fixture.componentRef.setInput('notification', playBreakNotification);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should init content and track', () => {
            expect(component.content).toBeDefined();
            expect(playBreakTrackingServiceMock.trackNotificationPopupDisplayed).toHaveBeenCalled();
        });
    });

    describe('continue', () => {
        it('should track and add break start toaster', () => {
            component.continue();

            expect(playBreakServiceMock.formatTime).toHaveBeenCalledWith(TimeSpan.fromMinutes(2), component.content()?.validation);
            expect(playBreakTrackingServiceMock.trackNotificationPopupOk).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
            expect(toastrQueueServiceMock.add).toHaveBeenCalledOnceWith(ToastrType.PlayBreakConfirmationDelayed, {
                placeholders: {
                    duration: undefined,
                    interceptor: 'hard interceptor',
                },
                schedule: ToastrSchedule.Immediate,
            });
        });
    });

    describe('contactUs', () => {
        it('should track and add break start toaster', () => {
            playBreakNotification.selectedPlayBreakStart = 0;
            playBreakNotification.playBreakStartTime = 0;
            component.contactUs();

            expect(playBreakServiceMock.formatTime).toHaveBeenCalledWith(TimeSpan.fromMinutes(1), component.content()?.validation);
            expect(playBreakTrackingServiceMock.trackNotificationPopupContactUs).toHaveBeenCalled();
            expect(toastrQueueServiceMock.add).toHaveBeenCalledOnceWith(ToastrType.PlayBreakConfirmation, {
                placeholders: {
                    duration: undefined,
                    interceptor: 'hard interceptor',
                },
                schedule: ToastrSchedule.AfterNextNavigation,
            });
        });
    });
});
