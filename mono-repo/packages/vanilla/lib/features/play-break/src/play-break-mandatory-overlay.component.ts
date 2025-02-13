import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, computed } from '@angular/core';

import { DynamicHtmlDirective, MenuAction, MenuActionsService, ViewTemplateForClient } from '@frontend/vanilla/core';
import { FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { BasePlayBreakOverlayComponent } from './base-play-break-overlay.component';
import { PlayBreakTrackingService } from './play-break-tracking.service';
import { PlayBreakConfig } from './play-break.client-config';
import { PlayBreakService } from './play-break.service';

@Component({
    standalone: true,
    selector: 'vn-play-mandatory-break-overlay',
    templateUrl: 'play-break-mandatory-overlay.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/player-break-panel/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, DialogComponent, ImageComponent, DynamicHtmlDirective, FormatPipe, TrustAsHtmlPipe],
})
export class PlayBreakMandatoryOverlayComponent extends BasePlayBreakOverlayComponent implements OnInit {
    readonly content = computed<ViewTemplateForClient | undefined>(() => this.config.templates[`mandatorybreak${this.breakType()}`]);

    constructor(
        public config: PlayBreakConfig,
        private playBreakTrackingService: PlayBreakTrackingService,
        private menuActionsService: MenuActionsService,
        playBreakService: PlayBreakService,
        overlayRef: OverlayRef,
    ) {
        super(playBreakService, overlayRef);
    }

    ngOnInit() {
        this.playBreakTrackingService.trackHardInterceptorShown(this.breakType());
    }

    close() {
        this.playBreakTrackingService.trackHardInterceptorTakeBreak(this.breakType());
        this.closeOverlay();
    }

    async openChat() {
        if (!this.breakType()) {
            this.playBreakTrackingService.trackHardInterceptorLiveChat();
        }

        await this.menuActionsService.invoke(MenuAction.OPEN_ZENDESK_CHAT, 'player-break-mandatory');
    }
}
