import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';

import { CookieName, CookieService, DslService, NavigationService } from '@frontend/vanilla/core';
import { OverlayFactory } from '@frontend/vanilla/shared/overlay-factory';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { COOKIE_CONSENT_ACCEPTED_VALUE } from './constants';
import { CookieConsentConfig } from './cookie-consent.client-config';
import { CookieConsentComponent } from './cookie-consent.component';

@Injectable()
export class CookieConsentService {
    private unsubscribe = new Subject<void>();
    private currentRef: OverlayRef | null;

    constructor(
        private cookieConsentConfig: CookieConsentConfig,
        private cookieService: CookieService,
        private overlay: OverlayFactory,
        private injector: Injector,
        private dslService: DslService,
        private navigationService: NavigationService,
    ) {}

    tryShowCookieConsent() {
        if (this.isAccepted()) {
            return;
        }

        this.navigationService.locationChange.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.incrementCookie());

        this.cookieConsentConfig.whenReady.pipe(first()).subscribe(() => {
            this.dslService
                .evaluateExpression<boolean>(this.cookieConsentConfig.condition)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe((show) => {
                    if (show) {
                        this.show();
                    } else {
                        this.hide();
                    }
                });
        });
    }

    private show() {
        if (this.currentRef) {
            return;
        }

        const overlayRef = this.overlay.create({
            hasBackdrop: false,
            panelClass: 'vn-cookie-consent-container',
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            positionStrategy: this.overlay.position.global().bottom(),
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
            CookieConsentComponent,
            null,
            Injector.create({
                providers: [{ provide: OverlayRef, useValue: overlayRef }],
                parent: this.injector,
            }),
        );
        overlayRef.attach(portal);
        this.currentRef = overlayRef;
    }

    private hide() {
        if (!this.currentRef) {
            return;
        }

        this.currentRef.detach();
    }

    private isAccepted() {
        return this.cookieService.get(CookieName.EuConsent) === COOKIE_CONSENT_ACCEPTED_VALUE;
    }

    private incrementCookie() {
        if (this.isAccepted()) {
            return;
        }

        const expireDate = new Date();
        expireDate.setFullYear(expireDate.getFullYear() + 1);

        const value = this.cookieService.get(CookieName.EuConsent) || '0';
        this.cookieService.put(CookieName.EuConsent, (parseInt(value) + 1).toString(), { expires: expireDate });
    }
}
