import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { SessionLimitsLogoutPopupComponent } from '../src/session-limits-logout-popup.component';
import { SessionLimitsLogoutPopupService } from '../src/session-limits-logout-popup.service';

describe('SessionLimitsLogoutPopupService', () => {
    let service: SessionLimitsLogoutPopupService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SessionLimitsLogoutPopupService],
        });

        overlayRef = new OverlayRefMock();
        overlayRef.attach.and.returnValue({
            setInput: () => {},
        });
        overlayMock.create.and.returnValue(overlayRef);

        service = TestBed.inject(SessionLimitsLogoutPopupService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(5);

            const expectedConfig = {
                panelClass: ['vn-session-limits-logout-panel', 'generic-modal-popup'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<SessionLimitsLogoutPopupComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(SessionLimitsLogoutPopupComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not open overlay multiple times', () => {
            service.show(5);

            service.show(6);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
