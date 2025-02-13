import { Injectable, inject } from '@angular/core';

import { OnAppInit } from '../../bootstrap/bootstrapper.service';
import { CookieName } from '../cookie/cookie.models';
import { CookieService } from '../cookie/cookie.service';
import { WindowEvent } from './window-ref.service';
import { WINDOW } from './window.token';

@Injectable({
    providedIn: 'root',
})
export class WindowEventsBootstrapService implements OnAppInit {
    readonly #window = inject(WINDOW);

    constructor(private cookieService: CookieService) {}

    onAppInit() {
        this.#window.addEventListener(WindowEvent.SocialCookieDropped, () => this.cookieService.put(CookieName.AbSocialLog, 'Y'));
    }
}
