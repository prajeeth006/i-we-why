import { Injectable } from '@angular/core';

import { Page } from '../../client-config/page.client-config';
import { CookieOptions } from './cookie.models';

@Injectable({
    providedIn: 'root',
})
export class CookieOptionsProvider {
    get options(): CookieOptions {
        return this._options;
    }

    private readonly _options: CookieOptions;

    constructor(page: Page) {
        this._options = {
            path: '/',
            domain: page.domain,
            sameSite: page.cookies.sameSiteMode,
            secure: page.cookies.secure,
            httpOnly: false,
        };
    }
}
