import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { BETSTATION_LOGIN_ERROR } from '../login.models';
import { BetstationLoginErrorOverlayComponent } from './betstation-login-error-overlay.component';
import { BetstationLogoutInfoOverlayComponent } from './betstation-logout-info-overlay.component';

@Injectable({ providedIn: 'root' })
export class BetstationLoginErrorOverlayService {
    private currentRef: OverlayRef | null;
    overlayRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
    ) {}

    showError(message: string) {
        this.overlayRef = this.createOverlay();
        const portal = new ComponentPortal(BetstationLoginErrorOverlayComponent, null, this.createInjector(this.overlayRef, message));

        this.overlayRef?.attach(portal);
        this.currentRef = this.overlayRef;
    }

    showLogoutInfoMessage() {
        this.overlayRef = this.createOverlay();

        const portal = new ComponentPortal(
            BetstationLogoutInfoOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: this.overlayRef }],
                parent: this.injector,
            }),
        );

        this.overlayRef?.attach(portal);
        this.currentRef = this.overlayRef;
    }

    private createOverlay(): OverlayRef | null {
        if (this.currentRef) {
            return null;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['generic-modal-popup'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        return overlayRef;
    }

    private createInjector(overlayRef: OverlayRef | null, error: string): Injector {
        return Injector.create({
            providers: [
                { provide: OverlayRef, useValue: overlayRef },
                { provide: BETSTATION_LOGIN_ERROR, useValue: error },
            ],
            parent: this.injector,
        });
    }
}
