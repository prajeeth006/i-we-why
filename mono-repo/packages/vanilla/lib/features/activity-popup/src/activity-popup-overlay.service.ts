import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { ActivityPopupOverlayComponent } from './activity-popup-overlay.component';

@Injectable()
export class ActivityPopupOverlayService {
    private overlay = inject(OverlayFactory);
    private injector = inject(Injector);

    private currentRef: OverlayRef | null;

    show() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-activity-popup-panel', 'generic-modal-popup'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(ActivityPopupOverlayComponent, null, this.createInjector(overlayRef));

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }

    private createInjector(overlayRef: OverlayRef) {
        return Injector.create({ providers: [{ provide: OverlayRef, useValue: overlayRef }], parent: this.injector });
    }
}
