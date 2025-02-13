import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { PlayBreakConfirmationComponent } from '../src/play-break-confirmation.component';
import { PlayBreakNotification, PlayBreakWorkflowStep } from '../src/play-break.models';
import { PlayBreakConfigMock, PlayBreakServiceMock, PlayBreakTrackingServiceMock } from './play-break.mocks';

describe('PlayBreakConfirmationComponent', () => {
    let fixture: ComponentFixture<PlayBreakConfirmationComponent>;
    let component: PlayBreakConfirmationComponent;
    let playBreakServiceMock: PlayBreakServiceMock;
    let playBreakTrackingServiceMock: PlayBreakTrackingServiceMock;
    let overlayRefMock: OverlayRefMock;
    let playBreakNotification: PlayBreakNotification;

    beforeEach(() => {
        playBreakServiceMock = MockContext.useMock(PlayBreakServiceMock);
        playBreakTrackingServiceMock = MockContext.useMock(PlayBreakTrackingServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(PlayBreakConfigMock);

        playBreakNotification = {
            cstEventId: '',
            selectedPlayBreakDuration: 10,
            selectedPlayBreakStart: 15,
        };

        TestBed.overrideComponent(PlayBreakConfirmationComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(PlayBreakConfirmationComponent);
        fixture.componentRef.setInput('notification', playBreakNotification);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track and init break duration, break start, content', () => {
            expect(playBreakTrackingServiceMock.trackConfirmationDrawerOpened).toHaveBeenCalled();
        });
    });

    describe('changeSettings', () => {
        it('should track and change play break workflow to duration selection', () => {
            component.changeSettings();

            expect(playBreakServiceMock.changePlayBreakWorkflow).toHaveBeenCalledOnceWith({
                step: PlayBreakWorkflowStep.DurationSelection,
                notification: playBreakNotification,
            });
            expect(playBreakTrackingServiceMock.trackConfirmationDrawerChangeDuration).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('confirm', () => {
        it('should track and change play break workflow to submit break selections', () => {
            component.confirm();

            expect(playBreakServiceMock.changePlayBreakWorkflow).toHaveBeenCalledOnceWith({
                step: PlayBreakWorkflowStep.SubmitBreakSelections,
                notification: playBreakNotification,
            });
            expect(playBreakTrackingServiceMock.trackConfirmationDrawerConfirm).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('close', () => {
        it('should track and detach the overlay', () => {
            component.close();

            expect(playBreakTrackingServiceMock.trackConfirmationDrawerCancel).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
