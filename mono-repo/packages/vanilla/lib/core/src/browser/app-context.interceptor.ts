import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Page } from '../client-config/page.client-config';
import { NativeAppService } from '../native-app/native-app.service';
import { UrlService } from '../navigation/url.service';

/**
 * @whatItDoes Adds X-App-Context header to each http request.
 *
 * @description
 *
 * This interceptor adds header that defines context of running app.
 *
 * @stable
 */

export function appContextInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const page = inject(Page);
    const urlService = inject(UrlService);
    const service = inject(NativeAppService);

    const parsedUrl = urlService.parse(req.url);

    if (parsedUrl.hostname.endsWith(page.domain)) {
        req = req.clone({
            headers: req.headers.set('X-App-Context', service.context),
        });
    }

    return next(req);
}
