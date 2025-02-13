import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { BetstationHardwareFaultOverlayComponent } from './betstation-hardware-fault-overlay.component';

@Injectable()
export class BetstationHardwareFaultService {
    private readonly injector = inject(Injector);
    private readonly overlay = inject(OverlayFactory);
    private currentRef: OverlayRef | null;

    showOverlay(type: string) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: [`${type.toLowerCase()}`, 'vn-hardware-fault', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            BetstationHardwareFaultOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('type', type.toUpperCase());
        this.currentRef = overlayRef;
    }

    closeOverlay(errorCode: string) {
        const overlayRef = this.overlay.overlayRefs.get(errorCode.toLowerCase());

        if (overlayRef == this.currentRef) {
            this.currentRef?.detach();
        }
    }
}
