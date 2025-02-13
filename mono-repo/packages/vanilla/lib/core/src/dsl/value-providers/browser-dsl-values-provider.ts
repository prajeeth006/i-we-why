import { Injectable } from '@angular/core';

import { toNumber } from 'lodash-es';

import { DeviceService } from '../../browser/device/device.service';
import { PWAService } from '../../browser/pwa.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class BrowserDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private pwaService: PWAService,
        private deviceService: DeviceService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Browser: this.dslRecorderService
                .createRecordable('browser')
                .createSimpleProperty(this.pwaService, 'isStandaloneApp', 'IsStandaloneApp')
                .createProperty({ name: 'Name', get: () => this.deviceService.getCapability('browserName') })
                .createProperty({ name: 'Version', get: () => this.deviceService.getCapability('browserVersion') })
                .createProperty({
                    name: 'MajorVersion',
                    get: () => {
                        const browserVersion = this.deviceService.getCapability('browserVersion');
                        const version = toNumber(browserVersion?.split('.')[0]);

                        return isNaN(version) ? '' : version;
                    },
                }),
        };
    }
}
