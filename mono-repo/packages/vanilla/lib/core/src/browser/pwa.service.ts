import { Injectable, inject } from '@angular/core';

import { CookieName } from './cookie/cookie.models';
import { CookieService } from './cookie/cookie.service';
import { WINDOW } from './window/window.token';

/**
 * @whatItDoes Provides information about PWA related features.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class PWAService {
    readonly #window = inject(WINDOW);

    get isStandaloneApp(): boolean {
        return this.isStandalone;
    }

    private readonly isStandalone: boolean;

    constructor(private cookieService: CookieService) {
        this.isStandalone =
            this.#window.matchMedia('(display-mode: standalone)').matches ||
            (this.#window.navigator as any).standalone ||
            this.cookieService.get(CookieName.StandaloneOverride) === '1';
    }
}
