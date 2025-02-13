import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MockPositionStrategies, OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { BottomSheetOverlayComponent } from '../src/bottom-sheet-overlay.component';
import { BottomSheetOverlayService } from '../src/bottom-sheet-overlay.service';

describe('BottomSheetOverlayService', () => {
    let service: BottomSheetOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, BottomSheetOverlayService],
        });

        service = TestBed.inject(BottomSheetOverlayService);
        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('toggle', () => {
        it('should create an overlay', () => {
            service.toggle();

            const expectedConfig = {
                panelClass: 'vn-bottom-sheet-container',
                positionStrategy: new MockPositionStrategies(),
            };
            expectedConfig.positionStrategy.position = 'gb';

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<BottomSheetOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(BottomSheetOverlayComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not create an overlay if one is already open', () => {
            service.toggle(true);
            service.toggle(true);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });

        it('should allow to open an overlay after first one is closed', () => {
            service.toggle();
            overlayRef.detachments.next();
            service.toggle();

            expect(overlayMock.create).toHaveBeenCalledTimes(2);
        });

        it('should detach overlay on backdrop click', () => {
            service.toggle();

            overlayRef.backdropClick.next();

            expect(overlayRef.detach).toHaveBeenCalled();
        });

        it('should should dispose after detached', () => {
            service.toggle();

            overlayRef.detachments.next();

            expect(overlayMock.dispose).toHaveBeenCalledWith(overlayRef);
        });

        it('should detach overlay when closed', () => {
            service.toggle();
            service.toggle();

            expect(overlayRef.detach).toHaveBeenCalled();
        });
    });
});
