import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LocalStoreKey } from '../../browser/browser.models';
import { LocalStoreService } from '../../browser/store/local-store.service';
import { CommonMessages } from '../../client-config/common-messages.client-config';
import { Logger } from '../../logging/logger';
import { MessageQueueService } from '../../messages/message-queue.service';
import { MessageLifetime, MessageScope } from '../../messages/message.models';
import { NativeEventType } from '../../native-app/native-app.models';
import { NativeAppService } from '../../native-app/native-app.service';
import { UrlService } from '../../navigation/url.service';
import { TrackingService } from '../../tracking/tracking-core.service';
import { UserSessionExpiredEvent } from '../../user/user-events';
import { UserService } from '../../user/user.service';
import { LoginNavigationService } from '../login-navigation.service';
import { LoginStoreService } from '../login-store.service';
import { LoginService2 } from '../login.service';
import { SKIP_LOGIN_REDIRECT } from './remember-me-login.http-interceptor';

/**
 * @whatItDoes Processes each http response and in case of 401 or 403 redirects to login page. In case of 401 adds NativeEventType.Logout {@link NativeEventType} with systemLogout: true
 *
 * @description
 *
 * Processes each http response and sends NativeEventType.Logout with systemLogout: true in case the session is timed out
 *
 * @stable
 */

export function httpErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const user = inject(UserService);
    const logger = inject(Logger);
    const nativeApp = inject(NativeAppService);
    const loginService = inject(LoginService2);
    const messageQueue = inject(MessageQueueService);
    const commonMessages = inject(CommonMessages);
    const loginStoreService = inject(LoginStoreService);
    const trackingService = inject(TrackingService);
    const loginNavigationService = inject(LoginNavigationService);
    const urlService = inject(UrlService);
    const localStorage = inject(LocalStoreService);
    let isLogoutEventAlreadySent: boolean = false;

    return next(req).pipe(
        tap(
            () => {},
            async (error: any) => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status !== 401 || !urlService.parse(req.url).isSameTopDomain || req.context.get(SKIP_LOGIN_REDIRECT)) {
                        return;
                    }

                    // session not valid anymore (expired) (propably session timeout)
                    logger.warnRemote(`Unauthorized ajax call, reloading (${error.status}-${error.url}). Probably session expired due to timeout.`);

                    user.triggerEvent(new UserSessionExpiredEvent());
                    loginStoreService.PostLoginValues = null;

                    if (user.isAuthenticated && !isLogoutEventAlreadySent) {
                        logger.error(`Authenticated user ${user.username} received 401 from api call, sending CCB logout`);

                        nativeApp.sendToNative({
                            eventName: NativeEventType.LOGOUT,
                            parameters: {
                                systemLogout: true,
                            },
                        });
                        isLogoutEventAlreadySent = true;
                    }

                    if (!loginNavigationService.isRedirectAfterSessionTimeoutEnabled || (nativeApp.isNative && !nativeApp.isNativeWrapper)) {
                        return;
                    }

                    messageQueue.clear({ clearPersistent: false });

                    if (commonMessages['SessionError']) {
                        messageQueue.addError(commonMessages['SessionError'], MessageLifetime.Single, MessageScope.Login);
                    }

                    let logtimeDiffrence = 0;
                    const previousLogTime = localStorage.get<number>(LocalStoreKey.ErrorLogTime);
                    if (previousLogTime != null) {
                        logtimeDiffrence = (Date.now() - previousLogTime) / 1000;
                    }

                    if (previousLogTime == null || logtimeDiffrence > 2) {
                        await trackingService.reportErrorObject({ type: 'LoginError', message: 'user session expired', code: 401 });
                        localStorage.set(LocalStoreKey.ErrorLogTime, Date.now());
                    }
                    await loginService.goTo({ appendReferrer: true, forceReload: true, storeMessageQueue: true });
                }
            },
        ),
    );
}
