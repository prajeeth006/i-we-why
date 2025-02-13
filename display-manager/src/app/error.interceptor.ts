import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonService } from './display-manager/display-manager-left-panel/tree-view/services/common-service/common.service';
import { ApiService } from './common/api.service';
import { InterceptorToggleService } from './interceptor-toggle.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  isInterceptorEnabled: boolean
  constructor(private commonService: CommonService,
    private apiService: ApiService,
    private interceptorToggleService: InterceptorToggleService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.get('interceptor') == 'true') {
      next.handle(request).pipe();
    } else {
      request.clone({
        setHeaders: {
          interceptor: 'true'
        }
      })
      next.handle(request).pipe(
        catchError(this.catchUnauthorisedError)
      );;
    }

    return next.handle(request).pipe(
      catchError(this.catchUnauthorisedError)
    );
  }

  catchUnauthorisedError = (error: HttpErrorResponse) => {
    this.interceptorToggleService.getEnableHttpInterceptor().subscribe(hasInterceptorEnabled => {
      if (hasInterceptorEnabled) {
        const unauthorizedMessage = "Your session has timed out. Please select 'Close' and sign back in to Display Manager to make further changes.";
        if (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden) {
          this.commonService.getErrorMessageOnDialogBox(error, unauthorizedMessage);
        } else {
          this.isUserAuthenticated().subscribe(isAuthenticated => {
            if (!isAuthenticated) {
              this.commonService.getErrorMessageOnDialogBox(error, unauthorizedMessage);
            }
          });
        }
      }
      return EMPTY;
    })
    return EMPTY;
  }

  isUserAuthenticated(): Observable<boolean> {
    return this.apiService.get<boolean>('/sitecore/api/displayManager/isUserAuthenticated/');
  }
}
