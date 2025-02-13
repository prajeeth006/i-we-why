import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import {
    LocalStoreKey,
    LocalStoreService,
    RtmsMessage,
    RtmsService,
    RtmsType,
    TimeSpan,
    TotalTimePipe,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { FormatPipe } from '@frontend/vanilla/shared/browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { PlayBreakTrackingService } from './play-break-tracking.service';
import { PlayBreakConfig } from './play-break.client-config';
import { PlayBreakTimer, PlayBreakType } from './play-break.models';
import { PlayBreakService } from './play-break.service';

@Component({
    standalone: true,
    selector: 'vn-play-break-timer',
    templateUrl: 'play-break-timer.html',
    imports: [CommonModule, TotalTimePipe, FormatPipe],
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/player-break-panel/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlayBreakTimerComponent implements OnInit, OnDestroy {
    message: string | undefined;
    messages: { [key: string]: string } | undefined;
    playBreakTimer: PlayBreakTimer;
    remainingTime: TimeSpan;
    private unsubscribe = new Subject<void>();

    constructor(
        public playBreakTrackingService: PlayBreakTrackingService,
        private config: PlayBreakConfig,
        private webWorkerService: WebWorkerService,
        private rtmsService: RtmsService,
        private playBreakService: PlayBreakService,
        private changeDetectorRef: ChangeDetectorRef,
        private localStorageService: LocalStoreService,
    ) {}

    @HostBinding() get class(): string | undefined {
        return this.messages?.cssClass || undefined;
    }

    ngOnInit() {
        this.playBreakService.playBreakTimer
            .pipe(
                filter((timer: PlayBreakTimer | null): timer is PlayBreakTimer => timer !== null && timer.endTime > new Date()),
                takeUntil(this.unsubscribe),
            )
            .subscribe((playBreakTimer: PlayBreakTimer) => {
                const breakType = this.localStorageService.get<string>(LocalStoreKey.PlayBreakType) || '';
                this.playBreakTrackingService.trackHeaderMessageShown(breakType, playBreakTimer.playBreakInGc);
                this.playBreakTimer = playBreakTimer;
                this.messages = this.config.templates.breaktimer?.messages;
                this.stopTimer();
                this.createPlayBreakWorker();
            });

        this.rtmsService.messages
            .pipe(
                filter((message: RtmsMessage) => message.type === RtmsType.PLAY_BREAK_END_EVENT),
                takeUntil(this.unsubscribe),
            )
            .subscribe(() => this.stopTimer());
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.stopTimer();
        this.localStorageService.remove(LocalStoreKey.PlayBreakType);
    }

    private createPlayBreakWorker() {
        this.webWorkerService.createWorker(WorkerType.PlayBreakTimerInterval, { interval: 1000 }, () => this.updateTimer());
    }

    private updateTimer() {
        this.remainingTime = new TimeSpan(Math.floor(this.playBreakTimer.endTime.getTime() - new Date().getTime()));

        if (this.messages && this.remainingTime.totalSeconds > 0) {
            this.message =
                this.messages[
                    `${this.playBreakTimer.event}-${this.playBreakTimer.playBreakInGc ? PlayBreakType.PLAY_BREAK : PlayBreakType.LONG_SESSION_BREAK}`
                ];
            this.changeDetectorRef.detectChanges();
        } else {
            this.stopTimer();
        }
    }

    private stopTimer() {
        this.webWorkerService.removeWorker(WorkerType.PlayBreakTimerInterval);
        this.message = undefined;
    }
}
