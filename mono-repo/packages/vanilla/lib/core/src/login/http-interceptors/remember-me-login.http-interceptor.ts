import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, ReplaySubject, throwError } from 'rxjs';
import { finalize, mergeMap, retryWhen } from 'rxjs/operators';

import { Logger } from '../../logging/logger';
import { UrlService } from '../../navigation/url.service';
import { RememberMeLoginService } from '../remember-me-login.service';
import { RememberMeConfig } from '../remember-me.client-config';
import { RememberMeService } from '../remember-me.service';

/**
 * Indicates for the next HttpErrorInterceptor if redirect to login should be skipped.
 * Used in case of retry skipped for specific paths or if there is already a remember me call in progress.
 */
export const SKIP_LOGIN_REDIRECT = new HttpContextToken(() => false);

export function rememberMeLoginHttpInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const rememberMeService = inject(RememberMeService);
    const rememberMeLoginService = inject(RememberMeLoginService);
    const config = inject(RememberMeConfig);
    const urlService = inject(UrlService);
    const log = inject(Logger);

    if (!urlService.parse(req.url).isSameTopDomain || !rememberMeService.tokenExists()) {
        return next(req);
    }

    return next(req).pipe(
        retryWhen((errors: Observable<any>) =>
            errors.pipe(
                mergeMap((originalError: HttpErrorResponse, errorIndex: number) => {
                    if (originalError.status === 401 && errorIndex === 0) {
                        //Login redirect should execute only in case remember me fails.
                        //This context variable avoids redirect when multiple calls return 401 at the same time.
                        req.context.set(SKIP_LOGIN_REDIRECT, true);

                        if (rememberMeService.retryNotifier == null) {
                            rememberMeService.retryNotifier = new ReplaySubject<HttpErrorResponse | null>();

                            rememberMeLoginService
                                .loginWithToken()
                                .pipe(
                                    finalize(() => {
                                        rememberMeService.retryNotifier = null;
                                    }),
                                )
                                .subscribe({
                                    next: (executed) => {
                                        if (executed) {
                                            log.infoRemote(`LOGIN_INFO Login by remember-me token on session expiration was successful. ${req.url}`);
                                            if (config.skipRetryPaths?.some((x) => req.url.match(x))) {
                                                rememberMeService.retryNotifier?.error(originalError);
                                            } else {
                                                rememberMeService.retryNotifier?.next(null);
                                            }
                                        }
                                    },
                                    error: (loginError) => {
                                        req.context.set(SKIP_LOGIN_REDIRECT, false);
                                        log.errorRemote(
                                            'Failed login by remember-me token on session expiration. User gets unauthenticated.',
                                            loginError,
                                        );
                                        rememberMeService.retryNotifier?.error(originalError);
                                    },
                                    complete: () => {
                                        rememberMeService.retryNotifier?.complete();
                                        rememberMeService.retryNotifier = null;
                                    },
                                });
                        }

                        return rememberMeService.retryNotifier.asObservable();
                    }

                    return throwError(() => originalError);
                }),
            ),
        ),
    );
}
