import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, ReplaySubject, from, of } from 'rxjs';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { DeviceService } from '../browser/device/device.service';
import { WINDOW } from '../browser/window/window.token';
import { Page } from '../client-config/page.client-config';
import { ApiOptions } from '../http/http.models';
import { NativeAppService } from '../native-app/native-app.service';
import { UserConfig } from '../user/user.client-config';
import { RememberMeConfig } from './remember-me.client-config';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class RememberMeService {
    public retryNotifier: ReplaySubject<HttpErrorResponse | null> | null = null;

    private rememberMeConfig = inject(RememberMeConfig);
    private cookieService = inject(CookieService);
    private page = inject(Page);
    private nativeAppService = inject(NativeAppService);
    private deviceService = inject(DeviceService);
    private user = inject(UserConfig);
    readonly #window = inject(WINDOW);

    tokenExists(): boolean {
        return this.rememberMeConfig.isEnabled ? this.indicatorTokenExists() : false;
    }

    indicatorTokenExists(): boolean {
        return !!this.cookieService.get(CookieName.RmI);
    }

    authTokenExists(): boolean {
        return !!this.cookieService.get(CookieName.VnAuth);
    }

    setupTokenAfterLogin(): Observable<void> {
        if (!this.rememberMeConfig.isEnabled) {
            return of();
        }

        return this.request({ method: 'PUT' });
    }

    login(data: any): Observable<any> {
        return this.request({ method: 'POST', data });
    }

    logout(): Observable<void> {
        return this.request({ method: 'DELETE' });
    }

    private request(options: ApiOptions): Observable<any> {
        const url = `${this.rememberMeConfig.apiHost.replace(/\/+$/, '')}/api/auth/rememberme?culture=${this.page.lang}`;

        /*
        Using fetch with keepalive to guarantee call is not cancelled by the browser when user navigates away of reloads the page in the middle of it.
        Angular httpclient does not support keepalive.
        */
        return from(
            this.#window
                .fetch(url, {
                    method: options.method!,
                    body: JSON.stringify(options.data),
                    headers: {
                        'content-type': 'application/json',
                        'x-app-context': this.nativeAppService.context,
                        'x-bwin-sf-api': this.page.environment,
                        'x-device-type': this.deviceService.deviceType,
                        'x-from-product': this.page.product,
                        'x-xsrf-token': this.user.xsrfToken || '',
                        'x-bwin-browser-url': this.#window.location.href,
                    },
                    credentials: 'include',
                    keepalive: true,
                })
                .then((response) => response.json()),
        );
    }
}
