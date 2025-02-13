import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { DepositSessionOverlayComponent } from './deposit-session-overlay.component';
import { DepositSessionEvent } from './deposit-session.models';

@Injectable({
    providedIn: 'root',
})
export class DepositSessionOverlayService {
    private currentRef: OverlayRef | null;

    private injector = inject(Injector);
    private overlay = inject(OverlayFactory);

    show(depositSessionEvent: DepositSessionEvent) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-deposit-session-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            DepositSessionOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('depositSessionEvent', depositSessionEvent);
        this.currentRef = overlayRef;
    }
}
