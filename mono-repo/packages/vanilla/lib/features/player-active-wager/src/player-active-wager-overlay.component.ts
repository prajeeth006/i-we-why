import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { ClockService, TimeFormat, TimeSpan, UnitFormat, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';

import { PLAYER_ACTIVE_WAGER_TIME } from './player-active-wager-overlay.service';
import { PlayerActiveWagerConfig } from './player-active-wager.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DialogComponent, TrustAsHtmlPipe],
    selector: 'vn-player-active-wager-overlay',
    templateUrl: 'player-active-wager-overlay.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/lugas-time/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PlayerActiveWagerOverlayComponent implements OnInit, OnDestroy {
    timeUnits: string[];

    constructor(
        public config: PlayerActiveWagerConfig,
        private webWorkerService: WebWorkerService,
        private clockService: ClockService,
        private overlayRef: OverlayRef,
        private changeDetectorRef: ChangeDetectorRef,
        @Inject(PLAYER_ACTIVE_WAGER_TIME) private time: number,
    ) {}

    ngOnInit() {
        this.updateTimer();

        this.webWorkerService.createWorker(WorkerType.PlayerActiveWagerPopupTimerInterval, { interval: 1000 }, () => {
            this.updateTimer();
            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.webWorkerService.removeWorker(WorkerType.PlayerActiveWagerPopupTimerInterval);
    }

    close() {
        this.overlayRef.detach();
    }

    private updateTimer() {
        this.time++;

        const elapsedTimeSpan = TimeSpan.fromSeconds(this.time);

        this.timeUnits = this.clockService
            .toTotalTimeStringFormat(elapsedTimeSpan, {
                unitFormat: UnitFormat.Hidden,
                hideZeros: false,
                timeFormat: TimeFormat.HMS,
            })
            .split(':');
    }
}
