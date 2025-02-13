import { Injectable, inject } from '@angular/core';

import { LocalStoreKey, LocalStoreService, NativeAppConfig, NativeEvent, NativeEventType, OnFeatureInit } from '@frontend/vanilla/core';
import { WrapperSettings, WrapperSettingsService } from '@frontend/vanilla/shared/native-app';

import { NativeAutoPingService } from './native-auto-ping.service';
import { WrapperEmulatorService } from './wrapper-emulator.service';

@Injectable()
export class NativeAppBootstrapService implements OnFeatureInit {
    private nativeAutoPingService = inject(NativeAutoPingService);
    private wrapperSettingsService = inject(WrapperSettingsService);
    private nativeAppSettingsConfig = inject(NativeAppConfig);
    private wrapperEmulatorService = inject(WrapperEmulatorService);
    private localStoreService = inject(LocalStoreService);

    onFeatureInit() {
        this.nativeAutoPingService.init();

        if (this.nativeAppSettingsConfig.enableWrapperEmulator) {
            this.wrapperEmulatorService.initialize();

            this.wrapperEmulatorService.eventsToNative.subscribe((e: NativeEvent) => {
                if (e.eventName === NativeEventType.GET_APPLICATION_SETTINGS) {
                    const defaults = <WrapperSettings>{ deviceTouchSupported: true };
                    const settings = this.localStoreService.get<WrapperSettings>(LocalStoreKey.WrapperEmulatorSettings) || defaults;

                    this.localStoreService.set(LocalStoreKey.WrapperEmulatorSettings, settings);
                    this.wrapperEmulatorService.emulateMessageToWeb({
                        eventName: NativeEventType.SET_APPLICATION_SETTINGS,
                        parameters: settings,
                    });
                } else if (e.eventName === NativeEventType.UPDATE_APPLICATION_SETTINGS) {
                    const settings = this.localStoreService.get<WrapperSettings>(LocalStoreKey.WrapperEmulatorSettings);
                    Object.assign(settings || {}, e.parameters);
                    this.localStoreService.set(LocalStoreKey.WrapperEmulatorSettings, settings);
                }
            });
        }

        return this.wrapperSettingsService.load().then();
    }
}
