import { Injectable } from '@angular/core';

import { AuthService, WebWorkerService, WorkerType } from '@frontend/vanilla/core';

@Injectable()
export class SessionLifetimeCheckService {
    constructor(
        private authService: AuthService,
        private webWorkerService: WebWorkerService,
    ) {}

    async checkIsSessionActive() {
        const timeLeft = await this.authService.sessionTimeLeft();

        if (timeLeft > 0) {
            this.webWorkerService.createWorker(WorkerType.SessionLifetimeCheckTimeout, { timeout: timeLeft + 5000 }, async () => {
                await this.checkIsSessionActive();

                this.webWorkerService.removeWorker(WorkerType.SessionLifetimeCheckTimeout);
            });
        }
    }
}
