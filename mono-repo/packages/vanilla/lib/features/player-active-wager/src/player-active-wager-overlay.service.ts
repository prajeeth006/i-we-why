import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { PlayerActiveWagerOverlayComponent } from './player-active-wager-overlay.component';

export const PLAYER_ACTIVE_WAGER_TIME = new InjectionToken<string>('vn-player-active-wager-time');

@Injectable({ providedIn: 'root' })
export class PlayerActiveWagerOverlayService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
    ) {}

    show(time: number) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-player-wager-popup', 'generic-modal-popup'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            PlayerActiveWagerOverlayComponent,
            null,
            Injector.create({
                providers: [
                    { provide: OverlayRef, useValue: overlayRef },
                    { provide: PLAYER_ACTIVE_WAGER_TIME, useValue: time },
                ],
                parent: this.injector,
            }),
        );

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }
}
