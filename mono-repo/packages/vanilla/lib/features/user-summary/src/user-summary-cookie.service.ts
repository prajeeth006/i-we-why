import { Injectable } from '@angular/core';

import { CookieName, CookieService } from '@frontend/vanilla/core';

@Injectable()
export class UserSummaryCookieService {
    constructor(private cookieService: CookieService) {}

    read(): string | null {
        return this.cookieService.get(CookieName.UserSummary);
    }

    write() {
        this.cookieService.put(CookieName.UserSummary, '1');
    }

    delete() {
        this.cookieService.remove(CookieName.UserSummary);
    }
}
