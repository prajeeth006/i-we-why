import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { BalanceTransferOverlayComponent } from '../src/balance-transfer-overlay.component';
import { BalanceTransferService } from '../src/balance-transfer.service';

describe('BalanceTransferService ', () => {
    let service: BalanceTransferService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BalanceTransferService],
        });

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);

        service = TestBed.inject(BalanceTransferService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show();

            const expectedConfig = {
                panelClass: ['vn-balance-transfer', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<BalanceTransferOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(BalanceTransferOverlayComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not open overlay multiple times', () => {
            service.show();
            service.show();

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
