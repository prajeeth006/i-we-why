import { Injectable } from '@angular/core';

import {
    CookieName,
    CookieService,
    NavigationService,
    OnFeatureInit,
    RememberMeService,
    UserEvent,
    UserLoginEvent,
    UserLogoutEvent,
    UserService,
    replacePlaceholders,
} from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

import { RememberMeLogoutPromptConfig } from './remember-me-logout-prompt.client-config';

@Injectable()
export class RememberMeLogoutPromptBootstrapService implements OnFeatureInit {
    constructor(
        private user: UserService,
        private navigation: NavigationService,
        private rememberMeService: RememberMeService,
        private cookieService: CookieService,
        private rememberMeLogoutConfig: RememberMeLogoutPromptConfig,
    ) {}

    onFeatureInit() {
        this.rememberMeLogoutConfig.whenReady.subscribe(() => {
            this.cookieService.put(CookieName.RmLp, '1');

            if (this.user.isAuthenticated) {
                this.resolveGreeting();
            }

            this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => {
                this.resolveGreeting();
            });

            this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLogoutEvent)).subscribe(async (event: UserLogoutEvent) => {
                if (event.isManualLogout && this.rememberMeService.tokenExists()) {
                    await this.navigation.goTo('/remember-me-logout', { forceReload: false });
                } else {
                    this.rememberMeService.logout();
                }
            });
        });
    }

    private resolveGreeting() {
        if (this.rememberMeLogoutConfig.content.messages?.claimGreetingProperty) {
            const claimGreetingProperty = this.user.claims.get(this.rememberMeLogoutConfig.content.messages?.claimGreetingProperty);

            const text =
                claimGreetingProperty &&
                replacePlaceholders(this.rememberMeLogoutConfig.content.text, {
                    claimGreetingProperty,
                });

            if (text) {
                this.rememberMeLogoutConfig.content.text = text;
            }
        }
    }
}
