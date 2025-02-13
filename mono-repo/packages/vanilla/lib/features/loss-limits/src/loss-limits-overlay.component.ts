import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, input, signal } from '@angular/core';

import { DynamicHtmlDirective, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';

import { LossLimitsTrackingService } from './loss-limit-tracking-service';
import { LossLimitsItemComponent } from './loss-limits-item.component';
import { LossLimitsConfig } from './loss-limits.client-config';
import { LossLimitsDetails } from './loss-limits.models';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LossLimitsItemComponent, CommonModule, DynamicHtmlDirective, OverlayModule, MenuItemComponent, HeaderBarComponent],
    selector: 'vn-loss-limits-overlay',
    templateUrl: 'loss-limits-overlay.html',
})
export class LossLimitsOverlayComponent implements OnInit, OnDestroy {
    readonly lossLimitsDetails = input.required<LossLimitsDetails[]>();
    readonly buttonsDisabled = signal<boolean>(true);
    readonly config = signal(this.lossLimitsConfig);
    closeMessage = computed<string | undefined>(() =>
        this.config().content.messages?.CloseMessage?.replace('{0}', this.config().closeWaitingTime.toString()),
    );

    constructor(
        private lossLimitsConfig: LossLimitsConfig,
        private overlayRef: OverlayRef,
        private webWorkerService: WebWorkerService,
        private lossLimitsTrackingService: LossLimitsTrackingService,
    ) {}

    ngOnInit() {
        this.lossLimitsTrackingService.trackLoad(this.lossLimitsDetails());

        let countdown = this.config().closeWaitingTime;

        // TODO: Check if works correctly after removing Angular zone
        this.webWorkerService.createWorker(WorkerType.LossLimitsInterval, { interval: 1000, runInsideAngularZone: true }, () => {
            countdown--;

            this.closeMessage = computed(() => this.config().content.messages?.CloseMessage?.replace('{0}', countdown.toString()));

            if (countdown <= 0) {
                this.buttonsDisabled.set(false);
                this.webWorkerService.removeWorker(WorkerType.LossLimitsInterval);
            }
        });
    }

    ngOnDestroy() {
        this.webWorkerService.removeWorker(WorkerType.LossLimitsInterval);
    }

    close() {
        this.lossLimitsTrackingService.trackClose(this.lossLimitsDetails());
        this.overlayRef.detach();
    }
}
