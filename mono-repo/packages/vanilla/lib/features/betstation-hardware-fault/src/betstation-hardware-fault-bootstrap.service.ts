import { Injectable } from '@angular/core';

import { NativeAppService, NativeEventType, OnFeatureInit } from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

import { BetstationHardwareFaultConfig } from './betstation-hardware-fault.client-config';
import { BetstationHardwareFaultService } from './betstation-hardware-fault.service';

@Injectable()
export class BetstationHardwareFaultBootstrapService implements OnFeatureInit {
    constructor(
        private nativeAppService: NativeAppService,
        private betstationHardwareFaultService: BetstationHardwareFaultService,
        private config: BetstationHardwareFaultConfig,
    ) {}

    onFeatureInit() {
        this.config.whenReady.subscribe(() => {
            if (!this.config.isEnabled) {
                return;
            }

            this.nativeAppService.eventsFromNative.pipe(filter((e) => e.eventName === NativeEventType.DEVICE_FAILURE)).subscribe((evt) => {
                if (evt.parameters?.['errorCode']) {
                    this.betstationHardwareFaultService.showOverlay(evt.parameters['errorCode']);
                }
            });

            this.nativeAppService.eventsFromNative.pipe(filter((e) => e.eventName === NativeEventType.DEVICE_FIXED)).subscribe((evt) => {
                if (evt.parameters?.['errorCode']) {
                    this.betstationHardwareFaultService.closeOverlay(evt.parameters['errorCode']);
                }
            });
        });
    }
}
