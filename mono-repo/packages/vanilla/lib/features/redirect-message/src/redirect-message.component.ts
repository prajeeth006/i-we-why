import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';

import { CookieName, CookieService, DynamicHtmlDirective, NavigationService, ViewTemplate } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';

import { REDIRECT_MSG_COOKIE_VALUE } from './redirect-message-constants';
import { RedirectMessageTrackingService } from './redirect-message-tracking.service';
import { RedirectMessageConfig } from './redirect-message.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DynamicHtmlDirective, HeaderBarComponent, OverlayModule],
    selector: 'vn-redirect-message',
    templateUrl: 'redirect-message.html',
})
export class RedirectMessageComponent implements OnInit {
    private redirectMessageConfig = inject(RedirectMessageConfig);
    private overlayRef = inject(OverlayRef);
    private cookieService = inject(CookieService);
    private navigationService = inject(NavigationService);
    private redirectMessageTrackingService = inject(RedirectMessageTrackingService);

    continueTo = computed(() => this.content().messages?.continue?.replace('{REDIRECT_LABEL}', this.redirectMessageConfig.redirectLabel));
    returnTo = computed(() => this.content().messages?.return);
    message = computed(() => this.content().text?.replace('{REDIRECT_LABEL}', this.redirectMessageConfig.redirectLabel));

    private content = signal<ViewTemplate>(this.redirectMessageConfig.content);

    ngOnInit() {
        this.redirectMessageTrackingService.trackDisplay(this.redirectMessageConfig.currentLabel, this.redirectMessageConfig.redirectLabel);
    }

    redirect() {
        this.redirectMessageTrackingService.trackRedirect(this.redirectMessageConfig.currentLabel, this.redirectMessageConfig.redirectLabel);
        this.closeAndSetCookie();
        this.navigationService.goTo(this.redirectMessageConfig.url);
    }

    close() {
        this.redirectMessageTrackingService.trackReturn(this.redirectMessageConfig.currentLabel, this.redirectMessageConfig.redirectLabel);
        this.closeAndSetCookie();
    }

    private closeAndSetCookie() {
        this.cookieService.put(CookieName.RedirectMsgShown, REDIRECT_MSG_COOKIE_VALUE);
        this.overlayRef.detach();
    }
}
