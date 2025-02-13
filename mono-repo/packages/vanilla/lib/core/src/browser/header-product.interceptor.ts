import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Page } from '../client-config/page.client-config';
import { UrlService } from '../navigation/url.service';

/**
 * @whatItDoes Adds X-From-Product header to each http request.
 *
 * @description
 *
 * This interceptor sends product as a header for each api request, which is then used by variation context HeaderProduct on dynacon side to determine from which product the request originates.
 *
 * @stable
 */

export function headerProductInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const page = inject(Page);
    const urlService = inject(UrlService);

    const parsedUrl = urlService.parse(req.url);

    if (parsedUrl.hostname.endsWith(page.domain)) {
        req = req.clone({
            headers: req.headers.set('X-From-Product', page.product),
        });
    }

    return next(req);
}
