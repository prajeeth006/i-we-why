import { Injectable } from '@angular/core';

import { Options, Service, create } from '@rtms/client';

import { RtmsConfigService } from './rtms-config.service';
import { RtmsLogService } from './rtms-log.service';
import { RtmsTimerService } from './rtms-timer.service';
import { RtmsConfig } from './rtms.client-config';

@Injectable({
    providedIn: 'root',
})
export class RtmsServiceFactory {
    constructor(
        private rtmsConfig: RtmsConfig,
        private rtmsConfigService: RtmsConfigService,
        private rtmsLogService: RtmsLogService,
        private rtmsTimerService: RtmsTimerService,
    ) {}

    create(): Service {
        return create(
            new Options(this.rtmsConfig.host, this.rtmsConfig.keepAliveMilliseconds, this.rtmsConfig.reconnectMilliseconds),
            this.rtmsConfigService,
            this.rtmsLogService,
            undefined,
            this.rtmsTimerService,
        );
    }
}
