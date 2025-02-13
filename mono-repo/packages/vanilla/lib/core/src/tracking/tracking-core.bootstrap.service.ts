import { Injectable } from '@angular/core';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { TimerService } from '../browser/timer.service';
import { NoopTrackingService } from './noop-tracking.service';
import { TrackingService } from './tracking-core.service';

const DEFAULT_TRACKING_WAITING_TIMEOUT = 5000;

@Injectable()
export class TrackingBootstrapService implements OnAppInit {
    constructor(
        private trackingCoreService: TrackingService,
        private noopTrackingService: NoopTrackingService,
        private timerService: TimerService,
    ) {}

    onAppInit() {
        this.timerService.setTimeout(() => {
            if (!this.trackingCoreService.isReady) {
                this.trackingCoreService.set(this.noopTrackingService);
                this.trackingCoreService.addInitialValues(); //To make sure initialValuesTracked observable emits a value.
            }
        }, DEFAULT_TRACKING_WAITING_TIMEOUT);
    }
}
