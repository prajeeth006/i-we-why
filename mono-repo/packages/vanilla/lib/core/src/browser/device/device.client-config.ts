import { Injectable } from '@angular/core';

import { ClientConfig, ClientConfigProductName } from '../../client-config/client-config.decorator';
import { ClientConfigService } from '../../client-config/client-config.service';

@ClientConfig({ key: 'vnDevice', product: ClientConfigProductName.SF })
@Injectable({
    providedIn: 'root',
    deps: [ClientConfigService],
    useFactory: deviceConfigFactory,
})
export class DeviceConfig {
    isAndroid: boolean;
    isIOS: boolean;
    isMobile: boolean;
    isMobilePhone: boolean;
    isTablet: boolean;
    isTouch: boolean;
    isRobot: boolean;
    model?: string;
    osName: string;
    osVersion: string;
    vendor: string;
    displayWidth?: string;
    displayHeight?: string;
    cpuMaxFrequency?: string;
    totalRam?: string;
    cpuCores?: string;
    logInfoEnabled: boolean;
    properties: { [key: string]: string };
}

export function deviceConfigFactory(service: ClientConfigService) {
    return service.get(DeviceConfig);
}
