import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { RangeDatepickerOverlayComponent } from './range-datepicker-overlay.component';
import { RangeDatepickerOptions } from './range-datepicker.models';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RangeDatepickerOverlayService {
    private overlay = inject(OverlayFactory);
    private injector = inject(Injector);

    private currentRef: OverlayRef | null;

    toggleRangeDatepicker(options?: RangeDatepickerOptions) {
        if (this.currentRef) {
            this.currentRef.detach();
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-range-datepicker-panel', 'generic-modal-popup'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            RangeDatepickerOverlayComponent,
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
