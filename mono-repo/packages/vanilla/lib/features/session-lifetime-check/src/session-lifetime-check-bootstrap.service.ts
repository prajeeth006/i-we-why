import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';

import { SessionLifetimeCheckService } from './session-lifetime-check.service';

@Injectable()
export class SessionLifetimeCheckBootstrapService implements OnFeatureInit {
    constructor(private service: SessionLifetimeCheckService) {}

    async onFeatureInit() {
        await this.service.checkIsSessionActive();
    }
}
