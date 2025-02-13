import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { BarcodeScannerErrorOverlayComponent } from './barcode-scanner-error-overlay.component';

@Injectable()
export class BarcodeScannerErrorOverlayService {
    private readonly injector = inject(Injector);
    private readonly overlay = inject(OverlayFactory);
    private currentRef: OverlayRef | null;

    showError(type: string) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-barcode-error', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            BarcodeScannerErrorOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('type', type);
        this.currentRef = overlayRef;
    }
}
