import { Injectable } from '@angular/core';

import { DeviceService } from '../../browser/device/device.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class DeviceDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private deviceService: DeviceService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Device: this.dslRecorderService
                .createRecordable('device')
                .createProperty({
                    name: 'IsAndroid',
                    get: () => this.deviceService.isAndroid,
                })
                .createProperty({
                    name: 'IsIOS',
                    get: () => this.deviceService.isiOS,
                })
                .createProperty({
                    name: 'IsMobile',
                    get: () => this.deviceService.isMobile,
                })
                .createProperty({
                    name: 'IsMobilePhone',
                    get: () => this.deviceService.isMobilePhone,
                })
                .createProperty({
                    name: 'IsRobot',
                    get: () => this.deviceService.isRobot,
                })
                .createProperty({
                    name: 'IsTablet',
                    get: () => this.deviceService.isTablet,
                })
                .createProperty({
                    name: 'IsTouch',
                    get: () => this.deviceService.isTouch,
                })
                .createProperty({
                    name: 'Model',
                    get: () => this.deviceService.model,
                })
                .createProperty({
                    name: 'OSName',
                    get: () => this.deviceService.osName,
                })
                .createProperty({
                    name: 'OSVersion',
                    get: () => this.deviceService.osVersion,
                })
                .createProperty({
                    name: 'Vendor',
                    get: () => this.deviceService.vendor,
                })
                .createFunction({
                    name: 'GetCapability',
                    get: (key: string) => this.deviceService.getCapability(key),
                }),
        };
    }
}
