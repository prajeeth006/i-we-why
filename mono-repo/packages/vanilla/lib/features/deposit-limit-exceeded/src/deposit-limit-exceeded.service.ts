import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { DepositLimitExceededOverlayComponent } from './deposit-limit-exceeded-overlay.component';

@Injectable()
export class DepositLimitExceededService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
    ) {}

    showOverlay() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-betstation-deposit-limit-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(this.currentRef);
            this.currentRef = null;
        });

        const injector = Injector.create({
            providers: [{ provide: OverlayRef, useValue: overlayRef }],
            parent: this.injector,
        });

        const portal = new ComponentPortal(DepositLimitExceededOverlayComponent, null, injector);

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }
}
