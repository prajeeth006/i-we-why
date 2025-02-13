import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { PlayBreakOverlayComponent } from '../src/play-break-overlay.component';
import { PlayBreakAcknowledgeRequest, PlayBreakAction, PlayBreakNotification, PlayBreakWorkflowStep } from '../src/play-break.models';
import { PlayBreakConfigMock, PlayBreakServiceMock, PlayBreakTrackingServiceMock } from './play-break.mocks';

describe('PlayBreakOverlayComponent', () => {
    let fixture: ComponentFixture<PlayBreakOverlayComponent>;
    let component: PlayBreakOverlayComponent;
    let playBreakServiceMock: PlayBreakServiceMock;
    let playBreakTrackingServiceMock: PlayBreakTrackingServiceMock;
    let loggerMock: LoggerMock;
    let overlayRefMock: OverlayRefMock;
    let playBreakNotification: PlayBreakNotification;

    beforeEach(() => {
        playBreakServiceMock = MockContext.useMock(PlayBreakServiceMock);
        playBreakTrackingServiceMock = MockContext.useMock(PlayBreakTrackingServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(PlayBreakConfigMock);

        playBreakNotification = {
            cstEventId: '123',
            selectedPlayBreakDuration: 1,
            selectedPlayBreakStart: 2,
            isPlayBreakOpted: 'Y',
        };

        TestBed.overrideComponent(PlayBreakOverlayComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(PlayBreakOverlayComponent);
        fixture.componentRef.setInput('notification', playBreakNotification);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track and init content', () => {
            expect(component.content).toBeDefined();
            expect(playBreakTrackingServiceMock.trackInterceptorShown).toHaveBeenCalledOnceWith(true);
        });

        it('should send acknowledgement on play break workflow event', fakeAsync(() => {
            playBreakServiceMock.acknowledgePlayBreak.and.returnValue(Promise.resolve({}));
            playBreakServiceMock.playBreakWorkflow.next({ step: PlayBreakWorkflowStep.SubmitBreakSelections, notification: playBreakNotification });
            tick();

            expect(playBreakServiceMock.acknowledgePlayBreak).toHaveBeenCalledOnceWith(<PlayBreakAcknowledgeRequest>{
                actionName: PlayBreakAction.After,
                cstEventId: playBreakNotification.cstEventId,
                playBreakDuration: playBreakNotification.selectedPlayBreakDuration,
                afterXMinutes: playBreakNotification.selectedPlayBreakStart,
            });
            expect(overlayRefMock.detach).toHaveBeenCalled();
        }));

        it('should log on send acknowledgement error', fakeAsync(() => {
            playBreakServiceMock.acknowledgePlayBreak.and.returnValue(Promise.resolve({ responseCode: 101 }));
            playBreakServiceMock.playBreakWorkflow.next({ step: PlayBreakWorkflowStep.SubmitBreakSelections, notification: playBreakNotification });
            tick();

            expect(loggerMock.error).toHaveBeenCalledOnceWith({ responseCode: 101 });
            expect(overlayRefMock.detach).toHaveBeenCalled();
        }));
    });
});
