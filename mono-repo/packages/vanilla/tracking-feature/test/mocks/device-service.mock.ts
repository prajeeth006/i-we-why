import { signal } from '@angular/core';

import { DeviceService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';

export const DeviceServiceMock = MockService(DeviceService, {
    isAndroid: false,
    isiOS: false,
    isRobot: false,
    isChrome: false,
    isNexus: false,
    orientation: new BehaviorSubject<'portrait' | 'landscape'>('portrait'),
    get currentOrientation(): string {
        return this.orientation.value;
    },
    isMobile: false,
    isTablet: false,
    isMobilePhone: false,
    isTouch: false,
    model: '',
    cpuCores: '',
    cpuMaxFrequency: '',
    totalRam: '',
    deviceType: '',
    displayWidth: '',
    displayHeight: '',
    osName: '',
    osVersion: '',
    vendor: '',
    getCapability: jest.fn(),
    windowRect: signal({ width: 0, height: 0 }),
});
