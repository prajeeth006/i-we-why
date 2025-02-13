import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { DeviceService } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { InactivityScreenOverlayComponent } from './inactivity-screen-overlay.component';
import { InactivityScreenSessionOverlayComponent } from './inactivity-screen-session-overlay.component';
import { InactivityScreenConfig } from './inactivity-screen.client-config';
import { InactivityMode, WebVersion } from './inactivity-screen.models';

@Injectable({
    providedIn: 'root',
})
export class InactivityScreenOverlayService {
    private countdownOverlayRef: OverlayRef | null;
    private sessionOverlayRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
        private config: InactivityScreenConfig,
        private deviceService: DeviceService,
    ) {}

    showCountdownOverlay() {
        if (this.countdownOverlayRef) {
            return;
        }

        const panelClass =
            this.config.mode === InactivityMode.Web
                ? this.deviceService.isMobilePhone && this.config.webVersion === WebVersion.Version2
                    ? ['generic-modal-drawer']
                    : ['generic-modal-popup']
                : ['vn-inactivity-screen-panel', 'vn-dialog-container'];
        const overlayRef = this.overlay.create({
            panelClass: panelClass,
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.countdownOverlayRef = null;
        });

        const portal = new ComponentPortal(
            InactivityScreenOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        overlayRef.attach(portal);
        this.countdownOverlayRef = overlayRef;
    }

    showSessionOverlay() {
        if (this.sessionOverlayRef) {
            return;
        }

        const overlayRef = this.overlay.create({ panelClass: ['generic-modal-popup'] });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.sessionOverlayRef = null;
        });

        const portal = new ComponentPortal(
            InactivityScreenSessionOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );
        overlayRef.attach(portal);
        this.sessionOverlayRef = overlayRef;
    }
}
