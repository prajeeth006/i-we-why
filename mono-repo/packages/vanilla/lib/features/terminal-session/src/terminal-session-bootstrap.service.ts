import { Injectable, inject } from '@angular/core';

import { BalanceProperties, NativeAppService, NativeEventType, OnFeatureInit, TimeSpan, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { firstValueFrom } from 'rxjs';
import { pairwise } from 'rxjs/operators';

import { TerminalSessionOverlayService } from './terminal-session-overlay.service';
import { TerminalSessionConfig } from './terminal-session.client-config';
import { TerminalSessionNotification } from './terminal-session.models';
import { TerminalSessionService } from './terminal-session.service';

@Injectable()
export class TerminalSessionBootstrapService implements OnFeatureInit {
    private terminalSessionConfig = inject(TerminalSessionConfig);
    private terminalSessionService = inject(TerminalSessionService);
    private terminalSessionOverlayService = inject(TerminalSessionOverlayService);
    private balancePropertiesService = inject(BalancePropertiesService);
    private webWorkerService = inject(WebWorkerService);
    private nativeAppService = inject(NativeAppService);

    async onFeatureInit() {
        await firstValueFrom(this.terminalSessionConfig.whenReady);

        this.balancePropertiesService.balanceProperties
            .pipe(pairwise())
            .subscribe(async ([previous, current]: [BalanceProperties | null, BalanceProperties | null]) => {
                if (previous?.accountBalance === 0 && current && current.accountBalance > 0) {
                    this.webWorkerService.createWorker(
                        WorkerType.TerminalSessionTimeout,
                        { timeout: this.terminalSessionConfig.depositAlertTime },
                        async () => await this.showOverlay(),
                    );
                } else if (previous && previous.accountBalance > 0 && current?.accountBalance === 0) {
                    this.webWorkerService.removeWorker(WorkerType.TerminalSessionTimeout);
                }
            });
    }

    private async showOverlay() {
        const timeActive = this.webWorkerService.removeWorker(WorkerType.TerminalSessionTimeout);
        const terminalSession = await firstValueFrom(this.terminalSessionService.terminalSession);

        const terminalSessionNotification: TerminalSessionNotification = {
            cumulativeBalance: terminalSession.cumulativeBalance,
            timeActive: TimeSpan.fromSeconds(timeActive),
        };

        this.terminalSessionOverlayService.show(terminalSessionNotification);

        this.nativeAppService.sendToNative({
            eventName: NativeEventType.SESSION_ALERT,
            parameters: terminalSessionNotification,
        });
    }
}
