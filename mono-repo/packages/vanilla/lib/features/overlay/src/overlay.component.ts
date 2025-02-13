import { OverlayModule } from '@angular/cdk/overlay';
import { Component } from '@angular/core';

import { OverlayHandler, OverlayService } from './overlay.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [OverlayModule],
    selector: 'vn-overlay',
    template: '<div id="main-overlay" [hidden]="!overlayHandler" (click)="hide()" (swipeleft)="hide()"></div>',
})
export class OverlayComponent {
    overlayHandler: OverlayHandler | null;

    constructor(private service: OverlayService) {
        this.service.activeHandler.subscribe((handler) => {
            this.overlayHandler = handler;
        });
    }

    hide() {
        if (this.overlayHandler && !this.overlayHandler.onClick()) {
            // NOTE: check again because onClick handler might have already closed the overlay
            if (this.overlayHandler) {
                this.overlayHandler.hide();
            }
        }
    }
}
