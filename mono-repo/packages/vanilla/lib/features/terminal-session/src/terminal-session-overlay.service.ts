import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { TerminalSessionOverlayComponent } from './terminal-session-overlay.component';
import { TerminalSessionNotification } from './terminal-session.models';

@Injectable({
    providedIn: 'root',
})
export class TerminalSessionOverlayService {
    private currentRef: OverlayRef | null;

    private injector = inject(Injector);
    private overlay = inject(OverlayFactory);

    show(terminalSessionNotification: TerminalSessionNotification) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-terminal-session-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            TerminalSessionOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('terminalSessionNotification', terminalSessionNotification);
        this.currentRef = overlayRef;
    }
}
