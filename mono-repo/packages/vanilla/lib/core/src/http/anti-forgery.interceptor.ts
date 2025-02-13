import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { UserConfig } from '../user/user.client-config';

const HEADER_NAME = 'X-XSRF-TOKEN';

export function antiForgeryInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const user = inject(UserConfig);
    // Copied from Angular: Be careful not to overwrite an existing header of the same name.
    if (req.method !== 'GET' && req.method !== 'HEAD' && user.xsrfToken && !req.headers.has(HEADER_NAME)) {
        req = req.clone({ headers: req.headers.set(HEADER_NAME, user.xsrfToken) });
    }
    return next(req);
}
