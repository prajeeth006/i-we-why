import { Injectable } from '@angular/core';

import { NativeAppService } from '../../native-app/native-app.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class NativeApplicationDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        private nativeAppService: NativeAppService,
    ) {}

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            NativeApplication: this.dslRecorderService
                .createRecordable('nativeApplication')
                .createProperty({
                    name: 'IsDownloadClient',
                    get: () => this.nativeAppService.isDownloadClient,
                })
                .createProperty({
                    name: 'IsDownloadClientApp',
                    get: () => this.nativeAppService.isDownloadClientApp,
                })
                .createProperty({
                    name: 'IsDownloadClientWrapper',
                    get: () => this.nativeAppService.isDownloadClientWrapper,
                })
                .createProperty({
                    name: 'IsNative',
                    get: () => this.nativeAppService.isNative,
                })
                .createProperty({
                    name: 'IsNativeApp',
                    get: () => this.nativeAppService.isNativeApp,
                })
                .createProperty({
                    name: 'IsNativeWrapper',
                    get: () => this.nativeAppService.isNativeWrapper,
                })
                .createProperty({
                    name: 'IsTerminal',
                    get: () => this.nativeAppService.isTerminal,
                })
                .createProperty({
                    name: 'Name',
                    get: () => this.nativeAppService.applicationName,
                })
                .createProperty({
                    name: 'Product',
                    get: () => this.nativeAppService.product,
                }),
        };
    }
}
