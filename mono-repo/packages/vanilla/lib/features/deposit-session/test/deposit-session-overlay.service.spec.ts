import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { DepositSessionOverlayComponent } from '../src/deposit-session-overlay.component';
import { DepositSessionOverlayService } from '../src/deposit-session-overlay.service';
import { DepositSessionEvent } from '../src/deposit-session.models';

describe('DepositSessionOverlayService', () => {
    let service: DepositSessionOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;

    const depositSessionEvent: DepositSessionEvent = {
        cumulativeAmount: 100,
        currency: 'USD',
    };

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DepositSessionOverlayService],
        });

        overlayRefMock = new OverlayRefMock();
        overlayRefMock.attach.and.returnValue({
            setInput: () => {},
        });
        overlayMock.create.and.returnValue(overlayRefMock);

        service = TestBed.inject(DepositSessionOverlayService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(depositSessionEvent);

            const expectedConfig = {
                panelClass: ['vn-deposit-session-panel', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledOnceWith(expectedConfig);
            expect(overlayRefMock.attach).toHaveBeenCalled();

            const portal: ComponentPortal<DepositSessionOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];

            expect(portal.component).toBe(DepositSessionOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
        });

        it('should not open overlay multiple times', () => {
            service.show(depositSessionEvent);
            service.show(depositSessionEvent);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
