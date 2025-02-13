import { Injectable } from '@angular/core';

import { NativeAppService } from '../native-app/native-app.service';
import { DeviceService } from './device/device.service';

@Injectable({
    providedIn: 'root',
})
export class FrontendHelperService {
    constructor(
        private deviceService: DeviceService,
        private nativeAppService: NativeAppService,
    ) {}

    getFrontendDescription() {
        if (this.nativeAppService.isNative) {
            return this.nativeAppService.applicationName;
        }

        if (this.deviceService.isMobile) {
            return 'mobile';
        }

        return 'desktop';
    }
}
