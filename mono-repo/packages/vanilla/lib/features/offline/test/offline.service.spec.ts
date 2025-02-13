import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MockPositionStrategies, OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { OfflineComponent } from '../src/offline.component';
import { OfflineService } from '../src/offline.service';

describe('OfflineService', () => {
    let service: OfflineService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, OfflineService],
        });

        service = TestBed.inject(OfflineService);

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('showOverlay', () => {
        it('should create an overlay', () => {
            service.showOverlay();

            const expectedConfig = {
                hasBackdrop: false,
                panelClass: 'vn-offline-container',
                positionStrategy: new MockPositionStrategies(),
                width: '100%',
                height: '100%',
            };
            expectedConfig.positionStrategy.position = 'g';

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<OfflineComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(OfflineComponent);
            expect(portal.injector!.get(OverlayRef)).toBeDefined();
        });

        it('should not create an overlay if one is already open', () => {
            service.showOverlay();
            service.showOverlay();

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });

        it('should allow to open an overlay after first one is closed', () => {
            service.showOverlay();
            overlayRef.detachments.next();
            service.showOverlay();

            expect(overlayMock.create).toHaveBeenCalledTimes(2);
        });
    });
});
