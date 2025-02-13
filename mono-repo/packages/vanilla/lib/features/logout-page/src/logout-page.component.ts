import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';

import {
    AuthService,
    ClientConfigService,
    NavigationService,
    TrackingData,
    TrackingService,
    UserConfig,
    UserService,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';
import { CrossProductLayoutComponent } from '@frontend/vanilla/features/cross-product-layout';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { RouteDataService } from '@frontend/vanilla/shared/routing';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe, CrossProductLayoutComponent, HeaderBarComponent],
    selector: 'lh-logout-page',
    templateUrl: 'logout-page.html',
})
export class LogoutPageComponent implements OnInit {
    readonly content = signal<ViewTemplateForClient | undefined>(this.routeDataService.getInitData()?.content);

    constructor(
        private config: ClientConfigService,
        private routeDataService: RouteDataService,
        private authService: AuthService,
        private userService: UserService,
        private navigationService: NavigationService,
        private trackingService: TrackingService,
    ) {}

    ngOnInit() {
        this.track('contentView', this.content()?.validation);

        if (this.userService.isAuthenticated) {
            this.authService.logout({ redirectAfterLogout: false }).then(() => this.config.reload([UserConfig]));
        }
    }

    onBackClick() {
        this.track('Event.Tracking', {
            ...this.content()?.form?.button?.htmlAttributes,
            'component.EventDetails': 'back',
        });

        this.navigationService.storeReturnUrl();
        this.navigationService.goToReturnUrl();
    }

    onCloseClick() {
        this.track('Event.Tracking', {
            ...this.content()?.form?.button?.htmlAttributes,
            'component.EventDetails': 'closex',
        });

        this.navigationService.goToLastKnownProduct();
    }

    onButtonClick() {
        this.track('Event.Tracking', this.content()?.form?.button?.htmlAttributes);

        this.navigationService.storeReturnUrl();
        this.navigationService.goToReturnUrl();
    }

    private track(event: string, trackingData?: TrackingData) {
        if (trackingData) {
            this.trackingService.triggerEvent(event, trackingData);
        }
    }
}
