import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { JackpotWinnerPopupComponent } from '../../jackpot-winner/src/jackpot-winner-popup.component';
import { JackpotWinnerPopupService } from '../../jackpot-winner/src/jackpot-winner-popup.service';
import { JackpotWinnerEvent } from '../../jackpot-winner/src/jackpot-winner.models';

describe('JackpotWinnerPopupService', () => {
    let service: JackpotWinnerPopupService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;
    const messageToSend: JackpotWinnerEvent = {
        currency: 'EURO',
        winValue: '260',
    };
    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, JackpotWinnerPopupService],
        });

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);

        service = TestBed.inject(JackpotWinnerPopupService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(messageToSend);

            const expectedConfig = {
                panelClass: ['vn-jackpot-winner-popup', 'generic-modal-popup'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<JackpotWinnerPopupComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(JackpotWinnerPopupComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not open overlay multiple times', () => {
            service.show(messageToSend);
            service.show(messageToSend);
            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
