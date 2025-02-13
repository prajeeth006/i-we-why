import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, computed } from '@angular/core';

import { DynamicHtmlDirective, ToastrQueueService, ToastrSchedule, ToastrType, ViewTemplateForClient } from '@frontend/vanilla/core';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { BasePlayBreakOverlayComponent } from './base-play-break-overlay.component';
import { PlayBreakTrackingService } from './play-break-tracking.service';
import { PlayBreakConfig } from './play-break.client-config';
import { PlayBreakService } from './play-break.service';

@Component({
    standalone: true,
    selector: 'vn-play-break-notification-overlay',
    templateUrl: 'play-break-notification-overlay.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/player-break-panel/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, DialogComponent, ImageComponent, DynamicHtmlDirective, FormatPipe, TrustAsHtmlPipe],
})
export class PlayBreakNotificationOverlayComponent extends BasePlayBreakOverlayComponent implements OnInit {
    readonly content = computed<ViewTemplateForClient | undefined>(() =>
        this.notification().selectedPlayBreakDuration && this.notification().selectedPlayBreakStart
            ? this.config.templates[`breakshedulednotification${this.breakType()}`]
            : this.config.templates[`breakstartednotification${this.breakType()}`],
    );

    readonly selectedPlayBreakStart = computed<string>(() =>
        this.notification().selectedPlayBreakStart === 0
            ? this.content()?.messages?.Now || ''
            : this.content()?.messages?.In + this.getSelectedPlayBreakStart(this.content()?.validation)(),
    );

    constructor(
        private config: PlayBreakConfig,
        private playBreakTrackingService: PlayBreakTrackingService,
        private toastrQueueService: ToastrQueueService,
        playBreakService: PlayBreakService,
        overlayRef: OverlayRef,
    ) {
        super(playBreakService, overlayRef);
    }

    ngOnInit() {
        this.playBreakTrackingService.trackNotificationPopupDisplayed(
            this.getSelectedPlayBreakDuration(this.content()?.validation)(),
            this.breakType(),
            this.playBreakInGc(),
        );
    }

    continue() {
        this.showBreakStartToaster(ToastrSchedule.Immediate);
        this.playBreakTrackingService.trackNotificationPopupOk(this.playBreakInGc(), 'confirmation overlay ', this.breakType());
        this.closeOverlay();
    }

    contactUs() {
        this.showBreakStartToaster(ToastrSchedule.AfterNextNavigation);
        this.playBreakTrackingService.trackNotificationPopupContactUs(this.playBreakInGc(), this.breakType());
    }

    private showBreakStartToaster(schedule: ToastrSchedule) {
        let toasterName: ToastrType;

        if (this.notification().selectedPlayBreakStart) {
            toasterName = this.playBreakInGc() ? ToastrType.PlayBreakConfirmationDelayed : ToastrType.PlayBreakConfirmationDelayedLongSession;
        } else {
            toasterName = this.playBreakInGc() ? ToastrType.PlayBreakConfirmation : ToastrType.PlayBreakConfirmationLongSession;
        }

        this.toastrQueueService.add(toasterName, {
            placeholders: {
                duration: this.notification().selectedPlayBreakStart
                    ? this.getSelectedPlayBreakStart(this.content()?.validation)()
                    : this.getSelectedPlayBreakDuration(this.content()?.validation)(),
                interceptor: this.playBreakInGc() ? 'hard interceptor' : 'soft interceptor',
            },
            schedule,
        });
    }
}
