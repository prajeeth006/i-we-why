import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { UserSummaryCookieService } from './user-summary-cookie.service';
import { UserSummaryOverlayComponent } from './user-summary-overlay.component';

@Injectable()
export class UserSummaryOverlayService {
    private currentRef: OverlayRef | null;

    constructor(
        private injector: Injector,
        private overlay: OverlayFactory,
        private userSummaryCookieService: UserSummaryCookieService,
    ) {}

    init() {
        this.userSummaryCookieService.delete();
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-user-summary-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const injector = Injector.create({
            providers: [{ provide: OverlayRef, useValue: overlayRef }],
            parent: this.injector,
        });

        const portal = new ComponentPortal(UserSummaryOverlayComponent, null, injector);

        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }
}
