import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {
    constructor(private cookieService: CookieService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const autKey: string = this.cookieService.get('X-ENT-1-G-Access-Token');
        const authReq = req.clone({
            setHeaders: { Authorization: autKey },
        });
        return next.handle(authReq);
    }
}
