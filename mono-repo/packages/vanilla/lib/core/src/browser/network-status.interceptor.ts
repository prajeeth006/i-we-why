import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NetworkService } from './network.service';

export function networkStatusInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const networkService = inject(NetworkService);
    const timestamp = Date.now();

    return next(req).pipe(
        tap(
            (response) => {
                if (response instanceof HttpResponse) {
                    networkService.reportOnlineRequest(timestamp);
                }
            },
            (error: HttpErrorResponse) => {
                if (error.status === 0) {
                    networkService.reportOfflineRequest(timestamp);
                } else {
                    networkService.reportOnlineRequest(timestamp);
                }
            },
        ),
    );
}
