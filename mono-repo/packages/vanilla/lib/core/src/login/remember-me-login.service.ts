import { Injectable, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { LocalStoreService } from '../browser/store/local-store.service';
import { AppInfoConfig } from '../client-config/app-info.client-config';
import { Logger } from '../logging/logger';
import { NativeEventType } from '../native-app/native-app.models';
import { NativeAppService } from '../native-app/native-app.service';
import { DeviceFingerprintService } from './device-fingerprint.service';
import { LoginResponseHandlerService } from './login-response-handler/login-response-handler.service';
import { RememberMeService } from './remember-me.service';

const LAST_CALL_TIMESTAMP = 'rm-timestamp';
/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RememberMeLoginService {
    private rememberMeService = inject(RememberMeService);
    private deviceFingerprintService = inject(DeviceFingerprintService);
    private loginResponseHandlerService = inject(LoginResponseHandlerService);
    private appInfoConfig = inject(AppInfoConfig);
    private log = inject(Logger);
    private localStorage = inject(LocalStoreService);
    private nativeAppService = inject(NativeAppService);

    loginWithToken(): Observable<boolean> {
        const data = {
            productId: this.appInfoConfig.product,
            fingerprint: this.deviceFingerprintService.get(),
        };

        if (this.lastCallTooRecent()) {
            return of(false);
        }

        this.localStorage.set(LAST_CALL_TIMESTAMP, Date.now());
        return this.rememberMeService.login(data).pipe(
            switchMap(async (response) => {
                this.log.infoRemote('RememberMe: api call was successful.');
                const redirectInfo = await this.loginResponseHandlerService.handle(response, { skipRememberMeSetup: true });
                if (!response.isCompleted) {
                    redirectInfo.goTo();
                }
                return true;
            }),
            catchError((error) => {
                this.nativeAppService.sendToNative({ eventName: NativeEventType.REMEMBER_ME_LOGIN_FAILED });
                throw error;
            }),
        );
    }

    // Check when last call happened to prevent concurrent calls from different tabs with same token.
    lastCallTooRecent(): boolean {
        const lastCall = this.localStorage.get<number>(LAST_CALL_TIMESTAMP);
        if (lastCall) {
            const timeDiff = Date.now() - new Date(lastCall).getTime();
            if (timeDiff / 1000 < 5) {
                this.log.infoRemote('RememberMe: Concurrent remember-me call skipped to avoid usage of same token.');
                return true;
            }
        }
        return false;
    }
}
