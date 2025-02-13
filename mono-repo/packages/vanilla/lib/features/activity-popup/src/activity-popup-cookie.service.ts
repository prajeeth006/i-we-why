import { Injectable, inject } from '@angular/core';

import { CookieName, CookieService } from '@frontend/vanilla/core';

@Injectable()
export class ActivityPopupCookieService {
    private cookieService = inject(CookieService);

    read(): string | null {
        return this.cookieService.get(CookieName.ActivityPopupClosed);
    }

    write() {
        this.cookieService.put(CookieName.ActivityPopupClosed, '1');
    }
}
