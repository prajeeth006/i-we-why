import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { PlayerActiveWagerOverlayComponent } from '../src/player-active-wager-overlay.component';
import { PlayerActiveWagerOverlayService } from '../src/player-active-wager-overlay.service';

describe('PlayerActiveWagerOverlayService', () => {
    let service: PlayerActiveWagerOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PlayerActiveWagerOverlayService],
        });

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);

        service = TestBed.inject(PlayerActiveWagerOverlayService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(1000);

            const expectedConfig = {
                panelClass: ['vn-player-wager-popup', 'generic-modal-popup'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<PlayerActiveWagerOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(PlayerActiveWagerOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not open overlay multiple times', () => {
            service.show(1000);
            service.show(2000);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
