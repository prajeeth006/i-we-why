import { OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';

import { CommonMessages } from '@frontend/vanilla/core';

import { LoginTrackingService } from '../login-tracking.service';
import { BETSTATION_LOGIN_ERROR } from '../login.models';

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
        private trackingService: LoginTrackingService,
        @Inject(BETSTATION_LOGIN_ERROR) public error: string,
    ) {}

    ngOnInit() {
        this.trackingService.trackErrorMessageShown(this.error);
    }

    close() {
        this.trackingService.trackErrorMessageOk(this.error);
        this.overlayRef.detach();
    }
}
