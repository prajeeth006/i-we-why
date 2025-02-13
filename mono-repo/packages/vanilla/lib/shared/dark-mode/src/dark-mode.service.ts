import { Injectable, inject } from '@angular/core';

import { CookieName, CookieService, PERMANENT_COOKIE_EXPIRATION, WINDOW } from '@frontend/vanilla/core';

const DisabledCookieValue: string = '0';
const EnabledCookieValueOldDesktop: string = '1';
const EnabledCookieValue: string = '2';

/**
 * @whatItDoes Allows toggling of dark mode and check if feature is enabled.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DarkModeService {
    private _isEnabled = this.getIsEnabled();

    get isEnabled(): boolean {
        return this._isEnabled;
    }
    readonly #window = inject(WINDOW);

    constructor(private cookieService: CookieService) {}

    toggle() {
        this.writeCookie(this._isEnabled ? DisabledCookieValue : EnabledCookieValue);
        this._isEnabled = this.getIsEnabled();
        this.#window.location.reload();
    }

    private writeCookie(value: string) {
        this.cookieService.putRaw(CookieName.DarkMode, value, { expires: PERMANENT_COOKIE_EXPIRATION });
    }

    private getIsEnabled(): boolean {
        const value = this.cookieService.get(CookieName.DarkMode);

        return value === EnabledCookieValue || value === EnabledCookieValueOldDesktop;
    }
}
