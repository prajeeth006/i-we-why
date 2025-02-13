import { Injectable } from '@angular/core';

import { ClockService, SharedFeaturesApiService, TimeFormat, TimeSpan, UnitFormat } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, Subject, firstValueFrom } from 'rxjs';

import { PlayBreak, PlayBreakAcknowledge, PlayBreakAcknowledgeRequest, PlayBreakTimer, PlayBreakWorkflow } from './play-break.models';

@Injectable({
    providedIn: 'root',
})
export class PlayBreakService {
    get playBreak(): Observable<PlayBreak | null> {
        return this.playBreakSubject;
    }

    get playBreakTimer(): Observable<PlayBreakTimer | null> {
        return this.playBreakTimerSubject;
    }

    get playBreakWorkflow(): Observable<PlayBreakWorkflow> {
        return this.playBreakWorkflowSubject;
    }

    private loaded: boolean;
    private playBreakSubject = new BehaviorSubject<PlayBreak | null>(null);
    private playBreakTimerSubject: BehaviorSubject<PlayBreakTimer | null> = new BehaviorSubject<PlayBreakTimer | null>(null);
    private playBreakWorkflowSubject = new Subject<PlayBreakWorkflow>();

    constructor(
        private apiService: SharedFeaturesApiService,
        private clockService: ClockService,
    ) {}

    load() {
        if (!this.loaded) {
            this.loaded = true;
            this.apiService.get('playbreak').subscribe((playBreak: PlayBreak) => {
                this.playBreakSubject.next(playBreak);
            });
        }
    }

    acknowledgePlayBreak(request: PlayBreakAcknowledgeRequest): Promise<PlayBreakAcknowledge> {
        return firstValueFrom(this.apiService.post('playbreak/acknowledge', request));
    }

    startPlayBreakTimer(timer: PlayBreakTimer) {
        this.playBreakTimerSubject.next(timer);
    }

    changePlayBreakWorkflow(workflow: PlayBreakWorkflow) {
        this.playBreakWorkflowSubject.next(workflow);
    }

    formatTime(timeSpan: TimeSpan, validation?: { [key: string]: string }): string {
        return this.clockService.toTotalTimeStringFormat(timeSpan, {
            timeFormat: <TimeFormat>validation?.timeFormat || TimeFormat.MS,
            hideZeros: !!validation?.hideZeros,
            unitFormat: validation?.useShortTime ? UnitFormat.Short : UnitFormat.Long,
        });
    }
}
