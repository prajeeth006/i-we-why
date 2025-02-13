import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

import { HomeService, LoginDialogService, LoginMessageKey } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { DialogComponent } from '@frontend/vanilla/shared/dialog';
import { padStart } from 'lodash-es';

import { InactivityScreenTrackingService } from './inactivity-screen-tracking.service';
import { InactivityScreenConfig } from './inactivity-screen.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe, OverlayModule, DialogComponent],
    selector: 'vn-inactivity-screen-session-overlay',
    templateUrl: './inactivity-screen-session-overlay.component.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/web-inactivity-screen/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class InactivityScreenSessionOverlayComponent implements OnInit {
    messages: { [attr: string]: string };
    text: string;

    constructor(
        public inactivityScreenConfig: InactivityScreenConfig,
        private loginDialogService: LoginDialogService,
        private overlayRef: OverlayRef,
        private tracking: InactivityScreenTrackingService,
        private homeService: HomeService,
    ) {}

    ngOnInit() {
        this.messages = this.inactivityScreenConfig.overlay?.messages || this.inactivityScreenConfig.resources.messages;
        const textMessage = this.messages.Overlay_Session_text;

        if (textMessage) {
            this.text = textMessage.replace('{MINUTES}', this.padStart(Math.floor(this.inactivityScreenConfig.idleTimeout / 60000) % 60));
        }
    }

    close() {
        this.tracking.trackSessionClose();
        this.overlayRef.detach();
        this.homeService.goTo();
    }

    okClose() {
        this.tracking.trackSessionOk();
        this.overlayRef.detach();
    }

    async login() {
        this.overlayRef.detach();
        await this.tracking.trackLogin();
        this.loginDialogService.open({
            openedBy: LoginMessageKey.Inactivity,
        });
    }

    private padStart(x: number): string {
        return padStart(x.toString(), 2, '0');
    }
}
