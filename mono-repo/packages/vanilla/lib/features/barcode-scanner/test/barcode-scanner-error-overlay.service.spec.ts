import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { BarcodeScannerErrorOverlayComponent } from '../src/barcode-scanner-error-overlay.component';
import { BarcodeScannerErrorOverlayService } from '../src/barcode-scanner-error-overlay.service';

describe('BarcodeScannerErrorOverlayService', () => {
    let service: BarcodeScannerErrorOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BarcodeScannerErrorOverlayService],
        });

        overlayRefMock = new OverlayRefMock();
        overlayRefMock.attach.and.returnValue({
            setInput: () => {},
        });
        overlayMock.create.and.returnValue(overlayRefMock);

        service = TestBed.inject(BarcodeScannerErrorOverlayService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.showError(NativeEventType.NFCCARDSCANNED);

            const expectedConfig = {
                panelClass: ['vn-barcode-error', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledOnceWith(expectedConfig);
            expect(overlayRefMock.attach).toHaveBeenCalled();

            const portal: ComponentPortal<BarcodeScannerErrorOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];

            expect(portal.component).toBe(BarcodeScannerErrorOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
        });

        it('should not open overlay multiple times', () => {
            service.showError(NativeEventType.NFCCARDSCANNED);
            service.showError(NativeEventType.NFCCARDSCANNED);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
