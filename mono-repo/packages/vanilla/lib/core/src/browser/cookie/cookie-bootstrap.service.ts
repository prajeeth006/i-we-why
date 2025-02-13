import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { OnAppInit } from '../../bootstrap/bootstrapper.service';
import { TopLevelCookiesConfig } from '../../client-config/top-level-cookies.client-config';

@Injectable()
export class CookieBootstrapService implements OnAppInit {
    constructor(private topLevelCookiesConfig: TopLevelCookiesConfig) {}

    async onAppInit() {
        await firstValueFrom(this.topLevelCookiesConfig.whenReady);
    }
}
