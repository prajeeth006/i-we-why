import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { ActivityPopupOverlayComponent } from '../src/activity-popup-overlay.component';
import { ActivityPopupOverlayService } from '../src/activity-popup-overlay.service';

describe('ActivityPopupOverlayService', () => {
    let service: ActivityPopupOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ActivityPopupOverlayService],
        });

        service = TestBed.inject(ActivityPopupOverlayService);
        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('show', () => {
        it('should show overlay', () => {
            service.show();

            expect(overlayMock.create).toHaveBeenCalledWith({ panelClass: ['vn-activity-popup-panel', 'generic-modal-popup'] });
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<ActivityPopupOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(ActivityPopupOverlayComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not show overlay multiple times', () => {
            service.show();

            service.show();

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
