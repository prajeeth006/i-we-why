import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { SessionInfo } from './session-info.models';

@Injectable()
export class SessionInfoResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    async rcpuStatus(): Promise<SessionInfo> {
        return await firstValueFrom(this.api.get('sessioninfo/rcpustatus'));
    }

    async rcpuContinue(): Promise<void> {
        return await firstValueFrom(this.api.post('sessioninfo/rcpucontinue'));
    }

    async rcpuQuit(): Promise<void> {
        return await firstValueFrom(this.api.post('sessioninfo/rcpuquit'));
    }
}
