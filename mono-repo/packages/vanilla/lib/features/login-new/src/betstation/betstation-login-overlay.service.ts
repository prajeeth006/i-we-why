import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { CARD_NUMBER } from '../login.models';
import { BetstationLoginCardPinComponent } from './betstation-login.component';

@Injectable({ providedIn: 'root' })
export class BetstationLoginOverlayService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
    ) {}

    show(cardNumber: string) {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['generic-modal-overlay'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(BetstationLoginCardPinComponent, null, this.createInjector(overlayRef, cardNumber));

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }

    private createInjector(overlayRef: OverlayRef, cardNumber: string) {
        return Injector.create({
            providers: [
                { provide: OverlayRef, useValue: overlayRef },
                { provide: CARD_NUMBER, useValue: cardNumber },
            ],
            parent: this.injector,
        });
    }
}
