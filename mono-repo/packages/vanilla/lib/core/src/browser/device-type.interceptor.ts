import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Page } from '../client-config/page.client-config';
import { UrlService } from '../navigation/url.service';
import { DeviceService } from './device/device.service';

/**
 * @whatItDoes Adds X-DeviceType header to each http request.
 *
 * @description
 *
 * This interceptor sends device type as a header that can be used as cache parameter on CF.
 *
 * @stable
 */
export function deviceTypeInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const page = inject(Page);
    const deviceService = inject(DeviceService);
    const urlService = inject(UrlService);

    const parsedUrl = urlService.parse(req.url);

    if (parsedUrl.hostname.endsWith(page.domain)) {
        req = req.clone({
            headers: req.headers.set('X-Device-Type', deviceService.deviceType),
        });
    }

    return next(req);
}
