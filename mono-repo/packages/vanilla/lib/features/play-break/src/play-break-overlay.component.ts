import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewEncapsulation, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DynamicHtmlDirective, Logger, ViewTemplateForClient } from '@frontend/vanilla/core';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { filter } from 'rxjs/operators';

import { BasePlayBreakOverlayComponent } from './base-play-break-overlay.component';
import { PlayBreakTrackingService } from './play-break-tracking.service';
import { PlayBreakConfig } from './play-break.client-config';
import { PlayBreakAcknowledgeRequest, PlayBreakAction, PlayBreakWorkflow, PlayBreakWorkflowStep } from './play-break.models';
import { PlayBreakService } from './play-break.service';

/**
 * @description Parent Play Break overlay. Can have child overlays - drawers.
 */
@Component({
    standalone: true,
    selector: 'vn-play-break-overlay',
    templateUrl: 'play-break-overlay.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/player-break-panel/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, DialogComponent, ImageComponent, DynamicHtmlDirective],
})
export class PlayBreakOverlayComponent extends BasePlayBreakOverlayComponent implements OnInit {
    readonly content = computed<ViewTemplateForClient | undefined>(() =>
        this.isPlayBreakSet()
            ? this.config.templates?.[`scheduledbreakprompt${this.breakType()}`]
            : this.config.templates?.[`nonscheduledbreakprompt${this.breakType()}`],
    );

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private config: PlayBreakConfig,
        private playBreakTrackingService: PlayBreakTrackingService,
        private log: Logger,
        playBreakService: PlayBreakService,
        overlayRef: OverlayRef,
    ) {
        super(playBreakService, overlayRef);
    }

    ngOnInit() {
        this.playBreakService.playBreakWorkflow
            .pipe(
                filter((workflow: PlayBreakWorkflow) => workflow.step === PlayBreakWorkflowStep.SubmitBreakSelections),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(async () => {
                await this.sendAcknowledgement(true);
                this.closeOverlay();
            });

        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24InterceptorLoad(this.isPlayBreakSet());
        } else {
            this.playBreakTrackingService.trackInterceptorShown(this.isPlayBreakSet());
        }
    }

    takeBreakNow() {
        this.playBreakService.changePlayBreakWorkflow({
            step: this.isPlayBreakSet() ? PlayBreakWorkflowStep.SubmitBreakSelections : PlayBreakWorkflowStep.DurationSelection,
            notification: this.notification(),
        });

        if (this.breakType() === '24h') {
            this.playBreakTrackingService.trackLSL24InterceptorClick('take short break', 'not applicable', this.isPlayBreakSet());
        } else {
            this.playBreakTrackingService.trackTakeShortBreak(this.isPlayBreakSet());
        }
    }

    async takeBreakLater() {
        await this.sendAcknowledgement(false);

        if (this.breakType() === '24h') {
            this.playBreakTrackingService.trackLSL24TakePlayBreakYesNo('not applicable', 'continue playing');
            this.playBreakTrackingService.trackLSL24InterceptorClick('not right now', 'not applicable', this.isPlayBreakSet());
        } else {
            this.playBreakTrackingService.trackClose(this.isPlayBreakSet());
        }

        this.closeOverlay();
    }

    async close() {
        await this.sendAcknowledgement(false);

        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24InterceptorClick('close x', 'not applicable', this.isPlayBreakSet());
        } else {
            this.playBreakTrackingService.trackHeaderClose(this.isPlayBreakSet());
        }

        this.closeOverlay();
    }

    private async sendAcknowledgement(takeBreak: boolean) {
        try {
            const request: PlayBreakAcknowledgeRequest = {
                actionName: PlayBreakAction.Later,
                cstEventId: this.notification().cstEventId,
                playBreakDuration: this.notification().selectedPlayBreakDuration || 0,
                afterXMinutes: this.notification().selectedPlayBreakStart || 0,
            };

            if (takeBreak) {
                request.actionName = request.afterXMinutes ? PlayBreakAction.After : PlayBreakAction.Now;

                if (this.breakType() === '24h') {
                    this.playBreakTrackingService.trackLSL24BreakTimePlayerSet(
                        request.playBreakDuration.toString(),
                        request.afterXMinutes.toString(),
                    );
                }
            }

            const response = await this.playBreakService.acknowledgePlayBreak(request);

            if (response.responseCode && (response.responseCode < 0 || response.responseCode === 101)) {
                this.log.error(response);
            }
        } catch (error: any) {
            this.log.error(error);
        }
    }
}
