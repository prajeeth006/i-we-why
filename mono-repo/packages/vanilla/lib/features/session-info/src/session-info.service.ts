import { Injectable, inject } from '@angular/core';

import { AuthService, Logger, NavigationService, RtmsType, UserService } from '@frontend/vanilla/core';
import { first } from 'rxjs';

import { SessionInfoOverlayService } from './session-info-overlay.service';
import { SessionInfoResourceService } from './session-info-resource.service';
import { SessionInfoConfig } from './session-info.client-config';
import { RcpuAction, SessionInfo } from './session-info.models';

@Injectable()
export class SessionInfoService {
    private sessionInfoConfig = inject(SessionInfoConfig);
    private sessionInfoOverlayService = inject(SessionInfoOverlayService);
    private authService = inject(AuthService);
    private navigationService = inject(NavigationService);
    private user = inject(UserService);
    private log = inject(Logger);
    private sessionInfoResourceService = inject(SessionInfoResourceService);
    private urlBlacklistRegexes: RegExp[];

    constructor() {
        this.sessionInfoConfig.whenReady
            .pipe(first())
            .subscribe(() => (this.urlBlacklistRegexes = this.sessionInfoConfig.urlBlacklist.map((url: string) => new RegExp(url, 'i'))));
    }

    async checkStatus() {
        try {
            const rcpuStatus = await this.sessionInfoResourceService.rcpuStatus();

            if (rcpuStatus?.playerState?.toLowerCase() === 'blocked') this.processMessage(RtmsType.RCPU_SESS_EXPIRY_EVENT, rcpuStatus);
        } catch {
            this.log.warn('RCPU status api call failed.');
        }
    }

    async processMessage(eventType: RtmsType | string, data: any) {
        const sessionInfo: SessionInfo | undefined = data;

        const absUrl = this.navigationService.location.absUrl();
        const isUrlBlacklisted = this.urlBlacklistRegexes.some((regExp: RegExp) => regExp.test(absUrl));

        if (isUrlBlacklisted) {
            this.log.error(`${absUrl} URL is blacklisted for event: ${JSON.stringify(eventType)}`);
        } else if (!sessionInfo) {
            this.log.error(`RTMS message missing required properties: ${JSON.stringify(eventType)}`);
        } else if (eventType === RtmsType.RCPU_SESS_EXPIRY_EVENT) {
            this.sessionInfoOverlayService.show(sessionInfo);
        } else if (eventType === RtmsType.RCPU_ACTION_ACK) {
            if (sessionInfo.rcpuAction === RcpuAction.Continue) {
                this.sessionInfoOverlayService.close();
            } else if (sessionInfo.rcpuAction === RcpuAction.Logout && this.user.isAuthenticated) {
                this.sessionInfoOverlayService.close();
                await this.authService.logout();
            }
        }
    }
}
