import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { WINDOW } from '../browser/window/window.token';
import { UrlService } from '../navigation/url.service';

/**
 * @whatItDoes Adds x-bwin-browser-url header to each http request.
 *
 * @description
 *
 * This interceptor sends browser url as a header for each request, to enable
 * filtering of sitecore items based on url.
 *
 * @stable
 */

export function browserUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const windowRef = inject(WINDOW);
    const urlService = inject(UrlService);

    if (urlService.parse(req.url).isSameTopDomain) {
        req = req.clone({
            headers: req.headers.set('x-bwin-browser-url', windowRef.location.href),
        });
    }

    return next(req);
}
