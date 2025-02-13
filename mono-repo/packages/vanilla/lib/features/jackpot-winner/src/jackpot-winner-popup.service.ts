import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { JackpotWinnerPopupComponent } from './jackpot-winner-popup.component';
import { JackpotWinnerEvent, PLAYER_GAME_JACKPOT_WIN } from './jackpot-winner.models';

@Injectable({ providedIn: 'root' })
export class JackpotWinnerPopupService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
    ) {}

    show(jackpotWinnerEvent: JackpotWinnerEvent) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-jackpot-winner-popup', 'generic-modal-popup'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            JackpotWinnerPopupComponent,
            null,
            Injector.create({
                providers: [
                    { provide: OverlayRef, useValue: overlayRef },
                    { provide: PLAYER_GAME_JACKPOT_WIN, useValue: jackpotWinnerEvent },
                ],
                parent: this.injector,
            }),
        );

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }
}
