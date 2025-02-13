import { Injectable, inject } from '@angular/core';

import { LDContext } from 'launchdarkly-js-client-sdk';

import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { DeviceService } from '../browser/device/device.service';
import { Page } from '../client-config/page.client-config';
import { UserService } from '../user/user.service';
import { LaunchDarklyContextProvider } from './launch-darkly-context-provider';

@Injectable()
export class LaunchDarklyDefaultContextProvider implements LaunchDarklyContextProvider {
    private readonly deviceService = inject(DeviceService);
    private readonly cookieService = inject(CookieService);
    private readonly userService = inject(UserService);
    private readonly page = inject(Page);

    async getProviders(): Promise<LDContext> {
        return {
            kind: 'multi',
            device: {
                key: this.deviceService.osName || 'device-os',
                isAndroid: this.deviceService.isAndroid,
                isChrome: this.deviceService.isChrome,
                isMobile: this.deviceService.isMobile,
                isMobilePhone: this.deviceService.isMobilePhone,
                isNexus: this.deviceService.isNexus,
                isRobot: this.deviceService.isRobot,
                isTablet: this.deviceService.isTablet,
                isTouch: this.deviceService.isTouch,
                isiOS: this.deviceService.isiOS,
            },
            vnLdSession: { key: this.cookieService.get(CookieName.VnLdSession) },
            domain: { key: this.page.domain },
            user: this.userService.id ? { key: this.userService.id, name: this.userService.displayName } : undefined,
            trackerId: this.cookieService.get(CookieName.TrackerId) ? { key: this.cookieService.get(CookieName.TrackerId) } : undefined,
            geoCountry: this.userService.geoCountry ? { key: this.userService.geoCountry } : undefined,
        };
    }
}
