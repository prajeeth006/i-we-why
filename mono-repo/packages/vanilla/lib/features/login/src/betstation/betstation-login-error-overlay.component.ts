import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { CommonMessages } from '@frontend/vanilla/core';

import { BetstationLoginTrackingService } from './betstation-login-tracking.service';
import { BETSTATION_LOGIN_ERROR } from './betstation-login.models';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
    selector: 'vn-betstation-login-error-overlay',
    templateUrl: 'betstation-login-error-overlay.component.html',
})
export class BetstationLoginErrorOverlayComponent implements OnInit {
    constructor(
        public commonMessages: CommonMessages,
        private overlayRef: OverlayRef,
        private trackingService: BetstationLoginTrackingService,
        @Inject(BETSTATION_LOGIN_ERROR) private error: string,
    ) {}
    message: string;

    ngOnInit(): void {
        this.message = this.error;
        this.trackingService.trackErrorMessageShown(this.message);
    }

    close() {
        this.trackingService.trackErrorMessageOk(this.message);
        this.overlayRef.detach();
    }
}
