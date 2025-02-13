import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { LossLimitsOverlayComponent } from '../src/loss-limits-overlay.component';
import { LossLimitsOverlayService } from '../src/loss-limits-overlay.service';
import { LossLimitsDetails, LossLimitsType } from '../src/loss-limits.models';

describe('LossLimitsOverlayService', () => {
    let service: LossLimitsOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;

    const lossLimitsDetails: LossLimitsDetails[] = [
        {
            notificationType: LossLimitsType.DailyLimit,
            playerLimitAmount: 10,
            totalLossAmount: 8,
            pendingLossAmount: 2,
            currency: 'JPY',
            usedPercentage: 80,
            isMandatory: false,
        },
    ];

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LossLimitsOverlayService],
        });

        overlayRefMock = new OverlayRefMock();
        overlayRefMock.attach.and.returnValue({
            setInput: () => {},
        });
        overlayMock.create.and.returnValue(overlayRefMock);

        service = TestBed.inject(LossLimitsOverlayService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(lossLimitsDetails);

            const expectedConfig = {
                panelClass: ['vn-loss-limits-panel', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledOnceWith(expectedConfig);
            expect(overlayRefMock.attach).toHaveBeenCalled();

            const portal: ComponentPortal<LossLimitsOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];

            expect(portal.component).toBe(LossLimitsOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
        });

        it('should not open overlay multiple times', () => {
            service.show(lossLimitsDetails);
            service.show(lossLimitsDetails);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
