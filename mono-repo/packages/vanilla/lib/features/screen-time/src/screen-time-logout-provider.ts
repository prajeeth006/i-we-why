import { Injectable } from '@angular/core';

import { LogoutStage, OnLogoutProvider } from '@frontend/vanilla/core';

import { ScreenTimeBrowserService } from './screen-time-browser.service';

@Injectable()
export class ScreenTimeBeforeLogoutProvider implements OnLogoutProvider {
    constructor(private screenTimeBowserService: ScreenTimeBrowserService) {}

    get stage(): LogoutStage {
        return LogoutStage.BEFORE_LOGOUT;
    }

    onLogout() {
        return new Promise<void>((resolve) => {
            this.screenTimeBowserService.browserVisibilityEvent.next(false);
            resolve();
        });
    }
}
