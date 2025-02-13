import { Mock, Stub } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { DeviceService } from '../../src/browser/device/device.service';

@Mock({ of: DeviceService })
export class DeviceServiceMock {
    isAndroid: boolean;
    isiOS: boolean;
    isRobot: boolean;
    isChrome: boolean;
    isNexus: boolean;
    orientation: BehaviorSubject<string> = new BehaviorSubject('portrait');
    currentOrientation: string;
    isMobile: boolean;
    isTablet: boolean;
    isMobilePhone: boolean;
    isTouch: boolean;
    model: string;
    cpuCores: string;
    cpuMaxFrequency: string;
    totalRam: string;
    deviceType: string;
    displayWidth: string | undefined;
    displayHeight: string | undefined;
    osName: string;
    osVersion: string;
    vendor: string;
    @Stub() getCapability: jasmine.Spy;

    windowRect() {
        return { width: 1920, height: 1080 };
    }
}
