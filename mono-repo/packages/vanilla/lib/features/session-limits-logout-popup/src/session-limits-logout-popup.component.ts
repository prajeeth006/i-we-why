import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { AuthService, LoginNavigationService, ViewTemplateForClient } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';

import { SessionLimitsLogoutPopupConfig } from './session-limits-logout-popup.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DialogComponent, TrustAsHtmlPipe],
    selector: 'vn-session-limits-logout-popup',
    templateUrl: 'session-limits-logout-popup.html',
})
export class SessionLimitsLogoutPopupComponent {
    protected currentLimit = input.required<number>();
    content = signal<ViewTemplateForClient>(this.sessionLimitsLogoutPopupContent.content);
    text = computed(
        () =>
            this.content().text?.replace(
                '{SESSION_LIMITS}',
                `${this.limit()} ${(this.limit() < 2 ? this.content().messages?.hour : this.content().messages?.hours) ?? ''}`,
            ) ?? '',
    );
    private limit = computed(() => Math.round((this.currentLimit() / 60) * 100) / 100);

    constructor(
        private overlayRef: OverlayRef,
        private sessionLimitsLogoutPopupContent: SessionLimitsLogoutPopupConfig,
        private authService: AuthService,
        private loginNavigationService: LoginNavigationService,
    ) {}

    accept() {
        this.authService.logout({ redirectAfterLogout: false }).then(async () => {
            this.overlayRef.detach();
            await this.loginNavigationService.goToLogin();
        });
    }
}
