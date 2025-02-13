import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { CookieName, CookieService } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { Subject } from 'rxjs';

import { REDIRECT_MSG_COOKIE_VALUE } from './redirect-message-constants';
import { RedirectMessageComponent } from './redirect-message.component';

@Injectable()
export class RedirectMessageService {
    private unsubscribe = new Subject<void>();
    private currentRef: OverlayRef | null;

    constructor(
        private cookieService: CookieService,
        private overlay: OverlayFactory,
        private injector: Injector,
    ) {}

    tryShowMessage() {
        if (!this.isAccepted()) {
            this.show();
        }
    }

    private show() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['ip-redirect-message-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            if (this.isAccepted()) {
                this.unsubscribe.next();
                this.unsubscribe.complete();
            }

            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            RedirectMessageComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );
        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }

    private isAccepted(): boolean {
        return this.cookieService.get(CookieName.RedirectMsgShown) === REDIRECT_MSG_COOKIE_VALUE;
    }
}
