import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, computed } from '@angular/core';

import { DynamicHtmlDirective } from '@frontend/vanilla/core';
import { FormatPipe } from '@frontend/vanilla/shared/browser';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';

import { BasePlayBreakOverlayComponent } from './base-play-break-overlay.component';
import { PlayBreakTrackingService } from './play-break-tracking.service';
import { PlayBreakConfig } from './play-break.client-config';
import { PlayBreakWorkflowStep } from './play-break.models';
import { PlayBreakService } from './play-break.service';

@Component({
    standalone: true,
    selector: 'vn-play-break-confirmation',
    templateUrl: 'play-break-confirmation.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/player-break-panel/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, DialogComponent, FormatPipe, DynamicHtmlDirective],
})
export class PlayBreakConfirmationComponent extends BasePlayBreakOverlayComponent implements OnInit {
    readonly selectedPlayBreakStart = computed<string>(() =>
        this.notification().selectedPlayBreakStart === 0
            ? this.config.templates.breakconfirmation?.messages?.Now || ''
            : this.config.templates.breakconfirmation?.messages?.In +
              this.getSelectedPlayBreakStart(this.config.templates.breakconfirmation?.validation)(),
    );

    constructor(
        public config: PlayBreakConfig,
        private playBreakTrackingService: PlayBreakTrackingService,
        playBreakService: PlayBreakService,
        overlayRef: OverlayRef,
    ) {
        super(playBreakService, overlayRef);
    }

    ngOnInit() {
        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepConfirmLoad();
        } else {
            this.playBreakTrackingService.trackConfirmationDrawerOpened();
        }
    }

    changeSettings() {
        this.playBreakService.changePlayBreakWorkflow({
            step: PlayBreakWorkflowStep.DurationSelection,
            notification: this.notification(),
        });

        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepDrawerClick(
                'soft interceptor',
                'confirmation drawer - lsl24',
                'change duration',
                'not applicable',
            );
        } else {
            this.playBreakTrackingService.trackConfirmationDrawerChangeDuration();
        }

        this.closeOverlay();
    }

    confirm() {
        this.closeOverlay();

        this.playBreakService.changePlayBreakWorkflow({
            step: PlayBreakWorkflowStep.SubmitBreakSelections,
            notification: this.notification(),
        });

        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepDrawerClick(
                'soft interceptor',
                'confirmation drawer - lsl24',
                'confirm break',
                'not applicable',
            );
        } else {
            this.playBreakTrackingService.trackConfirmationDrawerConfirm();
        }
    }

    close() {
        if (this.breakType()) {
            this.playBreakTrackingService.trackLSL24StepDrawerClick('soft interceptor', 'confirmation drawer - lsl24', 'cancel', 'not applicable');
        } else {
            this.playBreakTrackingService.trackConfirmationDrawerCancel();
        }

        this.closeOverlay();
    }
}
