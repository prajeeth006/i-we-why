import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector, inject } from '@angular/core';

import { CookieName, CookieService, UserService } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';

import { SessionLimitsOverlayComponent } from './session-limits-overlay.component';
import { LoginSessionLimitActivity, SessionLimitNotification } from './session-limits.models';

@Injectable()
export class SessionLimitsOverlayService {
    private currentRef: OverlayRef | null;

    private injector = inject(Injector);
    private overlay = inject(OverlayFactory);
    private cookieService = inject(CookieService);
    private user = inject(UserService);

    show(sessionLimitsNotification: SessionLimitNotification) {
        this.cookieService.remove(CookieName.SessionLimits);

        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            panelClass: ['vn-session-limits-panel', 'vn-dialog-container'],
        });

        overlayRef.detachments().subscribe(() => {
            this.overlay.dispose(overlayRef);
            this.currentRef = null;
        });

        const portal = new ComponentPortal(
            SessionLimitsOverlayComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );

        const componentRef = overlayRef.attach(portal);
        componentRef.setInput('sessionLimitsNotification', sessionLimitsNotification);
        this.currentRef = overlayRef;
    }

    handlePendingLimits(payload: SessionLimitNotification) {
        for (const limit of payload.sessionLimits || []) {
            const limitType = limit.sessionLimitType?.split('_')[0];

            if (!limitType) {
                continue;
            }

            const limitActivity = payload.loginSessionLimitActivity?.find(
                (limitActivity: LoginSessionLimitActivity) => limitActivity.globalSessionId === this.user.globalSession,
            );

            if (!limitActivity?.limitTypes?.includes(limitType)) {
                this.show(payload);
                break;
            }
        }
    }
}
