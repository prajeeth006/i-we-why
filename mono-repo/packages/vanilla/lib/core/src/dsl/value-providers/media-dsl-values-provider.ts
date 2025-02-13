import { BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

import { distinctUntilChanged, skip } from 'rxjs/operators';

import { DeviceService } from '../../browser/device/device.service';
import { MediaQueryService } from '../../browser/media-query.service';
import { DslCacheService } from '../dsl-cache.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';

@Injectable()
export class MediaDslValuesProvider implements DslValuesProvider {
    constructor(
        private dslRecorderService: DslRecorderService,
        dslCacheService: DslCacheService,
        private deviceService: DeviceService,
        private mediaQueryService: MediaQueryService,
    ) {
        this.mediaQueryService
            .observe()
            .pipe(
                distinctUntilChanged((previous: BreakpointState, current: BreakpointState) => JSON.stringify(previous) === JSON.stringify(current)),
                skip(1),
            )
            .subscribe(() => dslCacheService.invalidate(['media.query']));

        deviceService.orientation.pipe(skip(1)).subscribe(() => dslCacheService.invalidate(['media.orientation']));
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            Media: this.dslRecorderService
                .createRecordable('media')
                .createFunction({
                    name: 'IsActive',
                    get: (query: string) => this.mediaQueryService.isActive(query),
                    deps: 'media.query',
                })
                .createProperty({ name: 'Orientation', get: () => this.deviceService.currentOrientation, deps: 'media.orientation' }),
        };
    }
}
