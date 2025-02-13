import { Injectable, inject } from '@angular/core';

import { TimerService as PlatformRtmsTimerService } from '@rtms/client/lib/timer';

import { TimerService } from '../browser/timer.service';

// TODO: Rework using WebWorker with unique ID to ensure the callback is executed.
@Injectable({
    providedIn: 'root',
})
export class RtmsTimerService implements PlatformRtmsTimerService {
    private timerService = inject(TimerService);

    setTimeout(operation: () => void, timeout: number): NodeJS.Timeout {
        return this.timerService.setTimeoutOutsideAngularZone(operation, timeout);
    }

    setInterval(operation: () => void, timeout: number): NodeJS.Timer {
        return this.timerService.setIntervalOutsideAngularZone(operation, timeout);
    }

    clearTimeout(id: NodeJS.Timeout | string | number | undefined) {
        this.timerService.clearTimeout(id);
    }

    clearInterval(id: NodeJS.Timeout | string | number | undefined) {
        this.timerService.clearInterval(id);
    }
}
