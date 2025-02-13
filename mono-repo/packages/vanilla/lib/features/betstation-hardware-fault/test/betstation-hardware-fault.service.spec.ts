import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { BetstationHardwareFaultOverlayComponent } from '../src/betstation-hardware-fault-overlay.component';
import { BetstationHardwareFaultService } from '../src/betstation-hardware-fault.service';

describe('BetstationHardwareFaultService', () => {
    let service: BetstationHardwareFaultService;
    let overlayFactoryMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        overlayFactoryMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BetstationHardwareFaultService],
        });

        overlayRefMock = new OverlayRefMock();
        overlayRefMock.attach.and.returnValue({
            setInput: () => {},
        });
        overlayFactoryMock.create.and.returnValue(overlayRefMock);

        service = TestBed.inject(BetstationHardwareFaultService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.showOverlay(NativeEventType.DEVICE_FAILURE);

            const expectedConfig = {
                panelClass: [NativeEventType.DEVICE_FAILURE.toLowerCase(), 'vn-hardware-fault', 'vn-dialog-container'],
            };

            expect(overlayFactoryMock.create).toHaveBeenCalledOnceWith(expectedConfig);
            expect(overlayRefMock.attach).toHaveBeenCalled();

            const portal: ComponentPortal<BetstationHardwareFaultOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];

            expect(portal.component).toBe(BetstationHardwareFaultOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
        });

        it('should not open overlay multiple times', () => {
            service.showOverlay(NativeEventType.DEVICE_FAILURE);
            service.showOverlay(NativeEventType.DEVICE_FAILURE);

            expect(overlayFactoryMock.create).toHaveBeenCalledTimes(1);
        });

        it('should close overlay if open with same errorCode', () => {
            const overlays = new Map<string, OverlayRefMock>();
            overlays.set('errorcode', overlayRefMock);
            overlayFactoryMock.overlayRefs = overlays;

            service.showOverlay('errorCode');
            service.closeOverlay('errorCode');

            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
