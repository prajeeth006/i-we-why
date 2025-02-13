import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { SessionInfoComponent } from './session-info.component';
import { SessionInfo } from './session-info.models';

@Injectable()
export class SessionInfoOverlayService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
    ) {}

    show(sessionInfo: SessionInfo) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            backdropClass: 'lh-backdrop',
            panelClass: ['lh-login-duration-container', 'generic-modal-popup'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            SessionInfoComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('sessionInfo', sessionInfo);
        this.currentRef = overlayRef;
    }

    close() {
        this.currentRef?.detach();
    }
}
