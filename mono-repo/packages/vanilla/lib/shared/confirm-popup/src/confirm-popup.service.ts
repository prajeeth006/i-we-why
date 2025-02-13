import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { ConfirmPopupComponent } from './confirm-popup.component';
import { ConfirmPopupOptions } from './confirm-popup.models';

@Injectable({
    providedIn: 'root',
})
export class ConfirmPopupService {
    private readonly injector = inject(Injector);
    private readonly overlay = inject(OverlayFactory);
    private currentRef: OverlayRef | null;

    show(options: ConfirmPopupOptions) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            backdropClass: 'vn-backdrop',
            panelClass: ['vn-confirm-popup-container', 'generic-modal-popup'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            ConfirmPopupComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('options', options);
        this.currentRef = overlayRef;
    }
}
