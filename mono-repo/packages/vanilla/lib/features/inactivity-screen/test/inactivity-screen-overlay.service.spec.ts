import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { InactivityScreenSessionOverlayComponent } from '@frontend/vanilla/features/inactivity-screen';
import { MockContext } from 'moxxi';

import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { InactivityScreenOverlayComponent } from '../src/inactivity-screen-overlay.component';
import { InactivityScreenOverlayService } from '../src/inactivity-screen-overlay.service';
import { InactivityMode, WebVersion } from '../src/inactivity-screen.models';
import { InactivityScreenConfigMock } from './inactivity-screen-config.mock';

describe('InactivityScreenOverlayService', () => {
    let service: InactivityScreenOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;
    let inactivityScreenConfigMock: InactivityScreenConfigMock;
    let deviceServiceMock: DeviceServiceMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        inactivityScreenConfigMock = MockContext.useMock(InactivityScreenConfigMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InactivityScreenOverlayService],
        });

        service = TestBed.inject(InactivityScreenOverlayService);
        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
        inactivityScreenConfigMock.mode = InactivityMode.Betstation;
    });

    describe('showCountdownOverlay', () => {
        it('should show overlay', () => {
            service.showCountdownOverlay();

            expect(overlayMock.create).toHaveBeenCalledWith({ panelClass: ['vn-inactivity-screen-panel', 'vn-dialog-container'] });
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<InactivityScreenOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(InactivityScreenOverlayComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not show overlay multiple times', () => {
            service.showCountdownOverlay();

            service.showCountdownOverlay();

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });

        it('should add panel class based on the web version', () => {
            service.showCountdownOverlay();

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });

        describe('add panel class based on mode = web, device type and web version', () => {
            beforeEach(() => (inactivityScreenConfigMock.mode = InactivityMode.Web));

            it('isMobilePhone = false, webVersion = 1', () => {
                runTest(['generic-modal-popup']);
            });

            it('isMobilePhone = true, webVersion = 1', () => {
                runTest(['generic-modal-popup'], true);
            });

            it('isMobilePhone = false, webVersion = 2', () => {
                runTest(['generic-modal-popup'], false, 2);
            });

            it('isMobilePhone = true, webVersion = 2', () => {
                runTest(['generic-modal-drawer'], true, 2);
            });
        });

        function runTest(panelClass: string[], isMobilePhone: boolean = false, webVersion: WebVersion = 1) {
            deviceServiceMock.isMobilePhone = isMobilePhone;
            inactivityScreenConfigMock.webVersion = webVersion;

            service.showCountdownOverlay();

            expect(overlayMock.create).toHaveBeenCalledWith({ panelClass: panelClass });
        }
    });

    describe('showSessionOverlay', () => {
        it('should show overlay', () => {
            service.showSessionOverlay();

            expect(overlayMock.create).toHaveBeenCalledWith({ panelClass: ['generic-modal-popup'] });
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<InactivityScreenSessionOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(InactivityScreenSessionOverlayComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not show overlay multiple times', () => {
            service.showSessionOverlay();
            service.showSessionOverlay();

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
