import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { SessionLimitsLogoutPopupComponent } from './session-limits-logout-popup.component';

@Injectable()
export class SessionLimitsLogoutPopupService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
    ) {}

    show(currentLimit: number = 0) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-session-limits-logout-panel', 'generic-modal-popup'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(SessionLimitsLogoutPopupComponent, null, this.createInjector(overlayRef));

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('currentLimit', currentLimit);
        this.currentRef = overlayRef;
    }

    private createInjector(overlayRef: OverlayRef) {
        return Injector.create({
            providers: [{ provide: OverlayRef, useValue: overlayRef }],
            parent: this.injector,
        });
    }
}
