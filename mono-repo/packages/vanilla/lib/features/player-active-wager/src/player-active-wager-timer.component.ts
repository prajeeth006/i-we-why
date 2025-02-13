import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation, inject } from '@angular/core';

import {
    ClockService,
    HtmlNode,
    LocalStoreKey,
    LocalStoreService,
    SlotName,
    TimeFormat,
    TimeSpan,
    UnitFormat,
    UserService,
    WINDOW,
    WebWorkerService,
    WindowEvent,
    WorkerType,
} from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { PlayerActiveWagerOverlayService } from './player-active-wager-overlay.service';
import { PlayerActiveWagerConfig } from './player-active-wager.client-config';

@Component({
    standalone: true,
    imports: [CommonModule, TrustAsHtmlPipe, IconCustomComponent],
    selector: 'vn-player-active-wager-timer',
    templateUrl: 'player-active-wager-timer.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/lugas-time/wager-timer.scss'],
    host: { class: 'player-active-wager-container' },
    encapsulation: ViewEncapsulation.None,
})
export class PlayerActiveWagerTimerComponent implements OnInit, OnDestroy {
    durationWithoutText: boolean;
    elapsedTime: number;
    timer: string;

    private savedLugasTimestamp: number;
    private htmlNodeClassName: string;
    private listener: () => void;
    readonly #window = inject(WINDOW);

    constructor(
        public config: PlayerActiveWagerConfig,
        public playerActiveWagerOverlayService: PlayerActiveWagerOverlayService,
        private renderer2: Renderer2,
        private userService: UserService,
        private htmlNode: HtmlNode,
        private localStoreService: LocalStoreService,
        private webWorkerService: WebWorkerService,
        private clockService: ClockService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        const elapsedLugasText = this.config.content.messages?.ElapsedLugasText || '';
        this.durationWithoutText = elapsedLugasText.trim().length <= '{duration}'.length;

        this.htmlNodeClassName = `${SlotName.HeaderTopItems}-lugas-timer-shown`;
        const storedTimestamp = this.localStoreService.get<string>(LocalStoreKey.LugasTimestamp);

        if (this.userService.isAuthenticated && storedTimestamp) {
            this.htmlNode.setCssClass(this.htmlNodeClassName, true);
        }

        this.savedLugasTimestamp = storedTimestamp ? Date.parse(storedTimestamp) : 0;

        this.updateTimer();
        this.createActiveWagerWorker();

        this.listener = this.renderer2.listen('document', WindowEvent.VisibilityChange, () => {
            if (this.#window.document.hidden) {
                this.webWorkerService.removeWorker(WorkerType.PlayerActiveWagerTimerInterval);
                this.createActiveWagerWorker();
            } else {
                const elapsedTime = this.webWorkerService.removeWorker(WorkerType.PlayerActiveWagerTimerInterval);
                this.updateTimer(elapsedTime);
                this.createActiveWagerWorker();
            }
        });
    }

    ngOnDestroy() {
        this.htmlNode.setCssClass(this.htmlNodeClassName, false);
        this.webWorkerService.removeWorker(WorkerType.PlayerActiveWagerTimerInterval);

        if (this.listener) {
            this.listener();
        }
    }

    private createActiveWagerWorker() {
        this.webWorkerService.createWorker(WorkerType.PlayerActiveWagerTimerInterval, { interval: 1000 }, () => {
            this.updateTimer();
            this.changeDetectorRef.detectChanges();
        });
    }

    private updateTimer(addedTime?: number) {
        this.elapsedTime = Math.floor((Date.now() - (this.savedLugasTimestamp + (addedTime || 0))) / 1000);
        const elapsedTimeSpan = TimeSpan.fromSeconds(this.elapsedTime);

        this.timer = this.clockService.toTotalTimeStringFormat(elapsedTimeSpan, {
            unitFormat: UnitFormat.Hidden,
            hideZeros: false,
            timeFormat: TimeFormat.HMS,
        });
    }
}
