import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AuthService, CommonMessages, NavigationService } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe],
    selector: 'vn-betstation-logout-info-overlay',
    templateUrl: 'betstation-logout-info-overlay.component.html',
})
export class BetstationLogoutInfoOverlayComponent {
    constructor(
        public commonMessages: CommonMessages,
        private auth: AuthService,
        private navigationService: NavigationService,
    ) {}

    ok() {
        this.auth
            .logout({ redirectAfterLogout: false, isAutoLogout: true })
            .catch(() => this.navigationService.goToLastKnownProduct({ forceReload: true }));
    }
}
