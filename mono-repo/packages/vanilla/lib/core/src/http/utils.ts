import { HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';

/**
 * @stable
 */
export function shouldInterceptResponse(event: HttpEvent<any> | HttpErrorResponse) {
    if (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
        return !event.url?.toLowerCase().endsWith('/api/clientconfig');
    }

    return false;
}
