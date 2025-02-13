import { Injectable, inject } from '@angular/core';

import { firstValueFrom, tap } from 'rxjs';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { WindowEvent } from '../browser/window/window-ref.service';
import { WINDOW } from '../browser/window/window.token';
import { Logger } from '../logging/logger';
import { UserService } from '../user/user.service';
import { RememberMeLoginService } from './remember-me-login.service';
import { RememberMeService } from './remember-me.service';

@Injectable()
export class RememberMeBootstrapService implements OnAppInit {
    readonly #window = inject(WINDOW);

    constructor(
        private user: UserService,
        private rememberMeService: RememberMeService,
        private rememberMeLoginService: RememberMeLoginService,
        private log: Logger,
    ) {}

    async onAppInit() {
        this.#window.addEventListener(
            WindowEvent.Focus,
            () => {
                if (!this.user.isAuthenticated && this.rememberMeService.tokenExists()) {
                    this.log.infoRemote(
                        'RememberMe: Page reloaded as already logged in on another tab using the token to avoid current tab being left unauthenticated.',
                    );
                    this.#window.location.reload();
                }
            },
            { once: true },
        );

        if (this.user.isAuthenticated || !this.rememberMeService.tokenExists()) {
            return;
        }

        // Reload the page if vnauth cookie exists or a previous remember-me operation was too recent before the page load.
        if (this.rememberMeService.authTokenExists() || this.rememberMeLoginService.lastCallTooRecent()) {
            this.#window.location.reload();
            return;
        }

        try {
            await firstValueFrom(
                this.rememberMeLoginService.loginWithToken().pipe(
                    tap((executed) => {
                        if (executed) this.log.infoRemote('RememberMe: Login with token on app init was successful.');
                    }),
                ),
            );
        } catch (error) {
            this.log.errorRemote('RememberMe: Failed to login with token on app start. User is left unauthenticated.', error);
        }
    }
}
