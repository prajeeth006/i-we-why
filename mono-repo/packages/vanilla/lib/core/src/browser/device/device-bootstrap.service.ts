import { Injectable } from '@angular/core';

import { OnAppInit } from '../../bootstrap/bootstrapper.service';
import { Logger } from '../../logging/logger';
import { CookieService } from '../cookie/cookie.service';
import { DeviceConfig } from './device.client-config';

@Injectable()
export class DeviceBootstrapService implements OnAppInit {
    constructor(
        private config: DeviceConfig,
        private logger: Logger,
        private cookieService: CookieService,
    ) {}

    onAppInit() {
        if (this.config.logInfoEnabled) {
            this.logger.errorRemote('Logging device info.', { message: JSON.stringify(this.config) });
            this.logger.errorRemote('Logging daprops.', { message: this.cookieService.get('DAPROPS') });
        }
    }
}
