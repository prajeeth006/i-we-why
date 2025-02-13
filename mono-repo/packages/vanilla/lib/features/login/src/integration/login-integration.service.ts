import { Injectable } from '@angular/core';

import { AuthService, AutoLoginParameters, DslService, LoginNavigationService, NavigationService, UserService } from '@frontend/vanilla/core';
import { first, firstValueFrom } from 'rxjs';

import { LoginService } from '../login.service';
import { DanskeSpilLoginService } from './danske-spil-login.service';
import { LoginIntegrationConfig, LoginIntegrationType } from './login-integration.client-config';

const LOGIN_SUCCESS_PAGE_PLACEHOLDER: string = '{LOGIN_SUCCESS_PAGE}';

@Injectable({ providedIn: 'root' })
export class LoginIntegrationService {
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

    redirectToLogin() {
        this.loginNavigationService.storeReturnUrl();

        return this.navigation.goTo(this.standaloneLoginUrl);
    }

    async init() {
        await firstValueFrom(this.config.whenReady);

        switch (this.config.type) {
            case LoginIntegrationType.DanskeSpilDk:
                this.danskeSpilLoginService.isSessionActive().subscribe((sessionActive: boolean) => {
                    if (sessionActive && !this.user.isAuthenticated) {
                        this.danskeSpilLoginService.getLoginParameters().subscribe((loginParameters: AutoLoginParameters) => {
                            this.dslService
                                .evaluateExpression<boolean>(this.config.options.redirectAfterLogin)
                                .pipe(first())
                                .subscribe(async (redirectAfterLogin: boolean) => {
                                    await this.loginService.autoLogin(loginParameters, redirectAfterLogin);
                                });
                        });
                    } else if (!sessionActive && this.user.isAuthenticated) {
                        this.authService.logout();
                    }
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
