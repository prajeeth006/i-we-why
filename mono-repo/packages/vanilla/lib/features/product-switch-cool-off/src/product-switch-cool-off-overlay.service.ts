import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { ProductSwitchCoolOffComponent } from './product-switch-cool-off.component';

@Injectable()
export class ProductSwitchCoolOffOverlayService {
    private overlay = inject(OverlayFactory);
    private injector = inject(Injector);

    private currentRef: OverlayRef | null;

    show() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['product-switch-cool-off-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            ProductSwitchCoolOffComponent,
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
