import { Injectable } from '@angular/core';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { NativeAppService } from '../native-app/native-app.service';
import { DeviceFingerPrint } from './login.models';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DeviceFingerprintService {
    constructor(
        private cookieService: CookieService,
        private nativeAppService: NativeAppService,
    ) {}

    get(): DeviceFingerPrint {
        const deviceFingerPrint = {
            superCookie: this.cookieService.get(CookieName.SuperCookie),
            deviceDetails: {
                sr: screen.width + ', ' + screen.height + '|' + screen.availWidth + ', ' + screen.availHeight + '|' + screen.colorDepth,
                sse: window.sessionStorage ? '1' : '0',
                lse: window.localStorage ? '1' : '0',
                idbe: window.indexedDB ? '1' : '0',
                hc: navigator.hardwareConcurrency ? navigator.hardwareConcurrency.toString() : '',
                bl: navigator.language.toString(),
                host: location.hostname.toString(),
                ua: navigator.userAgent,
                tz: DeviceFingerprintService.getTimezone(),
                dt: this.nativeAppService.isNative ? this.nativeAppService.applicationName : 'mobileweb',
                ct: navigator.userAgent.indexOf('x64') > -1 ? 'x64' : 'x32',
                dnt: '',
            },
        };

        try {
            this.enrichDeviceDetailsWithCookie(deviceFingerPrint);
        } catch {}

        return deviceFingerPrint;
    }

    storeDeviceDetails(deviceDetails: { [key: string]: string }) {
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        this.cookieService.put(CookieName.DeviceDetails, JSON.stringify(deviceDetails), { expires });
    }

    private enrichDeviceDetailsWithCookie(deviceFingerPrint: DeviceFingerPrint) {
        const deviceDetails = this.cookieService.get(CookieName.DeviceDetails);
        const parsedDeviceDetails = deviceDetails ? JSON.parse(deviceDetails) : deviceDetails;

        if (parsedDeviceDetails) {
            Object.assign(deviceFingerPrint.deviceDetails || {}, parsedDeviceDetails);
        }
    }

    private static getTimezone(): string {
        let timezone = '';

        try {
            // attempt one: use Intl
            timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
            try {
                // extract W. Europe Daylight Time from Thu Mar 29 2018 10:03:56 GMT+0200 (W. Europe Daylight Time)
                timezone = new Date().toString().split('(')[1]!.slice(0, -1);
            } catch {}
        }

        return timezone;
    }
}
