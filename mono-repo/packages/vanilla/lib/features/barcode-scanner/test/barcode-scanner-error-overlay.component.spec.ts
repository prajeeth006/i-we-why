import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ViewTemplate } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { BarcodeScannerErrorOverlayComponent } from '../src/barcode-scanner-error-overlay.component';
import { BarcodeScannerConfigMock } from './barcode-scanner.mock';

describe('BarcodeScannerErrorOverlayComponent', () => {
    let fixture: ComponentFixture<BarcodeScannerErrorOverlayComponent>;
    let barcodeScannerConfigMock: BarcodeScannerConfigMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        barcodeScannerConfigMock = MockContext.useMock(BarcodeScannerConfigMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        barcodeScannerConfigMock.overlays = <ViewTemplate[]>[
            {
                messages: {
                    type: 'barcode',
                },
            },
        ];

        fixture = TestBed.createComponent(BarcodeScannerErrorOverlayComponent);
        fixture.componentRef.setInput('type', 'barcode');

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('overlay should have value', fakeAsync(() => {
            barcodeScannerConfigMock.whenReady.next();
            tick();

            expect(fixture.componentInstance.overlay()).toBeDefined();
        }));
    });

    describe('close', () => {
        it('should close the overlay', () => {
            fixture.componentInstance.close();

            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
