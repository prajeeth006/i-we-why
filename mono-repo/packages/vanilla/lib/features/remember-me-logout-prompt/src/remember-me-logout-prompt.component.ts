import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NativeAppService, NativeEventType, RememberMeService, TrackingService } from '@frontend/vanilla/core';
import { CrossProductLayoutComponent } from '@frontend/vanilla/features/cross-product-layout';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { firstValueFrom } from 'rxjs';

import { RememberMeLogoutPromptConfig } from './remember-me-logout-prompt.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe, CrossProductLayoutComponent, HeaderBarComponent],
    selector: 'vn-rememberme-logout-prompt',
    templateUrl: 'remember-me-logout-prompt.html',
})
export class RememberMeLogoutPromptComponent {
    constructor(
        public config: RememberMeLogoutPromptConfig,
        private nativeAppService: NativeAppService,
        private rememberMeService: RememberMeService,
        private trackingService: TrackingService,
    ) {}

    rememberMe() {
        this.trackAction('remember me and close cta');
        this.nativeAppService.sendToNative({
            eventName: NativeEventType.REMEMBER_ME_CLOSE,
        });
    }

    close() {
        this.trackAction('close link');

        firstValueFrom(this.rememberMeService.logout()).then(() => {
            this.nativeAppService.sendToNative({
                eventName: NativeEventType.REMEMBER_ME_CLOSE,
            });
        });
    }

    private trackAction(eventDetails: string) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'logout',
            'component.LabelEvent': 'remember me',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'post logout cta click',
            'component.LocationEvent': 'remember me logout prompt',
            'component.EventDetails': eventDetails,
            'component.URLClicked': 'not applicable',
        });
    }
}
