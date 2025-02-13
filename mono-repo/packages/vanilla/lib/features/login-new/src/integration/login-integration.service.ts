import { Injectable } from '@angular/core';

import { AuthService, AutoLoginParameters, DslService, LoginNavigationService, NavigationService, UserService } from '@frontend/vanilla/core';
import { first, firstValueFrom } from 'rxjs';

import { DanskeSpilLoginService } from '../danske-spil/danske-spil-login.service';
import { LoginService } from '../login.service';
import { LOGIN_SUCCESS_PAGE_PLACEHOLDER, LoginIntegrationType } from './integration.models';
import { LoginIntegrationConfig } from './login-integration.client-config';

@Injectable({ providedIn: 'root' })
export class LoginIntegrationService {
    get redirectEnabled(): boolean {
        return (
            this.config.type === LoginIntegrationType.NinjaCasinoSe ||
            (this.config.type === LoginIntegrationType.DanskeSpilDk && this.config.options.version === 2)
        );
    }

    private get standaloneLoginUrl(): string {
        const standaloneLoginUrl = this.config.options.standaloneLoginUrl.toString();

        return standaloneLoginUrl.indexOf(LOGIN_SUCCESS_PAGE_PLACEHOLDER) !== -1
            ? standaloneLoginUrl.replace(
                  LOGIN_SUCCESS_PAGE_PLACEHOLDER,
                  this.navigation.location.search.get('rurl') ?? this.navigation.location.absUrl(),
              )
            : this.config.options.standaloneLoginUrl;
    }

    constructor(
        private navigation: NavigationService,
        private config: LoginIntegrationConfig,
        private danskeSpilLoginService: DanskeSpilLoginService,
        private dslService: DslService,
        private user: UserService,
        private authService: AuthService,
        private loginService: LoginService,
        private loginNavigationService: LoginNavigationService,
    ) {}

    redirectToLogin(): Promise<unknown> {
        this.loginNavigationService.storeReturnUrl();

        return this.navigation.goTo(this.standaloneLoginUrl);
    }

    async init(): Promise<void> {
        await firstValueFrom(this.config.whenReady);

        switch (this.config.type) {
            case LoginIntegrationType.DanskeSpilDk:
                this.danskeSpilLoginService.isSessionActive().subscribe((sessionActive: boolean | Error) => {
                    if (sessionActive instanceof Error) {
                        return Promise.reject(sessionActive);
                    }

                    if (sessionActive && !this.user.isAuthenticated) {
                        this.danskeSpilLoginService.getLoginParameters().subscribe((loginParameters: AutoLoginParameters | Error) => {
                            if (loginParameters instanceof Error) {
                                return Promise.reject(loginParameters);
                            }

                            this.dslService
                                .evaluateExpression<boolean>(this.config.options.redirectAfterLogin)
                                .pipe(first())
                                .subscribe((redirectAfterLogin: boolean) => {
                                    this.loginService.autoLogin(loginParameters, redirectAfterLogin);
                                });
                            return;
                        });
                    } else if (!sessionActive && this.user.isAuthenticated) {
                        this.authService.logout();
                    }
                    return;
                });
                break;
        }
    }

    async logout(): Promise<boolean> {
        await firstValueFrom(this.config.whenReady);

        switch (this.config.type) {
            case LoginIntegrationType.DanskeSpilDk:
                return this.danskeSpilLoginService.logout();
        }

        return Promise.resolve(true);
    }
}
