import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieName } from '../../browser/cookie/cookie.models';
import { CookieService } from '../../browser/cookie/cookie.service';
import { UrlService } from '../../navigation/url.service';
import { RememberMeService } from '../remember-me.service';

export function rememberMeLogoutHttpInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const rememberMeService = inject(RememberMeService);
    const urlService = inject(UrlService);
    const cookieService = inject(CookieService);

    if (
        !urlService.parse(req.url).isSameTopDomain ||
        !req.url.endsWith('auth/logout') ||
        !rememberMeService.tokenExists() ||
        cookieService.get(CookieName.RmLp) == '1'
    ) {
        return next(req);
    }

    // requests in parallel, make sure both complete to avoid race condition
    return forkJoin([next(req), rememberMeService.logout()]).pipe(map((x) => x[0]));
}
