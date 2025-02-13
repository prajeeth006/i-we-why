import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { BalanceTransferOverlayComponent } from './balance-transfer-overlay.component';

@Injectable()
export class BalanceTransferService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
    ) {}

    show() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-balance-transfer', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            BalanceTransferOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }
}
