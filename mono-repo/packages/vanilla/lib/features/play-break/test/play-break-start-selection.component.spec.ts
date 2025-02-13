import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ValidationHelperServiceMock } from '../../../shared/forms/test/forms/validation-helper.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { PlayBreakStartSelectionComponent } from '../src/play-break-start-selection.component';
import { PlayBreakNotification, PlayBreakWorkflowStep } from '../src/play-break.models';
import { PlayBreakConfigMock, PlayBreakServiceMock, PlayBreakTrackingServiceMock } from './play-break.mocks';

describe('PlayBreakStartSelectionComponent', () => {
    let fixture: ComponentFixture<PlayBreakStartSelectionComponent>;
    let component: PlayBreakStartSelectionComponent;
    let playBreakServiceMock: PlayBreakServiceMock;
    let playBreakTrackingServiceMock: PlayBreakTrackingServiceMock;
    let overlayRefMock: OverlayRefMock;
    let playBreakNotification: PlayBreakNotification;

    beforeEach(() => {
        playBreakServiceMock = MockContext.useMock(PlayBreakServiceMock);
        playBreakTrackingServiceMock = MockContext.useMock(PlayBreakTrackingServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(PlayBreakConfigMock);
        MockContext.useMock(ValidationHelperServiceMock);

        playBreakNotification = {
            cstEventId: '',
            selectedPlayBreakStart: 15,
        };

        TestBed.overrideComponent(PlayBreakStartSelectionComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(PlayBreakStartSelectionComponent);
        fixture.componentRef.setInput('notification', playBreakNotification);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track and init start selection form', () => {
            expect(component.breakStartForm).toBeDefined();
            expect(component.startSelectionForm).toBeDefined();
            expect(playBreakTrackingServiceMock.trackDrawerOpenedSecondStep).toHaveBeenCalled();
        });
    });

    describe('confirmSelection', () => {
        it('should track and change play break workflow to confirmation', () => {
            component.confirmSelection();

            expect(playBreakServiceMock.changePlayBreakWorkflow).toHaveBeenCalledOnceWith({
                step: PlayBreakWorkflowStep.Confirmation,
                notification: playBreakNotification,
            });
            expect(playBreakTrackingServiceMock.trackDrawerContinueSecondStep).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('close', () => {
        it('should track and detach the overlay', () => {
            component.close();

            expect(playBreakTrackingServiceMock.trackDrawerCancelSecondStep).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
