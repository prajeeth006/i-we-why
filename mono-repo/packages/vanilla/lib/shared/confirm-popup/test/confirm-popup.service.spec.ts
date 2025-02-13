import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { ConfirmPopupComponent } from '../src/confirm-popup.component';
import { ConfirmPopupOptions } from '../src/confirm-popup.models';
import { ConfirmPopupService } from '../src/confirm-popup.service';

describe('ConfirmPopupService', () => {
    let service: ConfirmPopupService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    const confirmPopupOptions: ConfirmPopupOptions = {
        action: 'back',
    };

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        overlayRef = MockContext.useMock(OverlayRefMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ConfirmPopupService],
        });

        overlayRef = new OverlayRefMock();
        overlayRef.attach.and.returnValue({
            setInput: () => {},
        });
        overlayMock.create.and.returnValue(overlayRef);

        service = TestBed.inject(ConfirmPopupService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(confirmPopupOptions);

            const expectedConfig = {
                backdropClass: 'vn-backdrop',
                panelClass: ['vn-confirm-popup-container', 'generic-modal-popup'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<ConfirmPopupComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(ConfirmPopupComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not open overlay multiple times', () => {
            service.show(confirmPopupOptions);

            service.show(confirmPopupOptions);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
