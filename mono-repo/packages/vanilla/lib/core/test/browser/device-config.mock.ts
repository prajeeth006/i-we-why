import { Mock } from 'moxxi';

import { DeviceConfig } from '../../../core/src/browser/device/device.client-config';

@Mock({ of: DeviceConfig })
export class DeviceConfigMock {
    isAndroid: boolean;
    isIOS: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isTouch: boolean;
    isMobilePhone: boolean;
    isRobot: boolean;
    model?: string;
    cpuMaxFrequency?: string;
    totalRam?: string;
    cpuCores?: string;
    displayWidth: string;
    displayHeight: string;
    osName: string;
    osVersion: string;
    vendor: string;
    properties: { [key: string]: string };
}
