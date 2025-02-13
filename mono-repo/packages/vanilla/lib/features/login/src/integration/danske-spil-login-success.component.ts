import { Component, OnInit, inject } from '@angular/core';

import { LoadingIndicatorComponent, LoginNavigationService, NativeAppService, WINDOW } from '@frontend/vanilla/core';

import { LoginIntegrationConfig } from './login-integration.client-config';

@Component({
    standalone: true,
    imports: [LoadingIndicatorComponent],
    selector: 'lh-danske-spil-login-success',
    templateUrl: 'danske-spil-login-success.html',
})
export class DanskeSpilLoginSuccessComponent implements OnInit {
    readonly #window = inject(WINDOW);

    private get usedWindow(): Window {
        return this.config.options.version === 2 ? this.#window : this.#window.parent;
    }

    constructor(
        private navigation: LoginNavigationService,
        private config: LoginIntegrationConfig,
        private nativeAppService: NativeAppService,
    ) {}

    ngOnInit() {
        this.config.whenReady.subscribe(() => {
            const redirectUrl = this.navigation.getStoredLoginRedirect(false).url;

            if (this.config.options.version !== 2 && this.nativeAppService.isDownloadClient && redirectUrl) {
                this.usedWindow.location.href = redirectUrl.absUrl();
            }
        });
    }
}
