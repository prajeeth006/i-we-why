import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../../shared/overlay-factory/test/overlay-factory.mock';
import { AccountMenuOnboardingOverlayComponent } from '../../src/onboarding/account-menu-onboarding-overlay.component';
import { AccountMenuOnboardingOverlayService } from '../../src/onboarding/account-menu-onboarding-overlay.service';
import { AccountMenuTrackingServiceMock } from '../account-menu-tracking.mock';

describe('AccountMenuOnboardingOverlayService', () => {
    let service: AccountMenuOnboardingOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        MockContext.useMock(AccountMenuTrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AccountMenuOnboardingOverlayService],
        });

        service = TestBed.inject(AccountMenuOnboardingOverlayService);
        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('show', () => {
        it('should show overlay', () => {
            service.show();

            expect(overlayMock.create).toHaveBeenCalledWith({ panelClass: ['vn-account-menu-tutorial-tour-panel', 'generic-modal-overlay'] });
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<AccountMenuOnboardingOverlayComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(AccountMenuOnboardingOverlayComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not show overlay multiple times', () => {
            service.show();

            service.show();

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
