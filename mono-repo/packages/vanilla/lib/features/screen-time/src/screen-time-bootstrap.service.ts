import { Inject, Injectable } from '@angular/core';

import {
    LogoutProvidersService,
    ON_LOGOUT_PROVIDER,
    OnFeatureInit,
    OnLogoutProvider,
    UserEvent,
    UserLoginEvent,
    UserService,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ScreenTimeBrowserService } from './screen-time-browser.service';
import { ScreenTimeConfig } from './screen-time.client-config';

@Injectable()
export class ScreenTimeBootstrapService implements OnFeatureInit {
    constructor(
        private userService: UserService,
        private screenTimeBrowserService: ScreenTimeBrowserService,
        private logoutProvidersService: LogoutProvidersService,
        private config: ScreenTimeConfig,
        @Inject(ON_LOGOUT_PROVIDER) private logoutProviders: OnLogoutProvider[],
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.logoutProvidersService.registerProviders(this.logoutProviders);

        if (this.userService.isAuthenticated) {
            this.screenTimeBrowserService.init();
        } else {
            this.userService.events
                .pipe(filter((event: UserEvent) => event instanceof UserLoginEvent))
                .subscribe(() => this.screenTimeBrowserService.init());
        }
    }
}
