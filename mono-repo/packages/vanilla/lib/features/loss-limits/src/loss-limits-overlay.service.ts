import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { LossLimitsOverlayComponent } from './loss-limits-overlay.component';
import { LossLimitsDetails } from './loss-limits.models';

@Injectable()
export class LossLimitsOverlayService {
    private readonly injector = inject(Injector);
    private readonly overlay = inject(OverlayFactory);
    private currentRef: OverlayRef | null;

    show(lossLimitsDetails: LossLimitsDetails[]) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-loss-limits-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            LossLimitsOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('lossLimitsDetails', lossLimitsDetails);
        this.currentRef = overlayRef;
    }
}
