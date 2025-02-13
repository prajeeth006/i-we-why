import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { BottomSheetOverlayComponent } from './bottom-sheet-overlay.component';

/**
 * @whatItDoes Provides functionality to manipulate the bottom sheet overlay
 *
 * @description
 *
 * @stable
 */
@Injectable()
export class BottomSheetOverlayService {
    private currentRef: OverlayRef | null;

    constructor(
        private overlay: OverlayFactory,
        private injector: Injector,
    ) {}

    toggle(open?: boolean) {
        open = open == null ? !this.currentRef : open;

        if (open && !this.currentRef) {
            const overlayRef = this.overlay.create({
                panelClass: 'vn-bottom-sheet-container',
                positionStrategy: this.overlay.position.global().bottom(),
            });

            overlayRef.backdropClick().subscribe(() => this.currentRef?.detach());
            overlayRef.detachments().subscribe(() => {
                this.overlay.dispose(this.currentRef);
                this.currentRef = null;
            });

            const portal = new ComponentPortal(
                BottomSheetOverlayComponent,
                null,
                Injector.create({
                    providers: [{ provide: OverlayRef, useValue: overlayRef }],
                    parent: this.injector,
                }),
            );
            overlayRef.attach(portal);

            this.currentRef = overlayRef;
        } else if (!open && this.currentRef) {
            this.currentRef.detach();
        }
    }
}
