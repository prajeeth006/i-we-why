import { Injectable } from '@angular/core';

import { NativeAppConfig, NativeAppService, NativeEvent, NativeEventType } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, first, timeout } from 'rxjs/operators';

/**
 * @whatItDoes Interface for settings of native wrapper application.
 *
 * @stable
 */
export interface WrapperSettings {
    sliderGamesEnabled: boolean;
    keepMeSignedInEnabled?: boolean | undefined; // Optional undefined
    deviceTouchSupported: boolean;
    isTouchIDLoginEnabled?: boolean | undefined; // Optional undefined
    deviceFaceSupported: boolean;
    isFaceIDLoginEnabled?: boolean | undefined; // Optional undefined
}

/**
 * @stable
 */
export interface WrapperUpdateSettings {
    sliderGamesEnabled?: boolean;
    keepMeSignedInEnabled?: boolean;
    deviceTouchSupported?: boolean;
    isTouchIDLoginEnabled?: boolean;
    isFaceIDLoginEnabled?: boolean;
}

/**
 * @whatItDoes Maintains state of native wrapper settings and allows to update them.
 *
 * @howToUse
 * ```
 * const setting = wrapperSettingsService.current.isTouchIDLoginEnabled; // read
 *
 * wrapperSettingsService.update({ isTouchIDLoginEnabled: true }); // update
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class WrapperSettingsService {
    private currentSettings: WrapperSettings | undefined;
    private applicationSettingsFiredEvents: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private nativeAppService: NativeAppService,
        private config: NativeAppConfig,
    ) {}

    get current(): WrapperSettings {
        return this.currentSettings || <any>{};
    }

    get applicationSettingsFired(): Observable<boolean> {
        return this.nativeAppService.isNativeWrapper ? this.applicationSettingsFiredEvents.pipe(filter((received) => received)) : of(true);
    }

    load(): Promise<void> {
        if (!this.nativeAppService.isNativeWrapper) {
            this.sendSetApplicationSettingsEvent();
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            this.nativeAppService.eventsFromNative
                .pipe(
                    filter((event: NativeEvent) => event.eventName === NativeEventType.SET_APPLICATION_SETTINGS),
                    first(),
                    timeout(this.config.appSettingsTimeout),
                )
                .subscribe({
                    next: (event: NativeEvent) => {
                        this.currentSettings = <WrapperSettings>event.parameters;
                        this.sendSetApplicationSettingsEvent();
                        resolve();
                    },
                    error: () => {
                        this.sendSetApplicationSettingsEvent();
                        resolve(); // do nothing
                    },
                });

            this.nativeAppService.sendToNative({ eventName: NativeEventType.GET_APPLICATION_SETTINGS });
        });
    }

    update(updates: WrapperUpdateSettings) {
        if (!this.nativeAppService.isNativeWrapper) {
            return;
        }

        this.nativeAppService.sendToNative({
            eventName: NativeEventType.UPDATE_APPLICATION_SETTINGS,
            parameters: updates,
        });

        if (this.currentSettings) {
            Object.assign(this.currentSettings, updates);
        }
    }

    private sendSetApplicationSettingsEvent() {
        this.applicationSettingsFiredEvents.next(true);
    }
}
