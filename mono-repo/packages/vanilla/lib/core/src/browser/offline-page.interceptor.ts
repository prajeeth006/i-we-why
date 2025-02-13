import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WINDOW } from '../browser/window/window.token';

/**
 * @whatItDoes Processes each http response and in case of 503 and there is X-Offline-Page header in response it reloads the page.
 * This means that mantainence is in progress and after reload user is redirected to offline page.
 * @description
 *
 * Processes each http response and in case of 503 and there is X-Offline-Page header in response it reloads the page.
 * This means that mantainence is in progress and after reload user is redirected to offline page.
 *
 * @stable
 */

export function offlinePageInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const OfflinePageHeader = 'X-Offline-Page';
    const windowRef = inject(WINDOW);

    return next(req).pipe(
        tap({
            error: (error: any) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status !== 503 || error.headers.get(OfflinePageHeader) !== '1') {
                        return;
                    }

                    windowRef.location.reload();
                }
            },
        }),
    );
}
