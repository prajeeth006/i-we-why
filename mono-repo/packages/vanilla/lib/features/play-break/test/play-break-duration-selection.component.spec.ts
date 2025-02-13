import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { PlayBreakDurationSelectionComponent } from '../src/play-break-duration-selection.component';
import { PlayBreakNotification, PlayBreakWorkflowStep } from '../src/play-break.models';
import { PlayBreakConfigMock, PlayBreakServiceMock, PlayBreakTrackingServiceMock } from './play-break.mocks';

describe('PlayBreakDurationSelectionComponent', () => {
    let fixture: ComponentFixture<PlayBreakDurationSelectionComponent>;
    let component: PlayBreakDurationSelectionComponent;
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
        };

        TestBed.overrideComponent(PlayBreakDurationSelectionComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(PlayBreakDurationSelectionComponent);
        fixture.componentRef.setInput('notification', playBreakNotification);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track and init duration selection form', () => {
            expect(component.breakDurationForm).toBeDefined();
            expect(component.durationSelectionForm).toBeDefined();
            expect(playBreakTrackingServiceMock.trackDurationSelectionOpen).toHaveBeenCalled();
        });
    });

    describe('confirmSelection', () => {
        it('should track and change play break workflow to start selection', () => {
            component.confirmSelection();

            expect(playBreakServiceMock.changePlayBreakWorkflow).toHaveBeenCalledOnceWith({
                step: PlayBreakWorkflowStep.StartSelection,
                notification: playBreakNotification,
            });
            expect(playBreakTrackingServiceMock.trackDrawerContinue).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('close', () => {
        it('should track and detach the overlay', () => {
            component.close();

            expect(playBreakTrackingServiceMock.trackDurationSelectionCancel).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
