import { Injectable, inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { CookieName } from '../browser/cookie/cookie.models';
import { CookieService } from '../browser/cookie/cookie.service';
import { WINDOW } from '../browser/window/window.token';
import { Logger } from '../logging/logger';
import { DeviceFingerprintService } from '../login/device-fingerprint.service';
import { LoginStoreService } from '../login/login-store.service';
import { LoginService2 } from '../login/login.service';
import { NativeEvent, NativeEventType } from '../native-app/native-app.models';
import { NativeAppService } from '../native-app/native-app.service';
import { GoToOptions } from '../navigation/navigation.models';
import { NavigationService } from '../navigation/navigation.service';
import { UrlService } from '../navigation/url.service';
import { TrackingService } from '../tracking/tracking-core.service';
import { UserService } from '../user/user.service';
import { toBoolean, toJson } from '../utils/convert';
import { vanillaAppExport } from '../utils/vanilla-app-export';

@Injectable()
export class CcbBootstrapService implements OnAppInit {
    readonly #window = inject(WINDOW);

    constructor(
        private nativeAppService: NativeAppService,
        private user: UserService,
        private navigationService: NavigationService,
        private authService: AuthService,
        private cookieService: CookieService,
        private urlService: UrlService,
        private deviceFingerprintService: DeviceFingerprintService,
        private logger: Logger,
        private trackingService: TrackingService,
        private loginStore: LoginStoreService,
        private loginService: LoginService2,
    ) {}

    onAppInit() {
        vanillaAppExport('native', 'messageToWeb', (event: any) => {
            this.nativeAppService.onReceivedEventFromNative(event);
        });

        vanillaAppExport('native', 'sendToNative', (event: any) => {
            this.nativeAppService.sendToNative(event);
        });

        this.#window['messageToWeb'] = (event: any) => {
            this.nativeAppService.onReceivedEventFromNative(event);
        };

        this.#window['NativeCallEntryProc'] = (eventName: string, parameters: any) => {
            this.nativeAppService.onReceivedEventFromNative({ eventName, parameters: toJson(parameters) });
        };

        this.nativeAppService.sendToNative({ eventName: NativeEventType.CCBINITIALIZED });

        this.nativeAppService.eventsFromNative.subscribe((e: NativeEvent) => {
            const eventName = e.eventName.toUpperCase();
            const parameters = e.parameters ?? {};

            if (eventName === NativeEventType.NAVIGATETO) {
                const url = parameters['URL'];

                if (url != null) {
                    const language = parameters['language'];
                    const parsedUrl = this.urlService.parse(url);

                    if (language && parsedUrl.isSameTopDomain) {
                        try {
                            parsedUrl.changeCulture(language);
                        } catch (e) {
                            this.logger.warn(e);
                        }
                    }

                    const forceReload = parameters['forceReload'];
                    const options: GoToOptions = {
                        forceReload: forceReload === undefined ? false : typeof forceReload === 'boolean' ? forceReload : toBoolean(forceReload),
                    };

                    if (Object.keys(options).length > 0) {
                        this.navigationService.goTo(parsedUrl, options);
                    } else {
                        this.navigationService.goTo(parsedUrl);
                    }
                }
            } else if (eventName === NativeEventType.IsLoggedIn || eventName === NativeEventType.APPFOREGROUND) {
                if (eventName === NativeEventType.APPFOREGROUND) {
                    this.nativeAppService.sendToNative({ eventName: NativeEventType.GET_GEO_LOCATION_POSITION });
                }
                this.authService.isAuthenticated().then((isAuthenticated: boolean) => {
                    this.nativeAppService.sendToNative({
                        eventName,
                        parameters: { isLoggedIn: isAuthenticated },
                    });
                });
            } else if (eventName === NativeEventType.LOGOUT) {
                if (this.user.isAuthenticated || this.user.workflowType !== 0) {
                    this.authService.logout();
                }
            } else if (eventName === NativeEventType.TRACKDEVICEIDFA) {
                const dvId = parameters['device_idfa'];

                if (dvId) {
                    this.trackingService.updateDataLayer({ 'user.profile.dvID': dvId });
                    this.cookieService.put(CookieName.DeviceId, dvId);
                }
            } else if (eventName === NativeEventType.REMOVECOOKIE) {
                const name = parameters['name'];

                if (name) {
                    this.cookieService.remove(name);
                }
            } else if (eventName === NativeEventType.FINGERPRINT) {
                const deviceDetails = parameters['deviceDetails'];

                if (deviceDetails) {
                    this.deviceFingerprintService.storeDeviceDetails(deviceDetails);
                }
            } else if (e.eventName === NativeEventType.LOGIN_USERNAME_PREFILL) {
                this.loginStore.LastVisitor = parameters['lastVisitor'];
                this.loginService.shouldPrefillUsername(parameters['rememberMe']);
            }
        });
    }
}
