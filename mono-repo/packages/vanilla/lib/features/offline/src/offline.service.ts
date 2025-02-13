import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { OfflineComponent } from './offline.component';

@Injectable({
    providedIn: 'root',
})
export class OfflineService {
    private overlay = inject(OverlayFactory);
    private injector = inject(Injector);

    private currentRef: OverlayRef | null;

    showOverlay() {
        if (!this.currentRef) {
            const overlayRef = this.overlay.create({
                hasBackdrop: false,
                panelClass: 'vn-offline-container',
                positionStrategy: this.overlay.position.global(),
                width: '100%',
                height: '100%',
            });
            overlayRef.detachments().subscribe(() => {
                this.overlay.dispose(this.currentRef);
                this.currentRef = null;
            });

            const portal = new ComponentPortal(
                OfflineComponent,
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
}
