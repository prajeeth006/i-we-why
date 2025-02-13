import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { DepositLimitExceededOverlayComponent } from '../src/deposit-limit-exceeded-overlay.component';
import { DepositLimitExceededService } from '../src/deposit-limit-exceeded.service';

describe('DepositLimitExceededService', () => {
    let service: DepositLimitExceededService;
    let overlayMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DepositLimitExceededService],
        });

        overlayMock.create.and.returnValue(overlayRefMock);

        service = TestBed.inject(DepositLimitExceededService);
    });

    describe('showOverlay', () => {
        it('should create an overlay', () => {
            service.showOverlay();

            const expectedConfig = {
                panelClass: ['vn-betstation-deposit-limit-panel', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRefMock.attach).toHaveBeenCalled();
            const portal: ComponentPortal<DepositLimitExceededOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(DepositLimitExceededOverlayComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRefMock);
        });
    });
});
