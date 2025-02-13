import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { AccountMenuTrackingService } from '../account-menu-tracking.service';
import { AccountMenuOnboardingOverlayComponent } from './account-menu-onboarding-overlay.component';

@Injectable({ providedIn: 'root' })
export class AccountMenuOnboardingOverlayService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
        private accountMenuTrackingService: AccountMenuTrackingService,
    ) {}

    show() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-account-menu-tutorial-tour-panel', 'generic-modal-overlay'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(AccountMenuOnboardingOverlayComponent, null, this.createInjector(overlayRef));

        overlayRef.attach(portal);
        this.currentRef = overlayRef;

        this.accountMenuTrackingService.trackOnboardingLoad();
    }

    private createInjector(overlayRef: OverlayRef) {
        return Injector.create({ providers: [{ provide: OverlayRef, useValue: overlayRef }], parent: this.injector });
    }
}
