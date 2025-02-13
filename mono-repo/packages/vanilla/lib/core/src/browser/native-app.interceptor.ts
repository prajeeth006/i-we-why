import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Page } from '../client-config/page.client-config';
import { NativeAppService } from '../native-app/native-app.service';
import { UrlService } from '../navigation/url.service';

/**
 * @whatItDoes Adds X-Native-App header to each http request when in native mode.
 *
 * @description
 *
 * This interceptor adds header that defines native application name of running app.
 *
 * @stable
 */

export function nativeAppInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const page = inject(Page);
    const urlService = inject(UrlService);
    const service = inject(NativeAppService);

    const parsedUrl = urlService.parse(req.url);

    if (service.isNative && parsedUrl.hostname.endsWith(page.domain)) {
        req = req.clone({
            headers: req.headers.set('X-Native-App', service.applicationName),
        });
    }

    return next(req);
}
