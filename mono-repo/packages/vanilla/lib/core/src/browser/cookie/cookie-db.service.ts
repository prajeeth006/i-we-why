import { Injectable } from '@angular/core';

import { CookieList } from './cookie-list';
import { CookieService } from './cookie.service';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class CookieDBService {
    constructor(private cookieService: CookieService) {}

    createList<T>(cookieName: string, expires?: Date) {
        return new CookieList<T>(this.cookieService, cookieName, expires);
    }
}
