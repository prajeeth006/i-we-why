import { OverlayRef } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { PlayBreakOverlayService } from '../src/play-break-overlay.service';
import { PlayBreakNotification, PlayBreakWorkflowStep } from '../src/play-break.models';
import { PlayBreakServiceMock } from './play-break.mocks';

describe('PlayBreakOverlayService', () => {
    let service: PlayBreakOverlayService;
    let overlayFactoryMock: OverlayFactoryMock;
    let playBreakServiceMock: PlayBreakServiceMock;
    let deviceServiceMock: DeviceServiceMock;
    let overlayRefMock: OverlayRefMock;
    let playBreakNotification: PlayBreakNotification;

    beforeEach(() => {
        overlayFactoryMock = MockContext.useMock(OverlayFactoryMock);
        playBreakServiceMock = MockContext.useMock(PlayBreakServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);

        overlayRefMock = new OverlayRefMock();
        overlayRefMock.attach.and.returnValue({
            setInput: () => {},
        });
        overlayFactoryMock.create.and.returnValue(overlayRefMock);

        playBreakNotification = {
            cstEventId: '',
            selectedPlayBreakStart: 15,
        };

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PlayBreakOverlayService],
        });

        service = TestBed.inject(PlayBreakOverlayService);
    });

    describe('playBreakWorkflow event', () => {
        it('should create duration selection popup or drawer when mobile', () => {
            assertModal('popup', PlayBreakWorkflowStep.DurationSelection);

            deviceServiceMock.isMobilePhone = true;
            assertModal('drawer', PlayBreakWorkflowStep.DurationSelection);
        });

        it('should create start selection popup or drawer when mobile', () => {
            assertModal('popup', PlayBreakWorkflowStep.StartSelection);

            deviceServiceMock.isMobilePhone = true;
            assertModal('drawer', PlayBreakWorkflowStep.StartSelection);
        });

        it('should create confirmation popup or drawer when mobile', () => {
            assertModal('popup', PlayBreakWorkflowStep.Confirmation);

            deviceServiceMock.isMobilePhone = true;
            assertModal('drawer', PlayBreakWorkflowStep.StartSelection);
        });

        it('should create submit break selections overlay', () => {
            assertModal('overlay', PlayBreakWorkflowStep.SubmitBreakSelections);

            deviceServiceMock.isMobilePhone = true;
            assertModal('drawer', PlayBreakWorkflowStep.StartSelection);
        });
    });

    describe('showBreakConfig', () => {
        it('should create play break overlay', () => {
            service.showBreakConfig(playBreakNotification);

            assertModal('overlay');
        });
    });

    describe('showSoftBreak', () => {
        it('should create play break notification overlay', () => {
            service.showSoftBreak(playBreakNotification);

            assertModal('overlay');
        });
    });

    describe('showMandatoryBreak', () => {
        it('should create play break mandatory overlay', () => {
            service.showMandatoryBreak(playBreakNotification);

            assertModal('overlay');
        });
    });

    function assertModal(type: string, step?: PlayBreakWorkflowStep) {
        if (step) {
            playBreakServiceMock.playBreakWorkflow.next({ step, notification: playBreakNotification });
        }

        expect(overlayFactoryMock.create).toHaveBeenCalledWith({
            panelClass: [`generic-modal-${type}`, 'vn-player-break-panel'],
        });
        expect(overlayRefMock.detachments).toHaveBeenCalled();
        expect(overlayRefMock.attach).toHaveBeenCalled();

        const portal = overlayRefMock.attach.calls.mostRecent().args[0];

        expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
    }
});
